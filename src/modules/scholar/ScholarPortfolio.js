import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import API from 'services/Api'
import { Table, Button, Modal, Form } from "react-bootstrap";

import "./style.scss";
const TABLE_HEADERS = ["#", "Study Name", "Study", "Study Category", "Publish Type", "Action"];
function ScholarPortfolio() {
    const location = useLocation();
    const scholar = location.state.scholar;
    
    //to display table
    const [portfolios, setPortfolios] = useState([]);

    //initialize for new portfolio
    const [newPortfolios, setNewPortfolios] = useState({
      study_name: '',
      study: '',
      study_category: '',
      publish_type: '',
    });
    
    //create modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //edit modal
    const [selectedPortfolio, setSelectedPortfolio] = useState(null);
    const [editShow, setEditShow] = useState(false);

    const handleEditShow = (portfolio) => {
      setSelectedPortfolio(portfolio);
      //console.log(portfolio);
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

    //fetch
    const fetchPortfolio = async () => {
      API.request('scholar_portfolio/retrieveMultipleByParameter', { col: 'scholar_id', value: scholar.user_id }, response => {
        if (response && response.data) {
          // Make the second API call to retrieve account details
          setPortfolios(response.data)
        } else {
          console.log('error on retrieve');
        }
      }, error => {
        console.log(error);
      });
    }

    //set newPortfolios to API
    const createNewPortfolio = async (e) => {
      e.preventDefault();
      //console.log(newPortfolios);
      API.request('scholar_portfolio/create', {
        scholar_id: scholar.user_id,
        study_name: newPortfolios.study_name,
        study: newPortfolios.study,
        study_category: newPortfolios.study_category,
        publish_type: newPortfolios.publish_type,
      }, response => {
        console.log('Data created successfully');
      }, error => {
        console.log(error)
      })
      setShow(false);
    };

    //edit specific portfolios
    const editPortfolio = async (e) => {
      e.preventDefault();
      API.request('scholar_portfolio/update', {
        study_name: selectedPortfolio.study_name,
        study: selectedPortfolio.study,
        study_category: selectedPortfolio.study_category,
        publish_type: selectedPortfolio.publish_type,
      }, response => {
        console.log('Data updated successfully');
      }, error => {
        console.log(error)
      })
      //console.log(selectedPortfolio);
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
      <h3>welcome {scholar.account_details.last_name} {scholar.account_details.first_name}</h3>
      <p>This is the Scholar Portfolio page</p>
      <div style={{float:'right'}}>
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
          </Form.Group>
          <Form.Group controlId="formStudy">
              <Form.Label>Study</Form.Label>
              <Form.Control type="file" placeholder="Enter first name" onChange={(event) => handleInputChange('study', event)}  />
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Study Category</Form.Label>
              <Form.Control type="text" placeholder="Enter Study Category" onChange={(event) => handleInputChange('study_category', event)} />
          </Form.Group>
          <Form.Group controlId="formPublishType">
              <Form.Label>Publish Type</Form.Label>
              <Form.Control type="text" placeholder="Enter Study Type" onChange={(event) => handleInputChange('publish_type', event)} />
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
              <Form.Control type="text" placeholder="Enter Study Name" onChange={(event) => handleInputChange('study_name', event)} value={selectedPortfolio?.study} />
          </Form.Group>
          <Form.Group controlId="formStudy">
              <Form.Label>Study</Form.Label>
              <Form.Control type="file" placeholder="Enter first name" onChange={(event) => handleInputChange('study', event)}  />
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Study Category</Form.Label>
              <Form.Control type="text" placeholder="Enter Study Category" onChange={(event) => handleInputChange('study_category', event)} value={selectedPortfolio?.study_category}/>
          </Form.Group>
          <Form.Group controlId="formPublishType">
              <Form.Label>Publish Type</Form.Label>
              <Form.Control type="text" placeholder="Enter Study Type" onChange={(event) => handleInputChange('publish_type', event)} value={selectedPortfolio?.publish_type}/>
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
      <div className="table-container">
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
                <tr key={portfolio.id}>
                  <td>{index+1}</td>
                  {/* <td>{portfolio.scholar_id}</td> */}
                  <td>{portfolio.study}</td>
                  {/* <td>{portfolio.study_category}</td> */}
                  <td> <input 
                          type="file" 
                          style={{ display: 'block', padding: 0, marginLeft: 'auto', marginRight: 'auto', marginTop: 0, marginBottom: 0, width: '200px' }} 
                          // onChange={(event) => this.handleFileChange(event, item.alias)}
                          // ref={(input) => {
                          //     this.fileInputs = { ...this.fileInputs, [item.alias]: input };
                          //  }}
                          /> </td>
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