import { useEffect, useState , useRef} from "react";
import { useLocation } from 'react-router-dom';
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import API from 'services/Api'
import { v4 as uuidv4 } from 'uuid';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify'; // Toast notification
import { useDropzone } from 'react-dropzone';

const TABLE_HEADERS = ["#", "Email", "Name", "Semseter", "Year", "Leave Letter", "Status", "Comments", "Actions"];

function ScholarLeaveApplication() {
  const location = useLocation();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [leaverequests, setLeaveRequests] = useState([]);
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    id: '',
    year: '',
    semester: '',
    file: '',
    email: '',
    status: 'pending',
    comment: '',
  });
  const letterFile = useRef(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setError([]);
    setValidation({
      id: true,
      year: true,
      semester: true,
      email: true,
      file: true,
    });
    resetFiles()
    setShow(false);
  };
  const handleShow = () => setShow(true);

  //error modal
  const [validation, setValidation] = useState({ 
    id: true,
    year: true,
    semester: true,
    file: true,
    email: true,
    status: true,
    comment: true,
  });
  const [error, setError] = useState([]);
  const [errorModal, setErrorModal] = useState(false);
  const errorClose = () => setErrorModal(false);
  const errorShow = () => setErrorModal(true);

  //edit modal
  const [selectedRequest, setSelectedRequest] = useState({
    year: '',
    semester: '',
    status: '',
    email: '',
    comment: '',
    id: ''
  }); 
  const [editRequestShow, setEditRequestShow] = useState(false);
  
  const handleEditRequestShow = (request) => {
    //console.log(request);
    setSelectedRequest(request);
    setEditRequestShow(true);
  }
  const handleEditRequestClose = () => {
    setEditRequestShow(false) 
    resetFiles()
  };

  
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
    // Validate the new state immediately after setting it
    validateField(fieldName, event.target.value);
  };
  const handleFileChange = (event) => {
    // Handle file selection, whether through dropzone or file input
    const files = event.target.files ? Array.from(event.target.files) : [];
    
    // Filter valid files and check file types and sizes
    const validFiles = [];
    const invalidFiles = [];
    
    files.forEach(file => {
        if (!file.name.endsWith('.zip') && !file.name.endsWith('.rar')) {
            invalidFiles.push(`${file.name} is not a ZIP or RAR file.`);
        } else if (file.size > 10485760) { // 10MB in bytes
            invalidFiles.push(`${file.name} exceeds the 10MB size limit.`);
        } else {
            validFiles.push(file);
        }
    });
    
    // Display errors for invalid files
    if (invalidFiles.length > 0) {
        invalidFiles.forEach(error => toast.error(error));
        return;
    }
    
    // Limit to 5 files
    if (validFiles.length + selectedRequest.length > 5) {
        toast.error('You can only upload up to 5 zip/rar files.');
        return;
    }
    
    // Update selected files state
    setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);
};
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
    setLoading(true);
    API.request('leave_application/retrieveLeaves', {}, response => {
      if (response && response.data) {
        setLeaveRequests(response.data)
        //console.log(response.data);
      } else {
        console.log('error on retrieve');
      }
      setLoading(false);
    }, error => {
      console.log(error);
      setLoading(false);

      });
  }

//   const fetchRequests = () => {
//   setLoading(true);
  
//   API.request('leave_application/retrieveAll', {}, response => {
//     if (response && response.data) {
//       const leaveRequestsWithDetails = [];
//       let requestsCompleted = 0; // Counter to track completed requests
//       setLeaveRequests(response.data);
//       response.data.forEach((request) => {
//         // Fetch user details
//         API.request(`user/retrieveOne`, {col: 'id', value: request.id}, userResponse => {
//           // Fetch account details
//           API.request(`account_details/retrieveOne`, {col: 'id', value: request.id}, accountResponse => {
//             // Combine the data
//             leaveRequestsWithDetails.push({
//               ...request,
//               user: userResponse.data,
//               accountDetails: accountResponse.data,
//             });

