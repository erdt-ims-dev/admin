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
    const handleClose = () => setShow(false);
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
        const files = Array.from(event.target.files);
    
        if (files.length > 5) {
            toast.error('You can only upload up to 5 files.');
            setSelectedFiles([]);
            return;
        }
    
        // Check if all files are PDFs
        const validFiles = files.filter(file => file.type === 'application/pdf');
        if (validFiles.length !== files.length) {
            toast.error('Only PDF files are allowed!');
            setSelectedFiles([]);
            return;
        }
    
        setSelectedFiles(validFiles); // Store valid files
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
            toast.error('Error retrieving portfolios');
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
            API.uploadFile('scholar_portfolio/create', formData, response => {
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
  
      // Handle file update: use `selectedPortfolio.study` or `studyFile` if a new file is uploaded
      formData.append('study', selectedPortfolio.study ? selectedPortfolio.study : studyFile.current.files[0]);
  
      formData.append('study_category', selectedPortfolio.study_category);
      formData.append('publish_type', selectedPortfolio.publish_type);
  
      API.uploadFile('scholar_portfolio/updateOne', formData, 
          (response) => {
              if (!response.data.error) {
                  toast.success('Portfolio updated successfully');
                  fetchPortfolio(); // Refresh portfolio list
              } else {
                  toast.error('Error updating portfolio');
              }
              setIsLoading(false); // End loading
              setIsLoadingV2(false);

              setEditShow(false);  // Close edit modal
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

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            if (acceptedFiles.length + selectedFiles.length <= 5) {
                setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
            } else {
                toast.error('You can only upload up to 5 files!');
            }
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: '.pdf' });

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
            <Modal.Header closeButton>
                <Modal.Title>Add New Study</Modal.Title>
            </Modal.Header>
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
                    <Form.Group controlId="formStudy">
                        <Form.Label>Files</Form.Label>
                        {/* <input
                            type="file"
                            multiple
                            onChange={handleFileChange} // Updated handler
                            accept="application/pdf"
                        /> */}
                        <div {...getRootProps()} className="dropzone">
                            <input {...getInputProps()} onChange={handleFileChange} />
                            {isDragActive ? (
                                <p>Drop the files here...</p>
                            ) : (
                                <p>Drag and drop files here, or click to select them</p>
                            )}
                        </div>
                        {selectedFiles && selectedFiles.length > 0 && (
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
                <Button variant="primary" onClick={createNewPortfolio}>Submit</Button>
            </Modal.Footer>
        </Modal>
        {/* Edit */}
        <Modal show={editShow} onHide={handleEditClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit New Study</Modal.Title>
            </Modal.Header>
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
                    <Form.Group controlId="formStudy">
                        <Form.Label>Study</Form.Label>
                        <Form.Control 
                            type="file" 
                            onChange={(event) => handleFileChange('study', event)} 
                            ref={studyFile} 
                        />
                    </Form.Group>
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
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleEditClose}>Close</Button>
                <Button variant="primary" onClick={() => editPortfolio(selectedPortfolio)}>Submit</Button>
            </Modal.Footer>
        </Modal>
        {/* Delete */}
        <Modal show={deleteShow} onHide={handleDeleteClose}>
            <Modal.Header closeButton>
                <Modal.Title>Are you sure?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleDeleteClose}>No</Button>
                <Button variant="primary" onClick={deletePortfolio}>Yes</Button>
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
                                <td>
                                    {/* Parse the 'study' JSON string and loop through the URLs */}
                                    {JSON.parse(portfolio.study).map((url, urlIndex) => (
                                        <div key={urlIndex}>
                                            <a href={url} target="_blank" rel="noreferrer noopener">View link {urlIndex + 1}</a>
                                        </div>
                                    ))}
                                </td>
                                <td>{portfolio.study_category}</td>
                                <td>{portfolio.publish_type}</td>
                                <td>
                                    <span className="link" onClick={() => handleEditShow(portfolio)}>Edit</span>
                                    <span className="link" onClick={() => handleDeleteShow(portfolio)}> Delete</span>
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
