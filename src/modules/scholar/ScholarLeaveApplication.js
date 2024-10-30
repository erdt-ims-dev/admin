import { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom';
import { Table, Button, Modal, Form } from "react-bootstrap";
import { toast } from 'react-toastify'; // Toast notification
import API from 'services/Api';
import { v4 as uuidv4 } from 'uuid';
import Stack from '../generic/spinnerV2';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
const TABLE_HEADERS = ["#", "Leave Start", "Leave End", "Leave Letter", "Status", "Comment", "Action"];

function ScholarLeaveApplication() {
  const location = useLocation();
  const scholar = location.state.scholar;

  const [leaverequests, setLeaveRequests] = useState([]);
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    id: scholar.id,
    leave_start: '',
    leave_end: '',
    leave_letter: '',
    status: 'pending',
    comment_id: 'no comment',
  });
  const letterFile = useRef(null);

  //error modal
  const [validation, setValidation] = useState({ 
    id: true,
    leave_start: true,
    leave_end: true,
    leave_letter: true,
    status: true,
    comment: true,
    comment_id: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState([]);
  const [errorModal, setErrorModal] = useState(false); 
  const [show, setShow] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editRequestShow, setEditRequestShow] = useState(false);

  const errorClose = () => setErrorModal(false);
  const errorShow = () => setErrorModal(true);

  const handleClose = () => {
    setError([]);
    setValidation({
      id: true,
      leave_start: true,
      leave_end: true,
      leave_letter: true,
      status: true,
      comment: true,
      comment_id: true,
    });
    setShow(false);
  };
  const handleShow = () => setShow(true);

  
  //edit modal
  
  
  const handleEditRequestShow = (request) => {
    setSelectedRequest(request);
    setEditRequestShow(true);
  }
  const handleEditRequestClose = () => setEditRequestShow(false);
  const handleDeleteRequestClose = () => setDeleteRequestShow(false);

  
  //delete confimation modal
  const [deleteRequestShow, setDeleteRequestShow] = useState(false);
  const handleDeleteRequestShow = (request) => {
  setSelectedRequest(request);
  setDeleteRequestShow(true);
  }

  //input binding; not sure if works for files
  const handleInputChange = (fieldName, event) => {
    setNewLeaveRequest(prevState => ({
        ...prevState,
        [fieldName]: event.target.value
    }));
    // Validate the new state immediately after setting it
    validateField(fieldName, event.target.value);
  };
  const handleFileChange = (fieldName, event) => {
    const file = event.target.files[0];
      setNewLeaveRequest((prevState) => ({
      ...prevState,
        [fieldName]: file,
      }));
      
      if (selectedRequest) {
        setSelectedRequest({...selectedRequest, [fieldName]: file });
      }
  };
// Helper function to validate a single field
const validateField = (fieldName, value) => {
  if (!value) {
    setValidation(prevState => ({
     ...prevState,
      [fieldName]: false
    }));
  } else {
    setValidation(prevState => ({
     ...prevState,
      [fieldName]: true
    }));
  }
};
  const fetchRequests = async () => {
    setIsLoading(true);

    API.request('leave_application/retrieveMultipleByParameter', { col: 'user_id', value: newLeaveRequest.id }, response => {
      if (response && response.data) {
        // Make the second API call to retrieve account details
        setLeaveRequests(response.data)
        // console.log(leaverequests)
      } else {
        toast.error("Failed to retrieve leave requests");
      }
      setIsLoading(false);
    }, error => {
      console.log(error);
      setIsLoading(false);
    });
  }

  const formValidation = () => {
    let formIsValid = true;
      Object.entries(newLeaveRequest).forEach(([key, value]) => {
        if (!value) {
          setValidation(prevState => ({
            ...prevState,
            [key]: false
          }));
          formIsValid = false;
          // console.log("please fill all fields");
        }
      });
      // return (formIsValid) ? true : false;
      return formIsValid;
  }
  
  //create
  const createRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
    // let validated = formValidation();
    // if (validated) {
      // console.log(newLeaveRequest)
    if (formValidation()) {
      const formData = new FormData();
      formData.append('user_id', newLeaveRequest.id);
      formData.append('leave_letter', letterFile.current.files[0]);
      formData.append('leave_start', newLeaveRequest.leave_start);
      formData.append('leave_end', newLeaveRequest.leave_end);
      formData.append('status', newLeaveRequest.status);
      formData.append('comment_id', newLeaveRequest.comment_id);
      // console.log(formData);
      API.uploadFile('leave_application/create', formData, response => {
        if (!response.data.error) {
          // console.log('Data created successfully', response.data);
          toast.success("Leave request created successfully");
          const newTask = {...response.data, tempId: uuidv4() };
          setLeaveRequests(prevTasks => [...prevTasks, newTask]);
          fetchRequests();
          setShow(false);
        } else {
          // console.log(response.data.error);
          toast.error("Failed to create leave request");
          setError(response.data.error);
          errorShow();
        }
        setIsLoading(false); 
      }, error => {
        console.log(error)
      });
    }
    else
    {
      // console.log('not valid');
      toast.error("All fields must be filled");
      setShow(true); // Ensure the modal stays open
      setIsLoading(false);
    }
  };

    //edit 
    const editRequest = async (e) => {
      e.preventDefault();
      setIsLoading(true); 
      const formData = new FormData();
      // console.log(selectedRequest);
      formData.append('user_id', newLeaveRequest.id);
      formData.append('id', selectedRequest.id);
      // formData.append('leave_letter', selectedRequest.leave_letter ? selectedRequest.leave_letter : letterFile.current.files[0]);
      formData.append('leave_letter', selectedRequest.leave_letter || letterFile.current.files[0]);
      formData.append('leave_start', selectedRequest.leave_start);
      formData.append('leave_end', selectedRequest.leave_end);
      formData.append('status', selectedRequest.status);
      //console.log(selectedRequest.id);
      API.uploadFile('leave_application/updateOne', formData, response => {
        if (response && response.data) {
          toast.success("Leave request updated successfully");
          fetchRequests();
        } else {
          toast.error("Failed to update leave request");
        }
        setIsLoading(false);

      }, error => {
        console.log(error)
        toast.error("Error occurred while updating leave request");
        setIsLoading(false);

      })
      setEditRequestShow(false);
    };

    //delete
    const deleteRequest = async (e) => {
      e.preventDefault();
      setIsLoading(true); 
      // console.log(selectedRequest.id);
      API.request('leave_application/delete', {
        id: selectedRequest.id,
      }, response => {
        if (!response.data.error) {
          toast.success("Leave request deleted successfully");
          setLeaveRequests(prevRequests => prevRequests.filter(request => request.id !== selectedRequest.id));
        } else {
          toast.error("Failed to delete leave request");
        }
        setIsLoading(false);
      }, error => {
        console.log(error)
        toast.error("Error occurred while deleting leave request");
        setIsLoading(false);
      })
      //console.log(selectedPortfolio);
      //to see the changes in the table after and close the modal
      setDeleteRequestShow(false);
    };
  useEffect(() => {
    fetchRequests();
  }, []);


  return (
    <>
    
    {/* <div style={{ float:'left', textAlign:'left'}}>
      <h3>welcome {scholar.account_details.last_name} {scholar.account_details.first_name}</h3>
      <p>This is the Scholar Leave Request page</p>
    </div>
    <Button 
            onClick={handleShow} 
            style={{float:'right', marginTop:'1rem'}}> Add New Request </Button> */}
    <div class="contentHeader">
      <div class="contentLabel">
        <h4>Scholar Leave Request</h4>
        <p>This is the Scholar Leave Request page</p>
      </div>
      <div class="contentButton">
        <button onClick={handleShow}>+ Add New Leave Request</button>
      </div>
    </div>
    
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
              {<p style={{color:'red', fontStyle:'italic'}}>{ validation.leave_start === false ? 'Missing field' : ''}</p>}
          </Form.Group>
          <Form.Group controlId="formStudy">
              <Form.Label>Leave End</Form.Label>
              {/* <Form.Control type="text" placeholder="Ex: 2024-03-19" onChange={(event) => handleInputChange('leave_end', event)}  /> */}
              <input type="date" placeholder=" Ex: 2024-03-19" style={{marginLeft:'1rem'}} onChange={(event) => handleInputChange('leave_end', event)}></input>
              {<p style={{color:'red', fontStyle:'italic'}}>{ validation.leave_end === false ? 'Missing field' : ''}</p>}
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Leave Letter</Form.Label>
              <Form.Control type="file" placeholder="Enter Study Category" onChange={(event) => handleInputChange('leave_letter', event)} ref={letterFile}/>
              {<p style={{color:'red', fontStyle:'italic'}}>{ validation.leave_letter === false ? 'Missing file' : ''}</p>}
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Status</Form.Label>
              <Form.Control type="text" placeholder="Enter Study Category" onChange={(event) => handleInputChange('status', event)} value={'pending'} readOnly disabled/>
              {<p style={{color:'red', fontStyle:'italic'}}>{ validation.status === false ? 'Missing field' : ''}</p>}
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Comment</Form.Label>
              <Form.Control type="text" placeholder="" onChange={(event) => handleInputChange('status', event)} value={''} readOnly disabled/>
              {/* {newLeaveRequest.comment_id === '' && <p style={{color:'red', fontStyle:'italic'}}>enter comment</p>} */}
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
              <Form.Control type="file" placeholder="Upload Leave Upload" onChange={(event) => handleFileChange('leave_letter', event)} ref={letterFile} />
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
                            readOnly disabled
                          />
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Comment</Form.Label>
              <Form.Control type="text" placeholder="" onChange={(event) => handleInputChange('comment', event)} value={selectedRequest?.comment} readOnly disabled />
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
    <div className="table-container" style={{ marginTop:'4.5rem'}}>
        <Table>
          <thead>
            <tr>
              {TABLE_HEADERS.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={TABLE_HEADERS.length}>
                  <Skeleton count={5} height={30} />
                </td>
              </tr>
            )}
            {!isLoading && leaverequests.length === 0 && (
              <tr>
                <td colSpan={TABLE_HEADERS.length} style={{textAlign: 'center'}}>
                  Oops, looks like there are no leave requests to show.
                </td>
              </tr>
            )}
            {!isLoading && leaverequests.map((request, index) => (
                <tr key={request.id || request.tempId}>
                  <td>{index + 1}</td>
                  <td>{request.leave_start}</td>
                  <td>{request.leave_end}</td>
                  <td> <a href={request.leave_letter} target="_blank" rel="noreferrer noopener">View File</a></td>
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