//             // Check if all requests are completed
//             requestsCompleted++;
//             if (requestsCompleted === response.data.length) {
//               setLeaveRequests(leaveRequestsWithDetails);
//               setLoading(false);
//             }
//           }, error => {
//             console.log('Error fetching account details:', error);
//             requestsCompleted++;
//             // Check if all requests are completed even if there's an error
//             if (requestsCompleted === response.data.length) {
//               setLeaveRequests(leaveRequestsWithDetails);
//               setLoading(false);
//             }
//           });
//         }, error => {
//           console.log('Error fetching user details:', error);
//           requestsCompleted++;
//           // Check if all requests are completed even if there's an error
//           if (requestsCompleted === response.data.length) {
//             setLeaveRequests(leaveRequestsWithDetails);
//             setLoading(false);
//           }
//         });
//       });
      
//       // If there are no leave requests, update state immediately
//       if (response.data.length === 0) {
//         setLeaveRequests(leaveRequestsWithDetails);
//         setLoading(false);
//       }

//       console.log("leave requests: ", leaverequests)
//     } else {
//       console.log('Error on retrieve');
//       setLoading(false);
//     }
//   }, error => {
//     console.log('Error fetching leave requests:', error);
//     setLoading(false);
//   });
// };

  const approveRequest = (request) => {
    //set the selected request 
    setLoading(true);
    console.log("approve", request)
    request.status = "approved";

    //console.log(request);
    setSelectedRequest(request);

    const formData = new FormData();
      //formData.append('user_id', selectedRequest.user_id);
    formData.append('id', request.leave.id);
    //console.log(formData);
    API.uploadFile('leave_application/approveLeave', formData, response => {
      if (!response.data.error) {
        // console.log('Data updated successfully', response.data);
        toast.success("Data updated successfully")
        fetchRequests();
      } else {
        // console.log(response.data.error);
        toast.error("An error has occurred while updating the data")
        setError(response.data.error);
        errorShow();
      }
      setLoading(false);

    }, error => {
      setLoading(false);
      toast.error("Something went wrong. Please try again")
      console.log(error)
    })
  }

  const formValidation = () => {
    let formIsValid = true;
    const updatedValidation = { ...validation };
    // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|usc\.edu\.ph)$/;
    // if (!emailRegex.test(newLeaveRequest.email)) {
    //   updatedValidation.email = false;
    //   formIsValid = false;
    //   toast.error('Invalid email.');
    // }
    if (!newLeaveRequest.email) {
      updatedValidation.email = false;
      formIsValid = false;
    }
    if (!newLeaveRequest.year) {
        updatedValidation.year = false;
        formIsValid = false;
    }
    if (!newLeaveRequest.semester) {
        updatedValidation.semester = false;
        formIsValid = false;
    }
    if (selectedFiles.length === 0) {
        updatedValidation.file = false;
        formIsValid = false;
    } else if (selectedFiles.length > 5) {
        updatedValidation.file = false;
        formIsValid = false;
        toast.error('You can upload a maximum of 5 files.');
    } else {
        updatedValidation.file = true;
    }
  
    setValidation(updatedValidation);
    return formIsValid;
  };
  //create
  const createRequest = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formValidation()) {
      const formData = new FormData();
      formData.append('year', newLeaveRequest.year);
      formData.append('email', newLeaveRequest.email);
      formData.append('semester', newLeaveRequest.semester);
      formData.append('status', newLeaveRequest.status);
      formData.append('comment_id', newLeaveRequest.comment_id);
      selectedFiles.forEach((file, index) => {
        formData.append('file[]', file); 
    });  
      API.uploadFile('leave_application/uploadWithEmail', formData, response => {
        if(response.error){
          toast.error("Entered email is not valid.")
          return
        }
        if (!response.error && response.data) {
          // console.log('response: ', response);
          
          const newLeaveRequest = {...response.data, tempId: uuidv4() };
          setLeaveRequests(prevTasks => [...prevTasks, newLeaveRequest]);
          fetchRequests();
          resetFiles()
          setShow(false);
          toast.success("Request created successfully")
        } else {
          // console.log(response.data.error);
          toast.error("Something went wrong. Please try again")

          setError(response.data.error);
          handleShow();
        }
        setLoading(false);

      }, error => {
        // console.log(error)
        toast.error("Something went wrong, please try again")

        setLoading(false);

      });
    } else {
      console.log('not valid');
      toast.info("All fields must be filled")

      setShow(true); // Ensure the modal stays open
    }
  };

    //edit 
    const editRequest = async (e) => {
      e.preventDefault();
      setLoading(true);

      const formData = new FormData();
      formData.append('year', newLeaveRequest.year);
      formData.append('id', selectedRequest.leave.id);
      formData.append('semester', newLeaveRequest.semester);
      formData.append('status', newLeaveRequest.status);
      formData.append('comment', newLeaveRequest.comment); // i know the db asks for ID, but for now im using the comment string as is
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file, index) => {
            formData.append('file[]', file); 
        });
    } 
      API.uploadFile('leave_application/editLeave', formData, response => {
        if (!response.data.error) {
          // console.log('Data updated successfully', response.data);
          toast.success("Information updated successfully")
          resetFiles()
          fetchRequests();
        } else {
          toast.error("Something went wrong. Please try again")
          setError(response.data.error);
          errorShow();
        }
        setLoading(false);

      }, error => {
        toast.error("Something went wrong. Check your connection and try again")

        console.log(error)
        setLoading(false);

      })
      //console.log(selectedPortfolio);
      setEditRequestShow(false);
    };

    //delete
    const deleteRequest = async (e) => {
      e.preventDefault();
      setLoading(true);

      //console.log(selectedRequest.id);
      API.request('leave_application/rejectLeave', {
        id: selectedRequest.leave.id,
      }, response => {
        // console.log('Data deleted successfully');
        toast.success("Leave Request Rejected")

        setLoading(false);

        fetchRequests();
      }, error => {
        setLoading(false);
        toast.error("Something went wrong. Please try again")

        // console.log(error)
      })
      //console.log(selectedPortfolio);
      //to see the changes in the table after and close the modal
      //setLeaveRequests(leaverequests.filter(leaverequests => leaverequests.id !== selectedRequest.id));
      setDeleteRequestShow(false);
    };
  useEffect(() => {
    fetchRequests();
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleFileChange, accept: '.zip, .rar' });
  const resetFilesOnly = () => {
    setSelectedFiles([]);
    
  };
  const resetFiles = () => {
    setSelectedRequest([]);
    setSelectedFiles([]);
    setNewLeaveRequest({
      id: '',
      year: '',
      semester: '',
      email: '',
      status: 'Pending',
      comment_id: 'None',
        })
};
  return (
    <>
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
    
    {/* add record modal */}
    <Modal show={show} onHide={handleClose}>
        <div style={{ background: "#404041", color: "#f5f5f5", borderRadius: "8px 8px 0px 0px"}} data-bs-theme="dark" className='bg-dark p-2'>
        <Modal.Header closeButton>
          <Modal.Title>Add New Leave Application</Modal.Title>
        </Modal.Header>
        </div>
        <Modal.Body>
        <Form>
        <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
                type="email"
                placeholder="Enter email"
                value={newLeaveRequest.email}
                onChange={(event) => handleInputChange('email', event)}
            />
            {!validation.email && (
                <p style={{ color: 'red', fontStyle: 'italic' }}>Please enter a valid email</p>
            )}
            </Form.Group>
            <br/>
        <Form.Group controlId="formYearCategory">
            <Form.Label>Year</Form.Label>
            <Form.Select
                aria-label="Select Year"
                value={newLeaveRequest.year}
                onChange={(event) => handleInputChange('year', event)}
            >
                <option value="">Select Year</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
            </Form.Select>
            {!validation.year && (
                <p style={{color:'red', fontStyle:'italic'}}>Year</p>
            )}
        </Form.Group>
        <br/>
        <Form.Group controlId="formSemesterCategory">
                        <Form.Label>Semester</Form.Label>
                        <Form.Select
                            aria-label="Select Semester"
                            value={newLeaveRequest.semester}
                            onChange={(event) => handleInputChange('semester', event)}
                        >
                            <option value="">Select Semester</option>
                            <option value="1st Semester">1st Semester</option>
                            <option value="2nd Semester">2nd Semester</option>
                            <option value="Summer">Summer</option>
                        </Form.Select>
                        {!validation.semester && (
                            <p style={{color:'red', fontStyle:'italic'}}>Semester</p>
                        )}
                    </Form.Group>
        <br/>
                    <Form.Group controlId="formStudy">
                        <Form.Label>
                            Files
                            <Button
                                variant="link"
                                onClick={resetFilesOnly}
                                style={{ paddingLeft: '10px', color: 'blue', textDecoration: 'underline', fontSize: '10px' }}
                            >
                                Clear
                            </Button>
                        </Form.Label>
                        <div {...getRootProps()} className="dropzone">
                            <input {...getInputProps()} onChange={handleFileChange}/>
                            {isDragActive ? (
                                <p>Drop the files here...</p>
                            ) : (
                                <p>Click here to select ZIP/RAR files</p>
                            )}
                        </div>
                        {selectedFiles.length > 0 && (
                            <div>
                                <ul>
                                    {selectedFiles.map((file, index) => (
                                        <li key={index}>{file.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {/* {!validation.study && (
                            <p style={{color:'red', fontStyle:'italic'}}>Please select files</p>
                        )} */}
                    </Form.Group>
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
  <div
    style={{ background: "#404041", color: "#f5f5f5", borderRadius: "8px 8px 0px 0px" }}
    data-bs-theme="dark"
    className="bg-dark p-2"
  >
    <Modal.Header closeButton>
      <Modal.Title>Edit Leave Application</Modal.Title>
    </Modal.Header>
  </div>
  <Modal.Body>
    <Form>
      {/* Email Field */}
      <Form.Group controlId="formEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={selectedRequest?.email || ''}
          disabled
        />
      </Form.Group>

      {/* Year Field */}
      <Form.Group controlId="formYearCategory">
        <Form.Label>Year</Form.Label>
        <Form.Select
          aria-label="Select Year"
          value={newLeaveRequest.year ? newLeaveRequest.year : selectedRequest?.leave?.year}
          onChange={(event) =>
            setNewLeaveRequest((prevTask) => ({
              ...prevTask,
              year: event.target.value,
            }))
          }
        >
          <option value="">Select Year</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </Form.Select>
      </Form.Group>

      {/* Semester Field */}
      <Form.Group controlId="formSemesterCategory">
        <Form.Label>Semester</Form.Label>
        <Form.Select
          aria-label="Select Semester"
          value={newLeaveRequest.semester ? newLeaveRequest.semester : selectedRequest?.leave?.semester}
          onChange={(event) =>
            setNewLeaveRequest((prevTask) => ({
              ...prevTask,
              semester: event.target.value,
            }))
          }
        >
          <option value="">Select Semester</option>
          <option value="1st Semester">1st Semester</option>
          <option value="2nd Semester">2nd Semester</option>
          <option value="Summer">Summer</option>
        </Form.Select>
      </Form.Group>

      {/* File Upload Field */}
      <Form.Group controlId="formStudy">
        <Form.Label>
          Files
          <Button
            variant="link"
            onClick={() => setSelectedFiles([])} // Reset files
            style={{
              paddingLeft: "10px",
              color: "blue",
              textDecoration: "underline",
              fontSize: "10px",
            }}
          >
            Clear
          </Button>
        </Form.Label>
        <div {...getRootProps()} className="dropzone">
          <input
            {...getInputProps()}
            onChange={handleFileChange}
          />
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <p>Click here to select ZIP/RAR files</p>
          )}
        </div>
        {selectedFiles.length > 0 && (
          <div>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
        {selectedRequest?.file && (
          <div>
            <p>Current Files:</p>
            <ul>
              {JSON.parse(selectedRequest.file).map((url, index) => (
                <li key={index}>
                  <a href={url} target="_blank" rel="noreferrer">
                    File {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Form.Group>

      {/* Status Field */}
      <Form.Group controlId="formStatusCategory">
        <Form.Label>Status</Form.Label>
        <Form.Select
          aria-label="Select Status"
          value={newLeaveRequest.status ? newLeaveRequest.status : selectedRequest?.leave?.status}
          onChange={(event) =>
            setNewLeaveRequest((prevTask) => ({
              ...prevTask,
              status: event.target.value,
            }))
          }
        >
          <option value="">Select Status</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Denied">Denied</option>
        </Form.Select>
      </Form.Group>

      {/* Comment Field */}
      <Form.Group controlId="formStudyCategory">
        <Form.Label>Comment</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="Enter comment"
          value={newLeaveRequest.comment ? newLeaveRequest.comment : selectedRequest?.leave?.comment}
          onChange={(event) =>
            setNewLeaveRequest((prevTask) => ({
              ...prevTask,
              comment: event.target.value,
            }))
          }
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleEditRequestClose}>
      Close
    </Button>
    <Button variant="dark" onClick={editRequest}>
      Submit
    </Button>
  </Modal.Footer>
</Modal>

      
       {/* delete confirmation modal for tasks */}
       <Modal show={deleteRequestShow} onHide={handleDeleteRequestClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to deny this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteRequestClose}>
            No
          </Button>
          <Button variant="danger" onClick={deleteRequest}>
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
                  <td>{request.email}</td>
                  <td>{request.name}</td>
                  <td>{request?.leave?.semester}</td>
                  <td>{request?.leave?.year}</td>
                  <td style={{ textAlign: "center" }}>
                  {request?.leave?.file ? (
                      (() => {
                          try {
                              const files = JSON.parse(request.leave.file);
                              return files.map((url, urlIndex) => (
                                  <div key={urlIndex}>
                                      <a href={url} target="_blank" rel="noreferrer noopener">
                                          <span className='link'>
                                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M26 17.3333H22.1625L24.0833 15.4125C25.3375 14.1583 24.45 12 22.6708 12H20.0042V7.33331C20.0042 6.22915 19.1083 5.33331 18.0042 5.33331H14.0042C12.9 5.33331 12.0042 6.22915 12.0042 7.33331V12H9.3375C7.5625 12 6.6625 14.1541 7.925 15.4125L9.84583 17.3333H6C4.89583 17.3333 4 18.2291 4 19.3333V24.6666C4 25.7708 4.89583 26.6666 6 26.6666H26C27.1042 26.6666 28 25.7708 28 24.6666V19.3333C28 18.2291 27.1042 17.3333 26 17.3333ZM9.33333 14H14V7.33331H18V14H22.6667L16 20.6666L9.33333 14ZM26 24.6666H6V19.3333H11.8375L14.5833 22.0791C15.3667 22.8625 16.6292 22.8583 17.4125 22.0791L20.1583 19.3333H26V24.6666ZM22.3333 22C22.3333 21.4458 22.7792 21 23.3333 21C23.8875 21 24.3333 21.4458 24.3333 22C24.3333 22.5541 23.8875 23 23.3333 23C22.7792 23 22.3333 22.5541 22.3333 22Z" fill="#2a75c0"/>
                                          </svg>
                                              <label class="link-label">Download</label>
                                          </span>
                                      </a>
                                  </div>
                              ));
                          } catch (error) {
                              console.error("Invalid file format:", error);
                              return <p>Unable to display files</p>;
                          }
                      })()
                  ) : (
                      <p>No files available</p>
                  )}
                  </td>
                  <td>{request?.leave?.status}</td>
                  <td>{request?.leave?.comment_id}</td>
                  <td style={{ textAlign: "center",  }}>
                    <div style={{display: 'flex', justifyContent: 'center', gap: '10px',}}>
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
                    <label class="link-label">Deny</label>
                    </span>
                    </div>
                    
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