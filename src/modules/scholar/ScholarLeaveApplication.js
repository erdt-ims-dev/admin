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
import { useDropzone } from 'react-dropzone';

const TABLE_HEADERS = ["#", "Year", "Semester", "Leave Letter", "Status", "Comment", "Action"];

function ScholarLeaveApplication() {
  const location = useLocation();
  const scholar = location.state.scholar;

  const [leaverequests, setLeaveRequests] = useState([]);
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    id: scholar.id,
    year: '',
    semester: '',
    file: '',
    status: 'pending',
    comment_id: 'None',
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
    year: true,
    semester: true,
    file: true,
    status: true,
    comment: true,
    comment_id: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState([]);
  const [errorModal, setErrorModal] = useState(false); 
  const [show, setShow] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState({
    year: '',
    semester: '',
    status: '',
    id: ''
  });  
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [editRequestShow, setEditRequestShow] = useState(false);

  const errorClose = () => setErrorModal(false);
  const errorShow = () => setErrorModal(true);

  const handleClose = () => {
    setError([]);
    setValidation({
      id: true,
      year: true,
      semester: true,
      file: true,
    });
    resetFiles()
    setShow(false);
  };
  const handleShow = () => setShow(true);

  
  //edit modal
  
  
  const handleEditRequestShow = (request) => {
    setSelectedRequest(request);
    setEditRequestShow(true);
  }
  const handleEditRequestClose = () => {
    setEditRequestShow(false)
    resetFiles()

  };
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
  // const handleFileChange = (fieldName, event) => {
  //   const file = event.target.files[0];
  //     setNewLeaveRequest((prevState) => ({
  //     ...prevState,
  //       [fieldName]: file,
  //     }));
      
  //     if (selectedRequest) {
  //       setSelectedRequest({...selectedRequest, [fieldName]: file });
  //     }
  // };
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

//   const formValidation = () => {
//     let formIsValid = true;
//     const updatedValidation = { ...validation };
    
//     // Validate each field in the form
//     Object.entries(newLeaveRequest).forEach(([key, value]) => {
//         if (key === 'file') {
//             // Check if files are selected and if the number of files is <= 5
//             if (!selectedRequest || selectedRequest.length === 0) {
//               console.log("1")
//                 updatedValidation.file = false;
//                 formIsValid = false;
//             } else if (selectedRequest.length > 5) {
//               console.log("2")

//                 updatedValidation.file = false;
//                 formIsValid = false;
//                 toast.error('You can upload a maximum of 5 files.');
//             } else {
//               console.log("3")

//                 updatedValidation.file = true;
//             }
//         } else if (!value) {
//             updatedValidation[key] = false;
//             formIsValid = false;
//             console.log("4")

//         } else {
//           console.log("5")

//             updatedValidation[key] = true;
//         }
//     });

//     setValidation(updatedValidation);
//     return formIsValid;
// };
const formValidation = () => {
  let formIsValid = true;
  const updatedValidation = { ...validation };

  if (!selectedRequest.year) {
      updatedValidation.year = false;
      formIsValid = false;
  }
  if (!selectedRequest.semester) {
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
    setIsLoadingV2(true);

    if (formValidation()) {
      const formData = new FormData();
      formData.append('user_id', newLeaveRequest.id);
      formData.append('year', newLeaveRequest.year);
      formData.append('semester', newLeaveRequest.semester);
      formData.append('status', newLeaveRequest.status);
      formData.append('comment_id', newLeaveRequest.comment_id);
      selectedRequest.forEach((file, index) => {
        formData.append('file[]', file); 
        console.log(file)
    });  
      API.uploadFile('leave_application/upload', formData, response => {
        if (response && response.data !== null) {
          // console.log('Data created successfully', response.data);
          toast.success("Leave request created successfully");
          const newLeaveRequest = {...response.data, tempId: uuidv4() };
          setLeaveRequests(prevTasks => [...prevTasks, newLeaveRequest]);
          resetFiles()
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
      formData.append('id', selectedRequest.id);
      formData.append('semester', selectedRequest.semester);
      formData.append('year', selectedRequest.year);
      formData.append('status', selectedRequest.status);
      selectedFiles.forEach((file, index) => {
        formData.append('file[]', file); 
      });
      //console.log(selectedRequest.id);
      API.uploadFile('leave_application/uploadEdit', formData, response => {
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
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleFileChange, accept: '.zip, .rar' });
  
  const resetFiles = () => {
    setSelectedRequest([]);
    setSelectedFiles([]);
    setNewLeaveRequest({
      id: scholar.id,
      year: '',
      semester: '',
      // leave_letter: '',
      status: 'pending',
      comment_id: 'None',
        })
};
const resetFilesOnly = () => {
  setSelectedFiles([]);
  
};


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
        <Modal.Header closeButton>
          <Modal.Title>Edit Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
        <Form.Group controlId="formYearCategory">
                        <Form.Label>Year</Form.Label>
                        <Form.Select
                            aria-label="Select Year"
                            value={selectedRequest?.year || ''}
                            onChange={(event) => setSelectedRequest(prev => ({ ...prev, year: event.target.value }))}
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
                    <Form.Group controlId="formSemesterCategory">
                        <Form.Label>Semester</Form.Label>
                        <Form.Select
                            aria-label="Select Semester"
                            value={selectedRequest?.semester || ''}
                            onChange={(event) => setSelectedRequest(prev => ({ ...prev, semester: event.target.value }))}
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
                  <td>{request.year}</td>
                  <td>{request.semester}</td>
                  {/* <td style={{ textAlign: "center" }}> */}
                  {/* <span className='link'>
                    <a href={request.leave_letter} target="_blank" rel="noreferrer noopener">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M27.8453 16.9608L24.8549 13.9479C24.5403 13.6312 23.9999 13.8537 23.9999 14.3V16.3366H19.9999V10.8325C19.9999 10.3033 19.7845 9.79082 19.4095 9.41624L15.9141 5.92084C15.5391 5.54584 15.0308 5.33334 14.502 5.33334H5.99957C4.89583 5.33751 4 6.23334 4 7.33708V24.667C4 25.7708 4.89583 26.6666 5.99957 26.6666H17.997C19.1012 26.6666 19.9999 25.7708 19.9999 24.667V20.3362H17.9999V24.667H5.99957V7.33708H12.665V11.6696C12.665 12.2237 13.1108 12.6691 13.665 12.6691H17.9999V16.3362H11.1666C10.8904 16.3362 10.6666 16.56 10.6666 16.8362V17.8362C10.6666 18.1125 10.8904 18.3362 11.1666 18.3362H23.9999V20.3729C23.9999 20.8191 24.5403 21.0416 24.8549 20.7249L27.8453 17.712C28.0516 17.5041 28.0516 17.1687 27.8453 16.9608ZM14.6645 10.6696V7.49958L17.8349 10.6696H14.6645Z" fill="#404041"/>
                    </svg>
                    </a>
                  </span> */}
                  {/* <span className='link'>
                    <a href={request.file} target="_blank" rel="noreferrer noopener">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M27.8453 16.9608L24.8549 13.9479C24.5403 13.6312 23.9999 13.8537 23.9999 14.3V16.3366H19.9999V10.8325C19.9999 10.3033 19.7845 9.79082 19.4095 9.41624L15.9141 5.92084C15.5391 5.54584 15.0308 5.33334 14.502 5.33334H5.99957C4.89583 5.33751 4 6.23334 4 7.33708V24.667C4 25.7708 4.89583 26.6666 5.99957 26.6666H17.997C19.1012 26.6666 19.9999 25.7708 19.9999 24.667V20.3362H17.9999V24.667H5.99957V7.33708H12.665V11.6696C12.665 12.2237 13.1108 12.6691 13.665 12.6691H17.9999V16.3362H11.1666C10.8904 16.3362 10.6666 16.56 10.6666 16.8362V17.8362C10.6666 18.1125 10.8904 18.3362 11.1666 18.3362H23.9999V20.3729C23.9999 20.8191 24.5403 21.0416 24.8549 20.7249L27.8453 17.712C28.0516 17.5041 28.0516 17.1687 27.8453 16.9608ZM14.6645 10.6696V7.49958L17.8349 10.6696H14.6645Z" fill="#404041"/>
                    </svg>
                    </a>
                    <label className='link-label' style={{ width: "4rem" }}>View file</label>
                  </span> */}
                  {/* </td> */}
                  <td style={{ textAlign: "center" }}>
                      {request.file ? (
                          JSON.parse(request.file).map((url, urlIndex) => (
                              <div key={urlIndex}>
                                  <a href={url} target="_blank" rel="noreferrer noopener">
                                      Download File 
                                  </a>

                              </div>
                          ))
                      ) : (
                          <p>No files available</p>
                      )}
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
                    <label className='link-label'>Edit</label>
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