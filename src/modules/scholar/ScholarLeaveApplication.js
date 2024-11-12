import { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom';
import { Table, Row, Col, Button, Modal, Form } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify'; // Toast notification
import API from 'services/Api';
import { v4 as uuidv4 } from 'uuid';
import Stack from '../generic/spinnerV2';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useDispatch, useSelector } from 'react-redux';
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
  // Redux dispatchers
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const setIsLoadingV2 = (status) => {
    dispatch({ type: 'SET_IS_LOADING_V2', payload: { status } });
  };
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
    setIsLoadingV2(true);
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
        setIsLoadingV2(false); 
      }, error => {
        toast.error("Something went wrong. Please try again");
        setIsLoadingV2(false);
        console.log(error)
      });
    }
    else
    {
      // console.log('not valid');
      toast.error("All fields must be filled");
      setShow(true); // Ensure the modal stays open
      setIsLoadingV2(false);
      setIsLoading(false);
    }
  };

    //edit 
    const editRequest = async (e) => {
      e.preventDefault();
      setIsLoading(true); 
      setIsLoadingV2(true);

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
        setIsLoadingV2(false);

      }, error => {
        console.log(error)
        toast.error("Error occurred while updating leave request");
        setIsLoading(false);
        setIsLoadingV2(false);

      })
      setEditRequestShow(false);
    };

    //delete
    const deleteRequest = async (e) => {
      e.preventDefault();
      setIsLoading(true); 
      setIsLoadingV2(true);

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
        setIsLoadingV2(false);

      }, error => {
        console.log(error)
        toast.error("Error occurred while deleting leave request");
        setIsLoading(false);
        setIsLoadingV2(false);

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
        <div style={{ background: "#404041", color: "#f5f5f5", borderRadius: "8px 8px 0px 0px"}} data-bs-theme="dark" className='bg-dark p-2'>
        <Modal.Header closeButton>
          <Modal.Title>Add New Leave Application</Modal.Title>
        </Modal.Header>
        </div>
        <Modal.Body>
        <Form>
            <Form.Group controlId="formStudyName">
          <Row>
              <Col xs={3}>
              <Form.Label>Leave Start</Form.Label>
              {/* <Form.Control type="text" placeholder=" Ex: 2024-03-19" onChange={(event) => handleInputChange('leave_start', event)} /> */}
              </Col>
              <Col>
                <input type="date" placeholder=" Ex: 2024-03-19" style={{ marginLeft: '1rem' }} onChange={(event) => handleInputChange('leave_start', event)}></input>
              </Col>
              <Col>
                {<p style={{ color: 'red', fontStyle: 'italic' }}>{validation.leave_start === false ? 'Missing field' : ''}</p>}
              </Col>
          </Row>
          </Form.Group><br/>
          <Form.Group controlId="formStudy">
          <Row>
              <Col xs={3}>
                <Form.Label>Leave End</Form.Label>
              </Col>
              <Col>
              {/* <Form.Control type="text" placeholder="Ex: 2024-03-19" onChange={(event) => handleInputChange('leave_end', event)}  /> */}
              <input type="date" placeholder=" Ex: 2024-03-19" style={{marginLeft:'1rem'}} onChange={(event) => handleInputChange('leave_end', event)}></input>
              </Col>
              <Col>
              {<p style={{ color: 'red', fontStyle: 'italic' }}>{validation.leave_end === false ? 'Missing field' : ''}</p>}
          </Col>
          </Row>
          </Form.Group><br/>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Leave Letter</Form.Label>
              <Form.Control type="file" placeholder="Enter Study Category" onChange={(event) => handleInputChange('leave_letter', event)} ref={letterFile}/>
              {<p style={{color:'red', fontStyle:'italic'}}>{ validation.leave_letter === false ? 'Missing file' : ''}</p>}
          </Form.Group><br/>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Status</Form.Label>
              <Form.Control type="text" placeholder="Enter Study Category" onChange={(event) => handleInputChange('status', event)} value={'pending'} readOnly disabled/>
              {<p style={{color:'red', fontStyle:'italic'}}>{ validation.status === false ? 'Missing field' : ''}</p>}
          </Form.Group>
          {/* <Form.Group controlId="formStudyCategory">
              <Form.Label>Comment</Form.Label>
              <Form.Control type="text" placeholder="" onChange={(event) => handleInputChange('status', event)} value={''} readOnly disabled/>
            {newLeaveRequest.comment_id === '' && <p style={{color:'red', fontStyle:'italic'}}>enter comment</p>}
          </Form.Group> */}
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="dark" onClick={createRequest}>
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
                  <td style={{ textAlign: "center" }}>
                  {/* <span className='link'>
                    <a href={request.leave_letter} target="_blank" rel="noreferrer noopener">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M27.8453 16.9608L24.8549 13.9479C24.5403 13.6312 23.9999 13.8537 23.9999 14.3V16.3366H19.9999V10.8325C19.9999 10.3033 19.7845 9.79082 19.4095 9.41624L15.9141 5.92084C15.5391 5.54584 15.0308 5.33334 14.502 5.33334H5.99957C4.89583 5.33751 4 6.23334 4 7.33708V24.667C4 25.7708 4.89583 26.6666 5.99957 26.6666H17.997C19.1012 26.6666 19.9999 25.7708 19.9999 24.667V20.3362H17.9999V24.667H5.99957V7.33708H12.665V11.6696C12.665 12.2237 13.1108 12.6691 13.665 12.6691H17.9999V16.3362H11.1666C10.8904 16.3362 10.6666 16.56 10.6666 16.8362V17.8362C10.6666 18.1125 10.8904 18.3362 11.1666 18.3362H23.9999V20.3729C23.9999 20.8191 24.5403 21.0416 24.8549 20.7249L27.8453 17.712C28.0516 17.5041 28.0516 17.1687 27.8453 16.9608ZM14.6645 10.6696V7.49958L17.8349 10.6696H14.6645Z" fill="#404041"/>
                    </svg>
                    </a>
                  </span> */}
                  <span className='link'>
                    <a href={request.leave_letter} target="_blank" rel="noreferrer noopener">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M27.8453 16.9608L24.8549 13.9479C24.5403 13.6312 23.9999 13.8537 23.9999 14.3V16.3366H19.9999V10.8325C19.9999 10.3033 19.7845 9.79082 19.4095 9.41624L15.9141 5.92084C15.5391 5.54584 15.0308 5.33334 14.502 5.33334H5.99957C4.89583 5.33751 4 6.23334 4 7.33708V24.667C4 25.7708 4.89583 26.6666 5.99957 26.6666H17.997C19.1012 26.6666 19.9999 25.7708 19.9999 24.667V20.3362H17.9999V24.667H5.99957V7.33708H12.665V11.6696C12.665 12.2237 13.1108 12.6691 13.665 12.6691H17.9999V16.3362H11.1666C10.8904 16.3362 10.6666 16.56 10.6666 16.8362V17.8362C10.6666 18.1125 10.8904 18.3362 11.1666 18.3362H23.9999V20.3729C23.9999 20.8191 24.5403 21.0416 24.8549 20.7249L27.8453 17.712C28.0516 17.5041 28.0516 17.1687 27.8453 16.9608ZM14.6645 10.6696V7.49958L17.8349 10.6696H14.6645Z" fill="#404041"/>
                    </svg>
                    </a>
                    <label className='link-label' style={{ width: "4rem" }}>View file</label>
                  </span>
                  </td>
                  <td>{request.status}</td>
                  <td>{request.comment_id}</td>
                  <td style={{ textAlign: "center" }}>
                    {/* <span className='link' 
                          onClick={() => handleEditRequestShow(request)} 
                  >Edit</span>
                   */}
                  <span className='link' onClick={() => handleEditRequestShow(request)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.8898 19.0493L15.8588 15.0182C15.7869 14.9463 15.6932 14.9088 15.5932 14.9088H15.2713C16.3431 13.7495 16.9994 12.2027 16.9994 10.4997C16.9994 6.90923 14.0901 4 10.4997 4C6.90923 4 4 6.90923 4 10.4997C4 14.0901 6.90923 16.9994 10.4997 16.9994C12.2027 16.9994 13.7495 16.3431 14.9088 15.2744V15.5932C14.9088 15.6932 14.9495 15.7869 15.0182 15.8588L19.0493 19.8898C19.1961 20.0367 19.4336 20.0367 19.5805 19.8898L19.8898 19.5805C20.0367 19.4336 20.0367 19.1961 19.8898 19.0493ZM10.4997 15.9994C7.45921 15.9994 4.99995 13.5402 4.99995 10.4997C4.99995 7.45921 7.45921 4.99995 10.4997 4.99995C13.5402 4.99995 15.9994 7.45921 15.9994 10.4997C15.9994 13.5402 13.5402 15.9994 10.4997 15.9994Z" fill="#404041"/>
                    </svg>
                    <label className='link-label'>View</label>
                  </span>
                    {/* <span className='link' 
                          onClick={() => handleDeleteRequestShow(request)}
                          >Delete</span> */}
                  <span className='link' onClick={() => (handleDeleteRequestShow(request))}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.4874 11.9998L16.8537 8.63358C17.0484 8.4389 17.0484 8.12296 16.8537 7.92796L16.0715 7.14577C15.8768 6.95108 15.5608 6.95108 15.3658 7.14577L11.9998 10.5123L8.63354 7.14604C8.43884 6.95134 8.12291 6.95134 7.92721 7.14604L7.14503 7.92823C6.95033 8.12293 6.95033 8.43887 7.14503 8.63357L10.5113 11.9998L7.14503 15.366L7.92721 16.1482C8.12291 16.3429 8.43884 16.3429 8.63354 16.1482L11.9998 12.781L15.3658 16.1479C15.5605 16.3426 15.8764 16.3426 16.0711 16.1479L16.8537 15.366L13.4874 11.9998Z" fill="#404041"/>
                    </svg>
                    <label className='link-label'>Delete</label>
                  </span>
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