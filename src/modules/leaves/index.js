import { useEffect, useState , useRef} from "react";
import { useLocation } from 'react-router-dom';
import { Table, Button, Modal, Form } from "react-bootstrap";
import API from 'services/Api'
import { v4 as uuidv4 } from 'uuid';

const TABLE_HEADERS = ["#", "Scholar ID", "Leave Start", "Leave End", "Leave Letter", "Status", "Comments", "Action"];

function ScholarLeaveApplication() {
  const location = useLocation();

  const [leaverequests, setLeaveRequests] = useState([]);
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    id: '',
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

  //error modal
  const [validation, setValidation] = useState({ 
    id: true,
    leave_start: true,
    leave_end: true,
    leave_letter: true,
    status: true,
    comment: true,
  });
  const [error, setError] = useState([]);
  const [errorModal, setErrorModal] = useState(false);
  const errorClose = () => setErrorModal(false);
  const errorShow = () => setErrorModal(true);

  //edit modal
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editRequestShow, setEditRequestShow] = useState(false);
  
  const handleEditRequestShow = (request) => {
    //console.log(request);
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
    setValidation(prevState => ({
        ...prevState,
        [fieldName]: true
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
        //console.log(response.data);
      } else {
        console.log('error on retrieve');
      }
    }, error => {
      console.log(error);
    });
  }

  const approveRequest = (request) => {
    //set the selected request 
    request.status = "approved";
    
    //console.log(request);
    setSelectedRequest(request);
    //change status to pending  
    //console.log("change: ", selectedRequest); 
     //apply to form data
    const formData = new FormData();
      //formData.append('user_id', selectedRequest.user_id);
    formData.append('id', request.id);
    formData.append('leave_letter', request.leave_letter);
    formData.append('leave_start', request.leave_start);
    formData.append('leave_end', request.leave_end);
    formData.append('status', request.status);
    //console.log(formData);
    API.uploadFile('leave_application/updateOne', formData, response => {
      if (!response.data.error) {
        // console.log('Data updated successfully', response.data);
        fetchRequests();
      } else {
        console.log(response.data.error);
        setError(response.data.error);
        errorShow();
      }
    }, error => {
      console.log(error)
    })
  }

  const formValidation = () => {

    let formIsValid = true;
    Object.entries(newLeaveRequest).forEach(([key, value]) => {
      if (!value) {
        // inputErrorMessage.message += `${key}, `; 
        // inputErrorMessage.exists = true;
        setValidation(prevState => ({
          ...prevState,
          [key]: false
        }));
        formIsValid = false;
      }
    });
    console.log(validation);
    return (formIsValid) ? true : false;
    
  }
  //create
  const createRequest = async (e) => {
    e.preventDefault();
    let validated = formValidation();
    if (validated) {
      const formData = new FormData();
      formData.append('user_id', newLeaveRequest.id);
      formData.append('leave_letter', letterFile.current.files[0]);
      formData.append('leave_start', newLeaveRequest.leave_start);
      formData.append('leave_end', newLeaveRequest.leave_end);
      formData.append('status', newLeaveRequest.status);
      formData.append('comment_id', newLeaveRequest.comment);
      //console.log(formData);
      API.uploadFile('leave_application/create', formData, response => {
        if (!response.data.error) {
          // console.log('response: ', response);
          const newTask = {...response.data, tempId: uuidv4() };
          setLeaveRequests(prevTasks => [...prevTasks, newTask]);
          fetchRequests();
          setShow(false);
        } else {
          console.log(response.data.error);
          setError(response.data.error);
          handleShow();
        }
      }, error => {
        console.log(error)
      });
    } else {
      console.log('not valid');
      setShow(true); // Ensure the modal stays open
    }
  };

    //edit 
    const editRequest = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('user_id', selectedRequest.user_id);
      formData.append('id', selectedRequest.id);
      formData.append('leave_letter', letterFile.current.files[0]);
      formData.append('leave_start', selectedRequest.leave_start);
      formData.append('leave_end', selectedRequest.leave_end);
      formData.append('status', selectedRequest.status);
      //console.log(selectedRequest.id);
      API.uploadFile('leave_application/updateOne', formData, response => {
        if (!response.data.error) {
          // console.log('Data updated successfully', response.data);
          fetchRequests();
        } else {
          setError(response.data.error);
          errorShow();
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
      //console.log(selectedRequest.id);
      API.request('leave_application/updateOne', {
        id: selectedRequest.id,
        leave_letter: selectedRequest.leave_letter,
        leave_start: selectedRequest.leave_start,
        leave_end: selectedRequest.leave_end,
        status: "denied",
        comment_id: "",
      }, response => {
        // console.log('Data deleted successfully');
        fetchRequests();
      }, error => {
        console.log(error)
      })
      //console.log(selectedPortfolio);
      //to see the changes in the table after and close the modal
      //setLeaveRequests(leaverequests.filter(leaverequests => leaverequests.id !== selectedRequest.id));
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
    
    {/* error modal */}
    <Modal show={errorModal} onHide={errorClose}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={errorClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    
    {/* add record modal */}
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Leave Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={createRequest}>
          <p style={{marginLeft:'1rem', marginBottom:'1rem', fontStyle:'italic'}}>please fill all the fields below</p>
          <Form.Group controlId="formStudyName">
              <Form.Label>Scholar ID:</Form.Label>
              <Form.Control type="text" placeholder="Enter ID" onChange={(event) => { handleInputChange('id', event)}}/>
              {/* <input type="text" placeholder=" User ID" style={{marginLeft:'1rem'}} onChange={(event) => handleInputChange('id', event)}></input> */}
              {<p style={{color:'red', fontStyle:'italic'}}>{ validation.id === false ? 'enter id' : ''}</p>}
          </Form.Group>
          <Form.Group controlId="formStudyName">
              <Form.Label>Leave Start:</Form.Label>
              {/* <Form.Control type="text" placeholder=" Ex: 2024-03-19" onChange={(event) => handleInputChange('leave_start', event)} /> */}
              <input type="date" placeholder=" Ex: 2024-03-19" style={{marginLeft:'1rem'}} onChange={(event) => { handleInputChange('leave_start', event)}}></input>
              {<p style={{color:'red', fontStyle:'italic'}}>{ validation.leave_start === false ? 'enter date' : ''}</p>}
          </Form.Group>
          <Form.Group controlId="formStudy">
              <Form.Label>Leave End:</Form.Label>
              {/* <Form.Control type="text" placeholder="Ex: 2024-03-19" onChange={(event) => handleInputChange('leave_end', event)}  /> */}
              <input type="date" placeholder=" Ex: 2024-03-19" style={{marginLeft:'1rem'}} onChange={(event) => handleInputChange('leave_end', event)}></input>
              {<p style={{color:'red', fontStyle:'italic'}}>{ validation.leave_end === false ? 'enter date' : ''}</p>}
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Leave Letter:</Form.Label>
              <Form.Control type="file" placeholder="Enter Study Category" ref={letterFile} onChange={(event) => handleInputChange('leave_letter', event)} />
              {<p style={{color:'red', fontStyle:'italic'}}>{ validation.leave_letter === false ? 'enter file' : ''}</p>}
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Status:</Form.Label>
              <Form.Control type="text" placeholder="Enter Study Category" onChange={(event) => handleInputChange('status', event)} value={'pending'} readOnly/>
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Comment:</Form.Label>
              <Form.Control type="text" placeholder="Enter Comment" onChange={(event) => handleInputChange('comment', event)}/>
              {<p style={{color:'red', fontStyle:'italic'}}>{ validation.comment === false ? 'enter comment' : ''}</p>}
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
              <Form.Label>Leave Letter</Form.Label><br/>
              <a style={{fontStyle:'italic'}} href={selectedRequest?.leave_letter} target="_blank" rel="noreferrer noopener">current file</a> 
              <Form.Control type="file" placeholder="Upload Leave Upload" onChange={(event) => handleFileChange('leave_letter', event)} ref={letterFile}/>
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Status</Form.Label>
              <Form.Control type="text" placeholder={selectedRequest?.status} 
                            onChange={(event) => {
                              // Extract the new value from the event
                              const newValue = event.target.value;
                              // Update the setSelectedRequest state with the new status
                              setSelectedRequest(prevTask => ({...prevTask, status: newValue }));
                            }} 
                          />
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Comment</Form.Label>
              <Form.Control type="text" placeholder={selectedRequest?.comment_id}
                            onChange={(event) => {
                              // Extract the new value from the event
                              const newValue = event.target.value;
                              // Update the setSelectedRequest state with the new status
                              setSelectedRequest(prevTask => ({...prevTask, comment_id: newValue }));
                            }} 
                            />
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
                  <td> <a href={request.leave_letter} target="_blank" rel="noreferrer noopener">View File</a></td>
                  <td>{request.status}</td>
                  <td>{request.comment_id}</td>
                  <td>
                    <span className='link' 
                          onClick={() => approveRequest(request)} 
                          >Approve</span>
                    <span className='link' 
                          onClick={() => handleEditRequestShow(request)} 
                          >Edit</span>
                    <span className='link' 
                          onClick={() => handleDeleteRequestShow(request)}
                          >Deny</span>
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