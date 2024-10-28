import { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone'; // Import react-dropzone
import API from 'services/Api';
import { Table, Button, Modal, Form } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import Stack from '../generic/spinnerV2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./style.scss";

const TABLE_HEADERS = ["#", "Study Name", "Study", "Study Category", "Publish Type", "Action"];

function ScholarPortfolio() {
    const location = useLocation();
    const scholar = location.state.scholar;

    const [portfolios, setPortfolios] = useState([]);
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
    const [isLoading, setIsLoading] = useState(false);

    const [show, setShow] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); // New state for selected file
    const [selectedPortfolio, setSelectedPortfolio] = useState(null);
    const [editShow, setEditShow] = useState(false);
    const [deleteShow, setDeleteShow] = useState(false);

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

    const fetchPortfolio = async () => {
      API.request('scholar_portfolio/retrieveMultipleByParameter', { col: 'scholar_id', value: newPortfolios.id }, response => {
        if (response && response.data) {
          setPortfolios(response.data);
        } else {
          toast.error('Error retrieving portfolios');
        }
      }, error => {
        toast.error('Error retrieving portfolios');
      });
    };

    const formValidation = () => {
  let formIsValid = true;
  const updatedValidation = { ...validation };
  Object.entries(newPortfolios).forEach(([key, value]) => {
    if (key === 'study') {
      // Check if a file is selected
      if (!selectedFile) {
        updatedValidation.study = false;
        formIsValid = false;
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
      if (formValidation()) {
        const formData = new FormData();
        formData.append('scholar_id', newPortfolios.id);
        formData.append('study_name', newPortfolios.study_name);
        formData.append('study', selectedFile); // Use the file from drag-and-drop
        formData.append('study_category', newPortfolios.study_category);
        formData.append('publish_type', newPortfolios.publish_type);
        API.uploadFile('scholar_portfolio/create', formData, response => {
          if (!response.data.error) {
            const newPortfolio = { ...response.data, tempId: uuidv4() };
            setPortfolios(prevTasks => [...prevTasks, newPortfolio]);
            fetchPortfolio();
            setShow(false);
            toast.success('Portfolio created successfully');
          } else {
            toast.error('Error creating portfolio');
          }
          setIsLoading(false);
        }, error => {
          toast.error('Error creating portfolio');
          setIsLoading(false);
        });
      } else {
        toast.warning('Please fill in all required fields');
        setIsLoading(false);
      }
    };

    const editPortfolio = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      const formData = new FormData();
      formData.append('id', selectedPortfolio.id);
      formData.append('scholar_id', newPortfolios.id);
      formData.append('study_name', selectedPortfolio.study_name);
      formData.append('study', selectedPortfolio.study ? selectedPortfolio.study : selectedFile);
      formData.append('study_category', selectedPortfolio.study_category);
      formData.append('publish_type', selectedPortfolio.publish_type);

      API.uploadFile('scholar_portfolio/updateOne', formData, response => {
        if (!response.data.error) {
          fetchPortfolio();
          toast.success('Portfolio updated successfully');
        } else {
          toast.error('Error updating portfolio');
        }
        setIsLoading(false);
      }, error => {
        toast.error('Error updating portfolio');
        setIsLoading(false);
      });
      setEditShow(false);
    };

    const deletePortfolio = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      API.request('scholar_portfolio/delete', {
        id: selectedPortfolio.id,
      }, response => {
        setPortfolios(portfolios.filter(portfolios => portfolios.id !== selectedPortfolio.id));
        toast.success('Portfolio deleted successfully');
        setIsLoading(false);
      }, error => {
        toast.error('Error deleting portfolio');
        setIsLoading(false);
      });
      setDeleteShow(false);
    };

    useEffect(() => {
      fetchPortfolio();
    }, []);

    const onDrop = (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.type !== 'application/pdf') {
          toast.error('Only PDF files are allowed!');
          setSelectedFile(null); // Reset the selected file if it's invalid
        } else {
          setSelectedFile(file);
        }
      }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: '.pdf' });

    return (
      <>
      {isLoading && <Stack />}
      <div style={{ float:'left', textAlign:'left'}}>
        <h3>{scholar.account_details.last_name} {scholar.account_details.first_name}'s Portfolio</h3>
        <p>Below are all the files submitted</p>
      </div>
      <div style={{float:'right', marginTop:'1rem'}}>
        <Button onClick={handleShow}> Add New Study </Button>
      </div>

      {/* Modal for new portfolios */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Study</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formStudyName">
              <Form.Label>Study Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Study Name" onChange={(event) => handleInputChange('study_name', event)} />
              {!validation.study_name && <p style={{color:'red', fontStyle:'italic'}}>Enter study name</p>}
            </Form.Group>
            <Form.Group controlId="formStudyCategory">
              <Form.Label>Study Category</Form.Label>
              <Form.Select aria-label="Select Study Category" value={newPortfolios.study_category} onChange={(event) => handleInputChange('study_category', event)}>
                <option value="">Select Study Category</option>
                <option value="Journal">Journal</option>
                <option value="Research Paper">Research Paper</option>
                <option value="Case Study">Case Study</option>
                <option value="Other">Other</option>
              </Form.Select>
              {!validation.study_category && <p style={{color:'red', fontStyle:'italic'}}>Enter category</p>}
            </Form.Group>
            <Form.Group controlId="formPublishType">
              <Form.Label>Publish Type</Form.Label>
              <Form.Select aria-label="Select Publish Type" value={newPortfolios.publish_type} onChange={(event) => handleInputChange('publish_type', event)}>
                <option value="">Select Publish Type</option>
                <option value="Local">Local</option>
                <option value="International">International</option>
              </Form.Select>
              {!validation.publish_type && <p style={{color:'red', fontStyle:'italic'}}>Enter publish type</p>}
            </Form.Group>
            <Form.Group controlId="formStudy">
              <Form.Label>File</Form.Label>
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the file here...</p>
                ) : (
                  <p>Drag and drop a file here, or click to select one</p>
                )}
              </div>
              {selectedFile && <p>Selected file: {selectedFile.name}</p>}
              {!validation.study && <p style={{color:'red', fontStyle:'italic'}}>Enter file</p>}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={createNewPortfolio}>Submit</Button>
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
              {portfolios.map((portfolio, index) => (
                <tr key={portfolio.id || portfolio.tempId}>
                  <td>{index + 1}</td>
                  <td>{portfolio.study_name}</td>
                  <td>
                    <a href={portfolio.study} target="_blank" rel="noreferrer noopener"> View link</a>
                  </td>
                  <td>{portfolio.study_category}</td>
                  <td>{portfolio.publish_type}</td>
                  <td>
                    <span className="link" onClick={() => handleEditShow(portfolio)}>Edit</span>
                    <span className="link" onClick={() => handleDeleteShow(portfolio)}> Delete</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </>
    );
}

export default ScholarPortfolio;
