import { useEffect, useState , useRef} from "react";
import { useLocation } from 'react-router-dom';
import { Table, Button, Modal, Form } from "react-bootstrap";
import API from 'services/Api'
import { v4 as uuidv4 } from 'uuid';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TABLE_HEADERS = ["#", "Scholar ID", "Leave Start", "Leave End", "Leave Letter", "Status", "Comments", ""];

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
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    API.request('leave_application/retrieveAll', {}, response => {
      if (response && response.data) {
        setLeaveRequests(response.data)
        //console.log(response.data);
      } else {
        console.log('error on retrieve');
      }
      setLoading(false);
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
    <div class="contentHeader">
      <div class="contentLabel">
        <h4>Scholar Leave Request</h4>
        <p>This is the Scholar Leave Request page</p>
      </div>
      <div class="contentButton">
        <button onClick={handleShow}>+ Add New</button>
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
    <div className="table-container" style={{ marginTop:'1rem'}}>
        <Table>
          <thead>
            <tr>
              {TABLE_HEADERS.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {
            loading && (
              // Display Skeletons while loading
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton /></td>
                  <td><Skeleton width={80} height={25} /></td>
                </tr>
              ))
              )
              }
              {!loading && leaverequests.length === 0 && (
              <tr>
                <td colSpan={TABLE_HEADERS.length} style={{textAlign: 'center'}}>
                  Oops, looks like there are no leave requests to show.
                </td>
              </tr>
              )}
              {
                !loading && leaverequests.map((request, index) => (
                <tr key={request.id || request.tempId}>
                  <td>{index + 1}</td>
                  <td>{request.user_id}</td>
                  <td>{request.leave_start}</td>
                  <td>{request.leave_end}</td>
                  <td> <a href={request.leave_letter} target="_blank" rel="noreferrer noopener">View File</a></td>
                  <td>{request.status}</td>
                  <td>{request.comment_id}</td>
                  <td style={{ textAlign: "center" }}>
                    <span className='link' 
                          onClick={() => approveRequest(request)} 
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5068 6.85481L9.45265 14.6991L6.49327 11.8168C6.34979 11.6771 6.11715 11.6771 5.97363 11.8168L5.10761 12.6603C4.96413 12.8 4.96413 13.0266 5.10761 13.1664L9.19281 17.1452C9.33629 17.2849 9.56894 17.2849 9.71245 17.1452L18.8924 8.20437C19.0359 8.06463 19.0359 7.83805 18.8924 7.69827L18.0264 6.85481C17.8829 6.71506 17.6502 6.71506 17.5068 6.85481Z" fill="#10b798"/>
                    </svg>
                    <label class="link-label">Approve</label>
                    </span>
                    <span className='link' 
                          onClick={() => handleEditRequestShow(request)} 
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.5721 14.7789L16.5722 13.779C16.7284 13.6228 17.0003 13.7322 17.0003 13.9571V18.5002C17.0003 19.3282 16.3284 20 15.5003 20H4.50003C3.67189 20 3 19.3282 3 18.5002V7.50183C3 6.67383 3.67189 6.00205 4.50003 6.00205H13.0471C13.269 6.00205 13.3815 6.27076 13.2252 6.43011L12.2252 7.42997C12.1783 7.47683 12.1158 7.50183 12.0471 7.50183H4.50003V18.5002H15.5003V14.9539C15.5003 14.8882 15.5253 14.8258 15.5721 14.7789ZM20.466 8.47356L12.2596 16.6786L9.43451 16.9911C8.61575 17.0817 7.91886 16.3912 8.00948 15.5663L8.32199 12.7417L16.5284 4.53664C17.2441 3.82112 18.4003 3.82112 19.1128 4.53664L20.4629 5.88644C21.1785 6.60196 21.1785 7.76117 20.466 8.47356ZM17.3784 9.43905L15.5628 7.62369L9.7564 13.4322L9.52827 15.4725L11.5689 15.2444L17.3784 9.43905ZM19.4035 6.94879L18.0535 5.59898C17.9253 5.47088 17.7159 5.47088 17.5909 5.59898L16.6253 6.56447L18.441 8.37983L19.4066 7.41434C19.5316 7.28311 19.5316 7.07689 19.4035 6.94879Z" fill="#404041"/>
                      </svg>
                    <label class="link-label">Edit</label>
                    </span>
                    <span className='link' 
                          onClick={() => handleDeleteRequestShow(request)}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.4874 11.9998L16.8537 8.63358C17.0484 8.4389 17.0484 8.12296 16.8537 7.92796L16.0715 7.14577C15.8768 6.95108 15.5608 6.95108 15.3658 7.14577L11.9998 10.5123L8.63354 7.14608C8.43885 6.9514 8.12291 6.9514 7.92791 7.14608L7.14602 7.92796C6.95133 8.12265 6.95133 8.43858 7.14602 8.63358L10.5123 11.9998L7.14602 15.3661C6.95133 15.5608 6.95133 15.8767 7.14602 16.0717L7.92822 16.8539C8.12291 17.0486 8.43885 17.0486 8.63385 16.8539L11.9998 13.4873L15.3661 16.8536C15.5608 17.0483 15.8768 17.0483 16.0718 16.8536L16.854 16.0714C17.0487 15.8767 17.0487 15.5608 16.854 15.3658L13.4874 11.9998Z" fill="red"/>
                      </svg>
                    <label class="link-label">Delete</label>
                    </span>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </div>
    </>
  );
}

  
  export default ScholarLeaveApplication;