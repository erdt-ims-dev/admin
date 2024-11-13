import { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import API from 'services/Api';
import { Table, Button, Modal, Form } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';
import "./style.scss";
import { useDispatch, useSelector } from 'react-redux';
import { 
    faCloudArrowDown
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const TABLE_HEADERS = ["#", "Study Name", "Study", "Study Category", "Publish Type", "Action"];

function ScholarPortfolio() {
    const location = useLocation();
    const scholar = location.state.scholar;

    const [portfolios, setPortfolios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [newPortfolios, setNewPortfolios] = useState({
      id: scholar.id,
      study_name: '',
      study: '',
      study_category: '',
      publish_type: '',
    });
    const [validation, setValidation] = useState({
      study_name: true,
      study: true,
      study_category: true,
      publish_type: true,
    });
    const [selectedFiles, setSelectedFiles] = useState([]);

    const [selectedPortfolio, setSelectedPortfolio] = useState(null); // Add state for selected portfolio
    const [editShow, setEditShow] = useState(false); // State for edit modal
    const [deleteShow, setDeleteShow] = useState(false); // State for delete modal
    const studyFile = useRef(null); // Reference for file input in edit modal
    // Redux dispatchers
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const setIsLoadingV2 = (status) => {
        dispatch({ type: 'SET_IS_LOADING_V2', payload: { status } });
    };
    const handleClose = () => {
        setShow(false)
        resetFiles()
    };
    const handleShow = () => setShow(true);

    const handleEditShow = (portfolio) => {
        setSelectedPortfolio(portfolio);
        setEditShow(true);
    };
    const handleEditClose = () => setEditShow(false);

    const handleDeleteShow = (portfolio) => {
        setSelectedPortfolio(portfolio);
        setDeleteShow(true);
    };
    const handleDeleteClose = () => setDeleteShow(false);

    const handleInputChange = (fieldName, event) => {
      setNewPortfolios(prevState => ({
          ...prevState,
          [fieldName]: event.target.value
      }));
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
    
  
    const fetchPortfolio = async () => {
        API.request('scholar_portfolio/retrieveMultipleByParameter', { col: 'scholar_id', value: scholar.id }, 
        response => {
            if (response && response.data) {
                setPortfolios(response.data);
            } else {
                toast.error('Error retrieving portfolios');
            }
            setIsLoading(false); // End loading after data fetch
        }, error => {
            toast.error('Error retrieving portfolios. Check your connection and try again');
            setIsLoading(false);
        });
    };

    const formValidation = () => {
        let formIsValid = true;
        const updatedValidation = { ...validation };
        
        // Validate each field in the form
        Object.entries(newPortfolios).forEach(([key, value]) => {
            if (key === 'study') {
                // Check if files are selected and if the number of files is <= 5
                if (!selectedFiles || selectedFiles.length === 0) {
                    updatedValidation.study = false;
                    formIsValid = false;
                } else if (selectedFiles.length > 5) {
                    updatedValidation.study = false;
                    formIsValid = false;
                    toast.error('You can upload a maximum of 5 files.');
                } else {
                    updatedValidation.study = true;
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
    

    const createNewPortfolio = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setIsLoadingV2(true);
        if (formValidation()) {
            const formData = new FormData();
            formData.append('scholar_id', newPortfolios.id);
            formData.append('study_name', newPortfolios.study_name);
            formData.append('study_category', newPortfolios.study_category);
            formData.append('publish_type', newPortfolios.publish_type);
            // Append all selected files
            selectedFiles.forEach((file, index) => {
                formData.append('study[]', file); // Use 'study[]' to handle multiple files
            });
            API.uploadFile('scholar_portfolio/upload', formData, response => {
                if (!response.data.error) {
                    const newPortfolio = { ...response.data, tempId: uuidv4() };
                    setPortfolios(prevTasks => [...prevTasks, newPortfolio]);
                    fetchPortfolio();
                    setShow(false);
                    setSelectedFiles([]); // Clear the selected file
                    toast.success('Portfolio created successfully');
                } else {
                    toast.error('Error creating portfolio');
                }
                setIsLoading(false);
                setIsLoadingV2(false);

            }, error => {
                toast.error('Error creating portfolio');
                setIsLoading(false);
                setIsLoadingV2(false);

            });
        } else {
            toast.warning('Please fill in all required fields');
            setIsLoading(false);
            setIsLoadingV2(false);

        }
    };
    const editPortfolio = async (e) => {
      // e.preventDefault();
      setIsLoading(true);
      setIsLoadingV2(true);

      const formData = new FormData();
      formData.append('id', selectedPortfolio.id);
      formData.append('scholar_id', newPortfolios.id);
      formData.append('study_name', selectedPortfolio.study_name);
  
      // Append all selected files like in createNewPortfolio
    selectedFiles.forEach((file, index) => {
        formData.append('study[]', file)
    });
  
      formData.append('study_category', selectedPortfolio.study_category);
      formData.append('publish_type', selectedPortfolio.publish_type);
  
      API.uploadFile('scholar_portfolio/uploadEdit', formData, 
          (response) => {
              if (!response.data.error) {
                toast.success('Portfolio updated successfully');
                fetchPortfolio(); // Refresh portfolio list
                setEditShow(false); // Close edit modal
                setSelectedFiles([]); // Clear the selected files for future edits
              } else {
                  toast.error('Error updating portfolio');
              }
              setIsLoading(false); // End loading
              setIsLoadingV2(false);
          }, 
          (error) => {
              console.log(error);
              toast.error('Error updating portfolio');
              setIsLoadingV2(false);

              setIsLoading(false);
          }
      );
  };
  const deletePortfolio = async () => {
    setIsLoading(true); 
    setIsLoadingV2(true);

    // Call API to delete the selected portfolio
    API.request(
        'scholar_portfolio/delete',
        { id: selectedPortfolio.id },
        (response) => {
            toast.success('Entry deleted successfully');
            // Filter out the deleted portfolio from the local state
            setPortfolios(portfolios.filter(portfolio => portfolio.id !== selectedPortfolio.id));
            setIsLoading(false); 
            setIsLoadingV2(false);

        },
        (error) => {
            toast.error('There was an error in deleting the entry');

            console.error(error);
            setIsLoading(false); 
            setIsLoadingV2(false);

        }
    );

    // Close the delete modal
    setDeleteShow(false);
};

  
    useEffect(() => {
        fetchPortfolio();
    }, []);

    // const onDrop = (acceptedFiles) => {
    //     if (acceptedFiles && acceptedFiles.length > 0) {
    //         // Check if the total files do not exceed 5
    //         if (selectedFiles.length + acceptedFiles.length <= 5) {
    //             // Update state based on the previous state value
    //             setSelectedFiles((prevFiles) => {
    //                 const updatedFiles = [...prevFiles, ...acceptedFiles];
    //                 return updatedFiles; // Return the new array of files
    //             });
    //         } else {
    //             toast.error('You can only upload up to 5 files!');
    //         }
    //     }
    // };
    const resetFiles = () => {
        setSelectedFiles([]);
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleFileChange, accept: '.zip, .rar' });

    return (
      <>
        <div style={{ float:'left', textAlign:'left'}}>
            <h3>{scholar.account_details.last_name} {scholar.account_details.first_name}'s Portfolio</h3>
            <p>Below are all the files submitted</p>
        </div>
        <div style={{float:'right', marginTop:'1rem'}}>
            {/* <Button onClick={handleShow}> Add New Study </Button> */}
            <div class="contentButton">
              <button onClick={handleShow}>+ Add New Study</button>
            </div>

        </div>

        <Modal show={show} onHide={handleClose}>
            <div style={{ background: "#404041", color: "#f5f5f5", borderRadius: "8px 8px 0px 0px"}} data-bs-theme="dark" className='bg-dark p-2'>
            <Modal.Header closeButton>
                <Modal.Title>Add New Study</Modal.Title>
            </Modal.Header>
            </div>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formStudyName">
                        <Form.Label>Study Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Study Name"
                            onChange={(event) => handleInputChange('study_name', event)}
                        />
                        {!validation.study_name && (
                            <p style={{color:'red', fontStyle:'italic'}}>Enter study name</p>
                        )}
                        </Form.Group>
                        <br/>
                    <Form.Group controlId="formStudyCategory">
                        <Form.Label>Study Category</Form.Label>
                        <Form.Select
                            aria-label="Select Study Category"
                            value={newPortfolios.study_category}
                            onChange={(event) => handleInputChange('study_category', event)}
                        >
                            <option value="">Select Study Category</option>
                            <option value="Journal">Journal</option>
                            <option value="Research Paper">Research Paper</option>
                            <option value="Case Study">Case Study</option>
                            <option value="Other">Other</option>
                        </Form.Select>
                        {!validation.study_category && (
                            <p style={{color:'red', fontStyle:'italic'}}>Enter category</p>
                        )}
                    </Form.Group>
                        <br/>
                    <Form.Group controlId="formPublishType">
                        <Form.Label>Publish Type</Form.Label>
                        <Form.Select
                            aria-label="Select Publish Type"
                            value={newPortfolios.publish_type}
                            onChange={(event) => handleInputChange('publish_type', event)}
                        >
                            <option value="">Select Publish Type</option>
                            <option value="Local">Local</option>
                            <option value="International">International</option>
                        </Form.Select>
                        {!validation.publish_type && (
                            <p style={{color:'red', fontStyle:'italic'}}>Enter publish type</p>
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
                        {!validation.study && (
                            <p style={{color:'red', fontStyle:'italic'}}>Please select files</p>
                        )}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="dark" onClick={createNewPortfolio}>Submit</Button>
            </Modal.Footer>
        </Modal>
        {/* Edit */}
        <Modal show={editShow} onHide={handleEditClose}>
            <div style={{ background: "#404041", color: "#f5f5f5", borderRadius: "8px 8px 0px 0px"}} data-bs-theme="dark" className='bg-dark p-2'>
            <Modal.Header closeButton>
                <Modal.Title>Edit New Study</Modal.Title>
            </Modal.Header>
                            </div>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formStudyName">
                        <Form.Label>Study Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter Study Name" 
                            onChange={(event) => setSelectedPortfolio(prev => ({ ...prev, study_name: event.target.value }))} 
                            value={selectedPortfolio?.study_name || ''} 
                        />
                    </Form.Group>
                        <br/>
                    <Form.Group controlId="formStudyCategory">
                        <Form.Label>Study Category</Form.Label>
                        <Form.Select
                            aria-label="Select Study Category"
                            value={selectedPortfolio?.study_category || ''}
                            onChange={(event) => setSelectedPortfolio(prev => ({ ...prev, study_category: event.target.value }))}
                        >
                            <option value="">Select Study Category</option>
                            <option value="Journal">Journal</option>
                            <option value="Research Paper">Research Paper</option>
                            <option value="Case Study">Case Study</option>
                            <option value="Other">Other</option>
                        </Form.Select>
                    </Form.Group>
                        <br/>
                    <Form.Group controlId="formPublishType">
                        <Form.Label>Publish Type</Form.Label>
                        <Form.Select
                            aria-label="Select Publish Type"
                            value={selectedPortfolio?.publish_type || ''}
                            onChange={(event) => setSelectedPortfolio(prev => ({ ...prev, publish_type: event.target.value }))}
                        >
                            <option value="">Select Publish Type</option>
                            <option value="Local">Local</option>
                            <option value="International">International</option>
                        </Form.Select>
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
                        {!validation.study && (
                            <p style={{color:'red', fontStyle:'italic'}}>Please select files</p>
                        )}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleEditClose}>Close</Button>
                <Button variant="dark" onClick={() => editPortfolio(selectedPortfolio)}>Submit</Button>
            </Modal.Footer>
        </Modal>
        {/* Delete */}
        <Modal show={deleteShow} onHide={handleDeleteClose}>
            <div style={{ background: "#404041", color: "#f5f5f5", borderRadius: "8px 8px 0px 0px"}} data-bs-theme="dark" className='bg-dark p-2'>
            <Modal.Header closeButton>
                <Modal.Title>Are you sure?</Modal.Title>
            </Modal.Header>
            </div>
            <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleDeleteClose}>No</Button>
                <Button variant="danger" onClick={deletePortfolio}>Yes</Button>
            </Modal.Footer>
        </Modal>
        <div className="table-container" style={{ marginTop: '4.5rem' }}>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {TABLE_HEADERS.map((header) => (
                            <th key={header}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        Array(5).fill().map((_, index) => (
                            <tr key={index}>
                                {TABLE_HEADERS.map((_, colIndex) => (
                                    <td key={colIndex}>
                                        <Skeleton height={20} />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        portfolios.map((portfolio, index) => (
                            <tr key={portfolio.id || portfolio.tempId}>
                                <td>{index + 1}</td>
                                <td>{portfolio.study_name}</td>
                                <td style={{ textAlign: 'center' }}>
                                    {/* Check if 'portfolio.study' is a valid JSON string and not null/undefined */}
                                    {portfolio.study ? (
                                        JSON.parse(portfolio.study).map((url, urlIndex) => (
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
                                <td>{portfolio.study_category}</td>
                                <td>{portfolio.publish_type}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <span className='link' onClick={() => handleEditShow(portfolio)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.5721 14.7789L16.5722 13.779C16.7284 13.6228 17.0003 13.7322 17.0003 13.9571V18.5002C17.0003 19.3282 16.3284 20 15.5003 20H4.50003C3.67189 20 3 19.3282 3 18.5002V7.50183C3 6.67383 3.67189 6.00205 4.50003 6.00205H13.0471C13.269 6.00205 13.3815 6.27076 13.2252 6.43011L12.2252 7.42997C12.1783 7.47683 12.1158 7.50183 12.0471 7.50183H4.50003V18.5002H15.5003V14.9539C15.5003 14.8882 15.5253 14.8258 15.5721 14.7789ZM20.466 8.47356L12.2596 16.6786L9.43451 16.9911C8.61575 17.0817 7.91886 16.3912 8.00948 15.5663L8.32199 12.7417L16.5284 4.53664C17.2441 3.82112 18.4003 3.82112 19.1128 4.53664L20.4629 5.88644C21.1785 6.60196 21.1785 7.76117 20.466 8.47356ZM17.3784 9.43905L15.5628 7.62369L9.7564 13.4322L9.52827 15.4725L11.5689 15.2444L17.3784 9.43905ZM19.4035 6.94879L18.0535 5.59898C17.9253 5.47088 17.7159 5.47088 17.5909 5.59898L16.6253 6.56447L18.441 8.37983L19.4066 7.41434C19.5316 7.28311 19.5316 7.07689 19.4035 6.94879Z" fill="#404041"/>
                                    </svg>
                                    <label class="link-label">Edit</label>
                                    </span>
                                    <span className='link' onClick={() => handleDeleteShow(portfolio)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.4874 11.9998L16.8537 8.63358C17.0484 8.4389 17.0484 8.12296 16.8537 7.92796L16.0715 7.14577C15.8768 6.95108 15.5608 6.95108 15.3658 7.14577L11.9998 10.5123L8.63354 7.14608C8.43885 6.9514 8.12291 6.9514 7.92791 7.14608L7.14602 7.92796C6.95133 8.12265 6.95133 8.43858 7.14602 8.63358L10.5123 11.9998L7.14602 15.3661C6.95133 15.5608 6.95133 15.8767 7.14602 16.0717L7.92822 16.8539C8.12291 17.0486 8.43885 17.0486 8.63385 16.8539L11.9998 13.4873L15.3661 16.8536C15.5608 17.0483 15.8768 17.0483 16.0718 16.8536L16.854 16.0714C17.0487 15.8767 17.0487 15.5608 16.854 15.3658L13.4874 11.9998Z" fill="red"/>
                                    </svg>
                                    <label class="link-label">Delete</label>
                                    </span>
                                    {/* <span className="link" onClick={() => handleEditShow(portfolio)}>Edit</span> */}
                                    {/* <span className="link" onClick={() => handleDeleteShow(portfolio)}> Delete</span> */}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
      </>
    );
}

export default ScholarPortfolio;
