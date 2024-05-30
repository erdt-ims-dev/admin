import { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom';
import API from 'services/Api'
import { Table, Button, Modal, Form } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';

import "./style.scss";
const TABLE_HEADERS = ["#", "Study Name", "Study", "Study Category", "Publish Type",  "Action"];
function ScholarPortfolio() {
    const location = useLocation();
    const scholar = location.state.scholar;
    //to display table
    const [portfolios, setPortfolios] = useState([]);

    //initialize for new portfolio
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

    // create refs for file elements
    const studyFile = useRef(null);
    //create modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //edit modal
    const [selectedPortfolio, setSelectedPortfolio] = useState(null);
    const [editShow, setEditShow] = useState(false);

    const handleEditShow = (portfolio) => {
      setSelectedPortfolio(portfolio);
      console.log(portfolio);
      setEditShow(true);
    }
    const handleEditClose = () => setEditShow(false);
    
    //delete confimation modal
    const [deleteShow, setDeleteShow] = useState(false);
    const handleDeleteShow = (portfolio) => {
      setSelectedPortfolio(portfolio);
      //console.log(portfolio);
      setDeleteShow(true);
    }
    const handleDeleteClose = () => setDeleteShow(false);

    //bind input to newPortfolios
    const handleInputChange = (fieldName, event) => {
      setNewPortfolios(prevState => ({
          ...prevState,
          [fieldName]: event.target.value
      }));
    };
    //separate bind for files
    const handleFileChange = (fieldName, event) => {
      const file = event.target.files[0];
      setNewPortfolios((prevState) => ({
      ...prevState,
        [fieldName]: file,
      }));
      // Also update selectedPortfolio.study if editing
      if (selectedPortfolio) {
        setSelectedPortfolio({...selectedPortfolio, [fieldName]: file });
      }
    };

    //fetch
    const fetchPortfolio = async () => {
      API.request('scholar_portfolio/retrieveMultipleByParameter', { col: 'scholar_id', value: newPortfolios.id }, response => {
        if (response && response.data) {
          setPortfolios(response.data)
        } else {
          console.log('error on retrieve');
        }
      }, error => {
        console.log(error);
      });
    }

    const formValidation = async () => {
      let formIsValid = true;

      Object.entries(newPortfolios).forEach(([key, value]) => {
        if (!value) {
          setValidation(prevState => ({
            ...prevState,
            [key]: false
          }));
          formIsValid = false;
          console.log("please fill all fields");
        }
      });
      return (formIsValid) ? true : false;
    }

    //set newPortfolios to API
    const createNewPortfolio = async (e) => {
      e.preventDefault();

      let validated = formValidation();
      if (validated)
        {
          const formData = new FormData();
          //console.log(newPortfolios)
          formData.append('scholar_id', newPortfolios.id);
          formData.append('study_name', newPortfolios.study_name);
          formData.append('study', studyFile.current.files[0]);
          formData.append('study_category', newPortfolios.study_category);
          formData.append('publish_type', newPortfolios.publish_type);
          //console.log(newPortfolios);
          API.uploadFile('scholar_portfolio/create', formData, response => {
            if (!response.data.error) {
              console.log('Data created successfully', response.data);
              const newPortfolio = {...response.data, tempId: uuidv4() };
              setPortfolios(prevTasks => [...prevTasks, newPortfolio]);
              fetchPortfolio();
              setShow(false);
            } else {
              console.log('error on retrieve');
            }
          }, error => {
            console.log(error);
          })
        }
        else
        {
          console.log('not valid');
          setShow(true); // Ensure the modal stays open
        }
    };

    //edit specific portfolios
    const editPortfolio = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      console.log(selectedPortfolio);
      formData.append('id', selectedPortfolio.id);
      formData.append('scholar_id', newPortfolios.id);
      formData.append('study_name', selectedPortfolio.study_name);
      formData.append('study', selectedPortfolio.study ? selectedPortfolio.study : studyFile.current.files[0]); 
      //formData.append('study', studyFile.current.files[0]); 
      formData.append('study_category', selectedPortfolio.study_category);
      formData.append('publish_type', selectedPortfolio.publish_type);
      console.log(studyFile.current.files[0]);
      API.uploadFile('scholar_portfolio/updateOne', formData, response => {
        if (!response.data.error) {
          console.log('Data updated successfully', response.data);
          fetchPortfolio();
        } else {
          console.log('error on retrieve');
        }
      }, error => {
        console.log(error)
      })
      console.log(selectedPortfolio);
      setEditShow(false);
    };

    //delete
    const deletePortfolio = async (e) => {
      e.preventDefault();
      console.log(setSelectedPortfolio.id)
      API.request('scholar_portfolio/delete', {
        id: selectedPortfolio.id,
      }, response => {
        console.log('Data deleted successfully');
      }, error => {
        console.log(error)
      })
      //console.log(selectedPortfolio);
      //to see the changes in the table after and close the modal
      setPortfolios(portfolios.filter(portfolios => portfolios.id !== selectedPortfolio.id));
      setDeleteShow(false);
    };

    //console.log(portfolios);
    useEffect(() => {
      fetchPortfolio();
    }, []);

    //console.log(portfolios);

    return (
      <>
      <div style={{ float:'left', textAlign:'left'}}>
        <h3>welcome {scholar.account_details.last_name} {scholar.account_details.first_name}</h3>
        <p>This is the Scholar Portfolio page</p>
      </div>
      <div style={{float:'right', marginTop:'1rem'}}>
        <Button onClick={handleShow}> Add New Study </Button>
      </div>
      {/* <table>
        <thead>
          <tr>
            <th>#</th>
            <th>id</th>
            <th>study</th>
            <th>study_name</th>
            <th>study_category</th>
            <th>publish_type</th>
          </tr>
        </thead>
        <tbody>
        {Object.values(portfolios).map((portfolio, index) => (
          <tr key={portfolio.id}>
            <td>{index+1}</td>
            <td>{portfolio.scholar_id}</td>
            <td>{portfolio.study}</td>
            <td>{portfolio.study_name}</td>
            <td>{portfolio.study_category}</td>
            <td>{portfolio.publish_type}</td>
          </tr>
        ))}
        </tbody>
      </table> */}
      {/* for new portfolios */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Study</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Group controlId="formStudyName">
              <Form.Label>Study Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Study Name" onChange={(event) => handleInputChange('study_name', event)} />
              {<p style={{color:'red', fontStyle:'italic'}}>{ validation.study_name === false ? 'enter study' : ''}</p>}
          </Form.Group>
          <Form.Group controlId="formStudy">
              <Form.Label>Study</Form.Label>
              <Form.Control type="file" placeholder="Enter Study" onChange={(event) => handleInputChange('study', event)} ref={studyFile} />
              {<p style={{color:'red', fontStyle:'italic'}}>{ validation.study === false ? 'enter file' : ''}</p>}
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
              {<p style={{color:'red', fontStyle:'italic'}}>{ validation.study_category === false ? 'enter category' : ''}</p>}   
          </Form.Group>
          <br/>
          <Form.Group controlId="formPublishType">
              <Form.Label>Publish Type</Form.Label>
              {/* <Form.Control type="text" placeholder="Enter Study Type" onChange={(event) => handleInputChange('publish_type', event)} /> */}
              <Form.Select aria-label="Select Publish Type" value={newPortfolios.publish_type} onChange={(event) => handleInputChange('publish_type', event)}>
                <option value="">Select Publish Type</option>
                <option value="Local">Local</option>
                <option value="International">International</option>
              </Form.Select>
              {<p style={{color:'red', fontStyle:'italic'}}>{ validation.publish_type === false ? 'enter category' : ''}</p>}   
          </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={createNewPortfolio}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* to edit portfolios */}
      <Modal show={editShow} onHide={handleEditClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit New Study</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Group controlId="formStudyName">
              <Form.Label>Study Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Study Name" 
                            onChange={(event) => {
                              // Extract the new value from the event
                              const newValue = event.target.value;
                              // Update the selectedPortfolio state with the new approval_status
                              setSelectedPortfolio(prevTask => ({...prevTask, study_name: newValue }));
                            }} 
                            value={selectedPortfolio?.study_name} 
                          />
          </Form.Group>
          <Form.Group controlId="formStudy">
              <Form.Label>Study</Form.Label>
              <Form.Control type="file" placeholder="Enter first name" onChange={(event) => handleFileChange('study', event)}  ref={studyFile}/>
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Study Category</Form.Label>
              <Form.Select 
                    aria-label="Select Study Category" 
                    value={selectedPortfolio?.study_category} 
                    onChange={(event) => {
                              // Extract the new value from the event
                              const newValue = event.target.value;
                              // Update the selectedPortfolio state with the new study_category
                              setSelectedPortfolio(prevTask => ({...prevTask, study_category: newValue }));
                            }} 
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
                    aria-label="Select Study Category" 
                    value={selectedPortfolio?.publish_type} 
                    onChange={(event) => {
                              // Extract the new value from the event
                              const newValue = event.target.value;
                              // Update the selectedPortfolio state with the new publish_type
                              setSelectedPortfolio(prevTask => ({...prevTask, publish_type: newValue }));
                            }} 
                        >
                    <option value="">Select Study Category</option>
                    <option value="Local">Local</option>
                    <option value="International">International</option>
              </Form.Select>      
          </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditClose}>
            Close
          </Button>
          <Button variant="primary" onClick={editPortfolio}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      
       {/* to delete confirmation portfolios */}
      <Modal show={deleteShow} onHide={handleDeleteClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            No
          </Button>
          <Button variant="primary" onClick={deletePortfolio}>
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
            {portfolios.map((portfolio, index) => (
                <tr key={portfolio.id || portfolio.tempId}>
                  <td>{index+1}</td>
                  {/* <td>{portfolio.scholar_id}</td> */}
                  <td>{portfolio.study_name}</td>
                  {/* <td>{portfolio.study_category}</td> */}
                  <td> <a href={portfolio.study} target="_blank" rel="noreferrer noopener"> View link</a></td>
                  <td>{portfolio.study_category}</td>
                  <td>{portfolio.publish_type} </td>
                  <td>
                    <span className='link' onClick={() => handleEditShow(portfolio)} >Edit</span>
                    <span className='link' onClick={() => handleDeleteShow(portfolio)}> Delete</span>
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