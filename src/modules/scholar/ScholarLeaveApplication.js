import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { Table, Button, Modal, Form } from "react-bootstrap";
import API from 'services/Api'

const TABLE_HEADERS = ["#", "Leave Start", "Leave End", "Leave Letter", "Status", "Comment", "Action"];

function ScholarLeaveApplication() {
  const location = useLocation();
  const scholar = location.state.scholar;

  const [leaverequests, setLeaveRequests] = useState([]);
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    leave_start: '',
    leave_end: '',
    leave_letter: '',
    status: 'pending',
    comment: '',
  });

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  
  //edit modal
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editRequestShow, setEditRequestShow] = useState(false);
  
  const handleEditRequestShow = (request) => {
    setSelectedRequest(request);
    setEditRequestShow(true);
  }
  const handleEditRequestClose = () => setEditRequestShow(false);

  
  //delete confimation modal
  const [deleteRequestShow, setDeleteRequestShow] = useState(false);
  const handleDeleteRequestShow = (request) => {
  setSelectedRequest(request);
  setDeleteRequestShow(true);
  }
  const handleDeleteRequestClose = () => setDeleteRequestShow(false);

  //input binding; not sure if works for files
  const handleInputChange = (fieldName, event) => {
    setNewLeaveRequest(prevState => ({
        ...prevState,
        [fieldName]: event.target.value
    }));
  };

  const fetchRequests = async () => {
    API.request('leave_application/retrieveMultipleByParameter', { col: 'user_id', value: scholar.user_id }, response => {
      if (response && response.data) {
        // Make the second API call to retrieve account details
        setLeaveRequests(response.data)
      } else {
        console.log('error on retrieve');
      }
    }, error => {
      console.log(error);
    });
  }

  
  //create
  const createRequest = async (e) => {
    e.preventDefault();
    API.request('leave_application/create', {
      user_id: scholar.user_id,
      leave_start: newLeaveRequest.leave_start,
      leave_end: newLeaveRequest.leave_end,
      leave_letter: newLeaveRequest.leave_letter,
      status: newLeaveRequest.status,
    }, response => {
      console.log('Data created successfully');
    }, error => {
      console.log(error)
    })
    setShow(false);
  };

    //edit 
    const editRequest = async (e) => {
      e.preventDefault();
      //console.log(selectedRequest.id);
      API.request('leave_application/update', {
        id: scholar.user_id,
        leave_start: selectedRequest.leave_start,
        leave_end: selectedRequest.leave_end,
        leave_reason: selectedRequest.leave_letter,
        status: 'pending',
        //comment: already set in the controller
      }, response => {
        console.log('Data updated successfully');
      }, error => {
        console.log(error)
      })
      //console.log(selectedPortfolio);
      setEditRequestShow(false);
    };

    //delete
    const deleteRequest = async (e) => {
      e.preventDefault();
      console.log(selectedRequest.id);
      API.request('leave_application/delete', {
        id: selectedRequest.id,
      }, response => {
        console.log('Data deleted successfully');
      }, error => {
        console.log(error)
      })
      //console.log(selectedPortfolio);
      //to see the changes in the table after and close the modal
      setLeaveRequests(leaverequests.filter(leaverequests => leaverequests.id !== selectedRequest.id));
      setDeleteRequestShow(false);
    };

  console.log(leaverequests);
  useEffect(() => {
    fetchRequests();
  }, []);


  return (
    <>
    <h3>welcome {scholar.account_details.last_name} {scholar.account_details.first_name}</h3>
    <p>This is the Scholar Leave Request page</p>
    <Button 
          onClick={handleShow} 
          style={{float:'right'}}> Add New Request </Button>
    {/* <table>
      <thead>
        <tr>
          <th>#</th>
          <th>user</th>
          <th>comment</th>
          <th>leave start</th>
          <th>leave end</th>
          <th>leave letter</th>
          <th>status</th>
        </tr>
      </thead>
      <tbody>
        {leaverequests.map((request, index) => (
          <tr key={request.id}>
            <td>{index+1}</td>
            <td>{request.user_id}</td>
            <td>{request.comment_id}</td>
            <td>{request.leave_start}</td>
            <td>{request.leave_end}</td>
            <td>{request.status}</td>
          </tr>
        ))}
      </tbody>
    </table> */}
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Leave Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Group controlId="formStudyName">
              <Form.Label>Leave Start</Form.Label>
              <Form.Control type="text" placeholder=" Enter Date" onChange={(event) => handleInputChange('leave_start', event)} />
          </Form.Group>
          <Form.Group controlId="formStudy">
              <Form.Label>Leave End</Form.Label>
              <Form.Control type="text" placeholder="Enter Date" onChange={(event) => handleInputChange('leave_end', event)}  />
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Leave Letter</Form.Label>
              <Form.Control type="file" placeholder="Enter Study Category" onChange={(event) => handleInputChange('leave_letter', event)}/>
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Status</Form.Label>
              <Form.Control type="text" placeholder="Enter Study Category" onChange={(event) => handleInputChange('status', event)} value={'pending'} readOnly/>
          </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={createRequest}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* to edit leave requests */}
      <Modal show={editRequestShow} onHide={handleEditRequestClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Group controlId="formStudyName">
              <Form.Label>Leave-Start</Form.Label>
              <Form.Control type="text" placeholder="Midterm file" onChange={(event) => handleInputChange('leave_start', event)} />
          </Form.Group>
          <Form.Group controlId="formStudy">
              <Form.Label>Leave End</Form.Label>
              <Form.Control type="text" placeholder="Final file" onChange={(event) => handleInputChange('leave_end', event)}  />
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Leave Letter</Form.Label>
              <Form.Control type="file" placeholder="Upload Leave Upload" onChange={(event) => handleInputChange('leave_letter', event)} />
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Status</Form.Label>
              <Form.Control type="text" placeholder="" onChange={(event) => handleInputChange('status', event)} value={selectedRequest?.status} />
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Comment</Form.Label>
              <Form.Control type="text" placeholder="" onChange={(event) => handleInputChange('comment', event)} value={selectedRequest?.comment} />
          </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditRequestClose}>
            Close
          </Button>
          <Button variant="primary" onClick={editRequest} >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      
       {/* delete confirmation modal for tasks */}
       <Modal show={deleteRequestShow} onHide={handleDeleteRequestClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteRequestClose}>
            No
          </Button>
          <Button variant="primary" onClick={deleteRequest}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    <div className="table-container">
        <Table>
          <thead>
            <tr>
              {TABLE_HEADERS.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leaverequests.map((request, index) => (
                <tr key={request.id}>
                  <td>{index + 1}</td>
                  <td>{request.leave_start}</td>
                  <td>{request.leave_end}</td>
                  <td> <input 
                          type="file" 
                          style={{ display: 'block', padding: 0, marginLeft: 'auto', marginRight: 'auto', marginTop: 0, marginBottom: 0, width: '200px' }} 
                          // onChange={(event) => this.handleFileChange(event, item.alias)}
                          // ref={(input) => {
                          //     this.fileInputs = { ...this.fileInputs, [item.alias]: input };
                          //  }}
                          /> </td>
                  <td>{request.status}</td>
                  <td>{request.comment_id}</td>
                  <td>
                    <span className='link' 
                          onClick={() => handleEditRequestShow(request)} 
                          >Edit</span>
                    <span className='link' 
                          onClick={() => handleDeleteRequestShow(request)}
                          >Delete</span>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

  
  export default ScholarLeaveApplication;