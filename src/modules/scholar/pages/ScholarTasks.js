import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Table, Button, Modal, Form } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import API from 'services/Api'
import { toast, ToastContainer, Slide } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import Stack from 'modules/generic/spinnerV2';
import { useDropzone } from 'react-dropzone';
import "../style.css";
const TABLE_HEADERS = ["#", "Year", "Semester", "Type", "File", "Actions"];

function ScholarTasks() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const details = useSelector(state => state.details);

    const location = useLocation();
    const scholar = user;

    // console.log(scholar); 

    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        id: details.user_id,
        year: '',
        semester: '',
        type: '',
        // approval_status: 'pending',
    });
    const [selectedTask, setSelectedTask] = useState([]);
    const [validation, setValidation] = useState({
        year: true,
        semester: true,
        file: true,
        type: true,
      });    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState({ add: false, edit: false, delete: false });
    const [selectedFiles, setSelectedFiles] = useState([]);

    const midtermInput = useRef(null);
    const finalInput = useRef(null);
    const fileInput = useRef(null);
    // Redux dispatchers
  const state = useSelector((state) => state);
  
    const setIsLoadingV2 = (status) => {
        dispatch({ type: 'SET_IS_LOADING_V2', payload: { status } });
    };

    const handleModalShow = (type, task = null) => {
        setSelectedTask(task);
        
        setShowModal({ ...showModal, [type]: true });
    };

    const handleModalClose = (type) => {
        setShowModal({ ...showModal, [type]: false })
        resetFiles()
        
    };

    const fetchTasks = async () => {
        setIsLoading(true);
        setIsLoadingV2(true)
        API.request(
            'scholar_tasks/retrieveMultipleByParameter',
            { col: 'scholar_id', value: details.user_id },
            response => {
                if (response && response.data) {
                    setTasks(response.data);
                } else {
                    toast.error('An error occurred. Please try again');
                }
                setIsLoading(false);
                setIsLoadingV2(false)

            },
            error => {
                console.error(error);
                toast.error('Error fetching tasks');
                setIsLoading(false);
                setIsLoadingV2(false)

            }
        );
    };

    const formValidation = () => {
        let formIsValid = true;
        const updatedValidation = { ...validation };
        
        // Validate each field in the form
        Object.entries(newTask).forEach(([key, value]) => {
            if (key === 'file') {
                // Check if files are selected and if the number of files is <= 5
                if (!selectedFiles || selectedFiles.length === 0) {
                    updatedValidation.file = false;
                    formIsValid = false;
                } else if (selectedFiles.length > 5) {
                    updatedValidation.file = false;
                    formIsValid = false;
                    toast.error('You can upload a maximum of 5 files.');
                } else {
                    updatedValidation.file = true;
                }
            } else if (!value) {
                updatedValidation[key] = false;
                formIsValid = false;
            } else {
                updatedValidation[key] = true;
            }
        });
    
        setValidation(updatedValidation);
        return formIsValid;
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
        if (validFiles.length + selectedFiles.length > 5) {
            toast.error('You can only upload up to 5 zip/rar files.');
            return;
        }
        // Update selected files state
        setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);
    };

    const createTask = async (e) => {
      e.preventDefault();
      setIsLoadingV2(true)

    if(formValidation())
    {
        const formData = new FormData();
        formData.append('scholar_id', newTask.id);
        formData.append('year', newTask.year);
        formData.append('semester', newTask.semester);
        formData.append('type', newTask.type);
        selectedFiles.forEach((file, index) => {
            formData.append('file[]', file); 
            console.log(file)
        });  
        
        API.uploadFile('scholar_tasks/create', formData, response => {
            console.log("API response:", response);  // Log the response for debugging
            if (response.data !== null) {
                const newTaskData = {
                    ...response.data, tempId: uuidv4() 
                };
                setTasks(prevTasks => [...prevTasks, newTaskData]); // Update local tasks state
                setSelectedFiles([]); // Clear the selected file
                toast.success('Task created successfully');
                setShowModal({ ...showModal, add: false });
                fetchTasks();
                resetFiles()
            } else {
                toast.error('An error occurred. Please try again1111');
            }
            setIsLoading(false);
            setIsLoadingV2(false)

        }, error => {
            console.error(error);
            toast.error('Error creating task. Check your connection and try again');
            setIsLoading(false);
            setIsLoadingV2(false)

        });
      }
  };
  

    const editTask = async (e) => {
        // e.preventDefault();
        setIsLoading(true);
        setIsLoadingV2(true)

        const formData = new FormData();
        formData.append('scholar_id', selectedTask.id);
        formData.append('year', selectedTask.year);
        formData.append('semester', selectedTask.semester);
        formData.append('type', selectedTask.type);
        selectedFiles.forEach((file, index) => {
            formData.append('file[]', file); 
            console.log(file)
        });  

        API.uploadFile('scholar_tasks/update', formData, response => {
            if (response && response.data) {
                fetchTasks();
                toast.success('Task updated successfully');
            } else {
                toast.error('Error updating task');
            }
            setIsLoading(false);
            setIsLoadingV2(false)

            setShowModal({ ...showModal, edit: false });
        }, error => {
            console.error(error);
            toast.error('Error updating task');
            setIsLoading(false);
            setIsLoadingV2(false)

        });
    };

    const deleteTask = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setIsLoadingV2(true)

        console.log('Deleting Task:', selectedTask);
        API.request('scholar_tasks/delete', { id: selectedTask.id }, () => {
            setTasks(tasks.filter(task => task.id !== selectedTask.id));
            toast.success('Task deleted successfully');
            setIsLoading(false);
            setIsLoadingV2(false)

            setShowModal({ ...showModal, delete: false });
        }, error => {
            console.error(error);
            toast.error('Error deleting task');
            setIsLoading(false);
            setIsLoadingV2(false)

        });
    };
    const handleInputChange = (fieldName, event) => {
        setNewTask(prevState => ({
            ...prevState,
            [fieldName]: event.target.value
        }));
      };
    const resetFiles = () => {
        setSelectedFiles([]);
        setNewTask({
            id: details.user_id,
            year: '',
            semester: '',
            type: '',
            })
    };
    useEffect(() => {
        fetchTasks();
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleFileChange, accept: '.zip, .rar' });

    return (
        <>
            {/* <ToastContainer position="top-right" autoClose={5000} hideProgressBar transition={Slide} /> */}
            <div style={{ float: 'left', textAlign: 'left' }}>
                {/* <h3>Welcome {scholar.account_details.last_name} {scholar.account_details.first_name}</h3> */}
              <h3>Scholar Tasks</h3>
              <p>This is the Scholar Tasks page</p>
            </div>
            {/* <Button onClick={() => handleModalShow('add')} style={{ float: 'right', marginTop: '1rem' }}>Add New Task</Button> */}
            <div class="contentButton">
              <button onClick={() => handleModalShow('add')} style={{ float: 'right', marginTop: '1rem' }}>+ Add New Task</button>
        </div>
        <div className="table-container"  style={{ marginTop: '4.5rem' }}>
            <Table striped border hover>
                <thead>
                    <tr>{TABLE_HEADERS.map(header => <th key={header}>{header}</th>)}</tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={TABLE_HEADERS.length}><Skeleton count={3} height={50} /></td>
                        </tr>
                    )}
                    {!isLoading && tasks.length === 0 && (
                        <tr>
                            <td colSpan={TABLE_HEADERS.length} style={{ textAlign: 'center' }}>
                                Oops, looks like there are no tasks submitted.
                            </td>
                        </tr>
                    )}
                    {!isLoading && tasks.length > 0 && (
                        tasks.map((task, index) => (
                            <tr key={task.id || task.tempId}>
                                <td>{index + 1}</td>
                                <td>{task.year}</td>
                                <td>{task.semester}</td>
                                <td>{task.type}</td>
                                <td>
                                    {/* Check if 'portfolio.study' is a valid JSON string and not null/undefined */}
                                    {task.file ? (
                                        JSON.parse(task.file).map((url, urlIndex) => (
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
                                        ))
                                    ) : (
                                        <p>No files available</p>
                                    )}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                              <span className="link" onClick={() => handleModalShow('edit', task)}>
                                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.5721 14.7789L16.5722 13.779C16.7284 13.6228 17.0003 13.7322 17.0003 13.9571V18.5002C17.0003 19.3282 16.3284 20 15.5003 20H4.50003C3.67189 20 3 19.3282 3 18.5002V7.50183C3 6.67383 3.67189 6.00205 4.50003 6.00205H13.0471C13.269 6.00205 13.3815 6.27076 13.2252 6.43011L12.2252 7.42997C12.1783 7.47683 12.1158 7.50183 12.0471 7.50183H4.50003V18.5002H15.5003V14.9539C15.5003 14.8882 15.5253 14.8258 15.5721 14.7789ZM20.466 8.47356L12.2596 16.6786L9.43451 16.9911C8.61575 17.0817 7.91886 16.3912 8.00948 15.5663L8.32199 12.7417L16.5284 4.53664C17.2441 3.82112 18.4003 3.82112 19.1128 4.53664L20.4629 5.88644C21.1785 6.60196 21.1785 7.76117 20.466 8.47356ZM17.3784 9.43905L15.5628 7.62369L9.7564 13.4322L9.52827 15.4725L11.5689 15.2444L17.3784 9.43905ZM19.4035 6.94879L18.0535 5.59898C17.9253 5.47088 17.7159 5.47088 17.5909 5.59898L16.6253 6.56447L18.441 8.37983L19.4066 7.41434C19.5316 7.28311 19.5316 7.07689 19.4035 6.94879Z" fill="#404041"/>
                                    </svg>
                                    <label class="link-label">Edit</label>
                                  </span>
                                <span className="link" onClick={() => handleModalShow('delete', task)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.4874 11.9998L16.8537 8.63358C17.0484 8.4389 17.0484 8.12296 16.8537 7.92796L16.0715 7.14577C15.8768 6.95108 15.5608 6.95108 15.3658 7.14577L11.9998 10.5123L8.63354 7.14608C8.43885 6.9514 8.12291 6.9514 7.92791 7.14608L7.14602 7.92796C6.95133 8.12265 6.95133 8.43858 7.14602 8.63358L10.5123 11.9998L7.14602 15.3661C6.95133 15.5608 6.95133 15.8767 7.14602 16.0717L7.92822 16.8539C8.12291 17.0486 8.43885 17.0486 8.63385 16.8539L11.9998 13.4873L15.3661 16.8536C15.5608 17.0483 15.8768 17.0483 16.0718 16.8536L16.854 16.0714C17.0487 15.8767 17.0487 15.5608 16.854 15.3658L13.4874 11.9998Z" fill="red"/>
                                    </svg>
                                    <label class="link-label">Delete</label>
                                  </span>

                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>


        <Modal show={showModal.add} onHide={() => handleModalClose('add')}>
                <div style={{ background: "#404041", color: "#f5f5f5", borderRadius: "8px 8px 0px 0px"}} data-bs-theme="dark" className='bg-dark p-2'>
                <Modal.Header closeButton><Modal.Title>Add New Task</Modal.Title></Modal.Header>
                </div>
                <Modal.Body>
                    <Form>
                    <Form.Group controlId="formYearCategory">
                        <Form.Label>Year</Form.Label>
                        <Form.Select
                            aria-label="Select Year"
                            value={newTask.year}
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
                            value={newTask.semester}
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
                    <Form.Group controlId="formSemesterCategory">
                        <Form.Label>Type</Form.Label>
                        <Form.Select
                            aria-label="Select Submission Type"
                            value={newTask.type}
                            onChange={(event) => handleInputChange('type', event)}
                        >
                            <option value="">Select type</option>
                            <option value="midterms">Midterms</option>
                            <option value="finals">Finals</option>
                        </Form.Select>
                        {!validation.semester && (
                            <p style={{color:'red', fontStyle:'italic'}}>Type</p>
                        )}
                    </Form.Group>
                  <br/>
                    <Form.Group controlId="formMidterm">
                        <Form.Label>
                            Files
                            <Button
                                variant="link"
                                onClick={resetFiles}
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
                        {/* {selectedTask.length > 0 && (
                            <div>
                                <ul>
                                    {selectedTask.map((file, index) => (
                                        <li key={index}>{file.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )} */}
                    </Form.Group>
                        {/* <Form.Group controlId="formFinal">
                            <Form.Label>Final</Form.Label>
                            <Form.Control type="file" onChange={(event) => handleFileChange('final_assessment', event)} ref={finalInput} />
                        </Form.Group> */}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleModalClose('add')}>Close</Button>
                    <Button variant="dark" onClick={createTask}>Submit</Button>
                </Modal.Footer>
            </Modal>

        <Modal show={showModal.edit} onHide={() => handleModalClose('edit')}>
                <div style={{ background: "#404041", color: "#f5f5f5", borderRadius: "8px 8px 0px 0px"}} data-bs-theme="dark" className='bg-dark p-2'>
                <Modal.Header closeButton><Modal.Title>Edit Task</Modal.Title></Modal.Header>
                </div>
                <Modal.Body>
                    <Form>
                    <Form.Group controlId="formYearCategory">
                        <Form.Label>Year</Form.Label>
                        <Form.Select
                            aria-label="Select Year"
                            value={selectedTask?.year || ''}
                            onChange={(event) => setSelectedTask(prev => ({ ...prev, year: event.target.value }))}
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
                            value={selectedTask?.semester || ''}
                            onChange={(event) => setSelectedTask(prev => ({ ...prev, semester: event.target.value }))}
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
                    <Form.Group controlId="formSemesterCategory">
                        <Form.Label>Type</Form.Label>
                        <Form.Select
                            aria-label="Select Submission Type"
                            value={selectedTask?.type || ''}
                            onChange={(event) => setSelectedTask(prev => ({ ...prev, type: event.target.value }))}
                        >
                            <option value="">Select type</option>
                            <option value="midterms">Midterms</option>
                            <option value="finals">Finals</option>
                        </Form.Select>
                        {!validation.semester && (
                            <p style={{color:'red', fontStyle:'italic'}}>Type</p>
                        )}
                    </Form.Group>
                  <br/> 
                    <Form.Group controlId="formStudy">
                        <Form.Label>
                            Files
                            <Button
                                variant="link"
                                onClick={resetFiles}
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
                    <Button variant="secondary" onClick={() => handleModalClose('edit')}>Close</Button>
                    <Button variant="dark" onClick={()=> editTask(selectedTask)}>Submit</Button>
                </Modal.Footer>
            </Modal>

        <Modal show={showModal.delete} onHide={() => handleModalClose('delete')}>
               <div style={{ background: "#404041", color: "#f5f5f5", borderRadius: "8px 8px 0px 0px"}} data-bs-theme="dark" className='bg-dark p-2'>
                <Modal.Header closeButton><Modal.Title>Delete Task</Modal.Title></Modal.Header>
                </div>
                <Modal.Body>
                    Are you sure you want to delete this task?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleModalClose('delete')}>Close</Button>
                    <Button variant="danger" onClick={deleteTask}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ScholarTasks;
