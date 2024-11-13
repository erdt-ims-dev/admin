import { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom';
import { Table, Button, Modal, Form } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import API from 'services/Api';
import { toast, ToastContainer, Slide } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';

const TABLE_HEADERS = ["#", "Year", "Semester", "Type", "File", "Action"];

function ScholarTasks() {
    const location = useLocation();
    const scholar = location.state.scholar;

    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        id: scholar.id,
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
    const dispatch = useDispatch();
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
            { col: 'scholar_id', value: scholar.id },
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
            id: scholar.id,
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
                <h3>Welcome {scholar.account_details.last_name} {scholar.account_details.first_name}</h3>
                <p>This is the Scholar Tasks page</p>
            </div>
            {/* <Button onClick={() => handleModalShow('add')} style={{ float: 'right', marginTop: '1rem' }}>Add New Task</Button> */}
            <div class="contentButton">
              <button onClick={() => handleModalShow('add')} style={{ float: 'right', marginTop: '1rem' }}>+ Add New Task</button>
            </div>
            <Table style={{ marginTop: '4.5rem' }}>
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
                                                    Download File
                                                </a>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No files available</p>
                                    )}
                                </td>
                                <td>
                                    <span className="link" onClick={() => handleModalShow('edit', task)}>Edit</span>
                                    <span className="link" onClick={() => handleModalShow('delete', task)}>Delete</span>

                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            <Modal show={showModal.add} onHide={() => handleModalClose('add')}>
                <Modal.Header closeButton><Modal.Title>Add New Task</Modal.Title></Modal.Header>
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
                    <Button variant="primary" onClick={createTask}>Submit</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModal.edit} onHide={() => handleModalClose('edit')}>
                <Modal.Header closeButton><Modal.Title>Edit Task</Modal.Title></Modal.Header>
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
                    <Button variant="primary" onClick={()=> editTask(selectedTask)}>Submit</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModal.delete} onHide={() => handleModalClose('delete')}>
                <Modal.Header closeButton><Modal.Title>Delete Task</Modal.Title></Modal.Header>
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
