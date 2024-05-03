import { useEffect, useState , useRef} from "react";
import { useLocation } from 'react-router-dom';
import { Table, Button, Modal, Form } from "react-bootstrap";
import API from 'services/Api'
import { v4 as uuidv4 } from 'uuid';

const TABLE_HEADERS = ["#", "Scholar ID", "Leave Start", "Leave End", "Leave Letter", "Status",  "Action"];

function ScholarLeaveApplication() {
  const location = useLocation();

  const [leaverequests, setLeaveRequests] = useState([]);
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    leave_start: '',
    leave_end: '',
    leave_letter: '',
    status: 'pending',
    comment: '',
  });
  const letterFile = useRef(null);

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
  const handleFileChange = (fieldName, event) => {
    const file = event.target.files[0];
      setNewLeaveRequest((prevState) => ({
      ...prevState,
        [fieldName]: file,
      }));
  };

  const fetchRequests = async () => {
    API.request('leave_application/retrieveAll', {}, response => {
      if (response && response.data) {
        setLeaveRequests(response.data)
        console.log(response.data);
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
    const formData = new FormData();
      formData.append('leave_letter', letterFile.current.files[0]);
      formData.append('leave_start', newLeaveRequest.leave_start);
      formData.append('leave_end', newLeaveRequest.leave_end);
      formData.append('status', newLeaveRequest.status);
      console.log(formData);
      API.uploadFile('leave_application/create', formData, response => {
        if (response && response.data) {
          console.log('Data created successfully', response.data);
          const newTask = {...response.data, tempId: uuidv4() };
          setLeaveRequests(prevTasks => [...prevTasks, newTask]);
          fetchRequests();
        } else {
          console.log('error on retrieve');
        }
      }, error => {
        console.log(error)
      });
    setShow(false);
  };

    //edit 
    const editRequest = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      //formData.append('user_id', scholar.user_id);
      formData.append('id', selectedRequest.id);
      formData.append('leave_letter', letterFile.current.files[0]);
      formData.append('leave_start', selectedRequest.leave_start);
      formData.append('leave_end', selectedRequest.leave_end);
      formData.append('status', selectedRequest.status);
      //console.log(selectedRequest.id);
      API.uploadFile('leave_application/updateOne', formData, response => {
        if (response && response.data) {
          console.log('Data updated successfully', response.data);
          fetchRequests();
        } else {
          console.log('error on retrieve');
        }
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
  useEffect(() => {
    fetchRequests();
  }, []);


  return (
    <>
    <h2>This is the Scholar Leave Request page</h2>
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
              {/* <Form.Control type="text" placeholder=" Ex: 2024-03-19" onChange={(event) => handleInputChange('leave_start', event)} /> */}
              <input type="date" placeholder=" Ex: 2024-03-19" style={{marginLeft:'1rem'}} onChange={(event) => handleInputChange('leave_start', event)}></input>
          </Form.Group>
          <Form.Group controlId="formStudy">
              <Form.Label>Leave End</Form.Label>
              {/* <Form.Control type="text" placeholder="Ex: 2024-03-19" onChange={(event) => handleInputChange('leave_end', event)}  /> */}
              <input type="date" placeholder=" Ex: 2024-03-19" style={{marginLeft:'1rem'}} onChange={(event) => handleInputChange('leave_end', event)}></input>
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Leave Letter</Form.Label>
              <Form.Control type="file" placeholder="Enter Study Category" onChange={(event) => handleInputChange('leave_letter', event)} ref={letterFile}/>
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
              {/* <Form.Control type="text" placeholder="Midterm file" onChange={(event) => handleInputChange('leave_start', event)} /> */}
              <input type="date" placeholder=" Ex: 2024-03-19" style={{marginLeft:'1rem'}} 
                            onChange={(event) => {
                              // Extract the new value from the event
                              const newValue = event.target.value;
                              // Update the setSelectedRequest state with the new leave_start
                              setSelectedRequest(prevTask => ({...prevTask, leave_start: newValue }));
                            }} 
                            value={selectedRequest?.leave_start} 
                          />
          </Form.Group>
          <Form.Group controlId="formStudy">
              <Form.Label>Leave End</Form.Label>
              {/* <Form.Control type="text" placeholder="Final file" onChange={(event) => handleInputChange('leave_end', event)}  /> */}
              <input type="date" placeholder=" Ex: 2024-03-19" style={{marginLeft:'1rem'}} 
                            onChange={(event) => {
                              // Extract the new value from the event
                              const newValue = event.target.value;
                              // Update the setSelectedRequest state with the new leave_end
                              setSelectedRequest(prevTask => ({...prevTask, leave_end: newValue }));
                            }} 
                            value={selectedRequest?.leave_end} 
                          />
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Leave Letter</Form.Label>
              <Form.Control type="file" placeholder="Upload Leave Upload" onChange={(event) => handleFileChange('leave_letter', event)} ref={letterFile}/>
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Status</Form.Label>
              <Form.Control type="text" placeholder="" 
                            onChange={(event) => {
                              // Extract the new value from the event
                              const newValue = event.target.value;
                              // Update the setSelectedRequest state with the new status
                              setSelectedRequest(prevTask => ({...prevTask, status: newValue }));
                            }} 
                            value={selectedRequest?.status} 
                          />
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
                <tr key={request.id || request.tempId}>
                  <td>{index + 1}</td>
                  <td>{request.user_id}</td>
                  <td>{request.leave_start}</td>
                  <td>{request.leave_end}</td>
                  <td> <a href={request.leave_letter}>View File</a></td>
                  <td>{request.status}</td>
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