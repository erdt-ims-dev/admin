import { useEffect, useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { Link, useParams , useHistory  } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import Breadcrumbs from "../generic/breadcrumb";
import "./style.scss";
import API from 'services/Api'
import ViewModal from '../accounts/editModal/index'


const TABLE_HEADERS = ["#", "Scholar ID", "Last Name", "First Name", "Program", "Actions"];

const sampleApiResponse = {
  status: 200,
  data: [
    {
      id: "test_id_0",
      name: "Edward Rose",
      program: "MS-ME",
      yearLevel: "3rd",
    },
    {
      id: "test_id_1",
      name: "Lorenzo Scott",
      program: "MS-ME",
      yearLevel: "3rd",
    },
    {
      id: "test_id_2",
      name: "Kylie Bradley",
      program: "MS-CE",
      yearLevel: "4th",
    },
    {
      id: "test_id_3",
      name: "John Doe",
      program: "MS-ME",
      yearLevel: "2nd",
    },
  ],
};

// Mock API call
const mockGetRequest = async () =>
  new Promise((resolve) => {
    setTimeout(() => resolve(sampleApiResponse), 250);
  });

const fetchData = async () =>
{
  API.request('user/retrieveAll', {
    
  }, response => {
    if (response && response.data) {
      this.setState({
          account_list: response.data
      })
    }else{
      console.log('error on retrieve')
    }
  }, error => {
    console.log(error)
  })
}

const useScholarList = () => {
  const [scholars, setScholars] = useState([]);
  const [selectedScholarId, setSelectedScholarId] = useState(null);
  const [selectedScholar, setSelectedScholar] = useState(null);

  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
 
  const fetchScholars = async () => {
    API.request('scholar/retrieveAll', {}, response => {
      if (response && response.data) {
        // Make the second API call to retrieve account details
        API.request('account_details/retrieveAll', {}, accountResponse => {
          if (accountResponse && accountResponse.data) {
            // Merge the account details with the scholars data
            const updatedScholars = response.data.map(scholar => {
              const account = accountResponse.data.find(acc => acc.user_id === scholar.user_id);
              return { ...scholar, account_details: account };
            });
            setScholars(updatedScholars);
          } else {
            console.log('error on retrieving account details');
          }
        }, error => {
          console.log(error);
        });
      } else {
        console.log('error on retrieve');
      }
    }, error => {
      console.log(error);
    });
  }

  useEffect(() => {
     fetchScholars();
  }, []);
 
  const handleShow = (scholar) => {
     setSelectedScholar(scholar);
     setShow(true);
  };
 
  const handleClose = () => setShow(false);
 
  const handleDeleteShow = (id) => {
    setSelectedScholarId(id);
    setShowConfirm(true);
  };
 
  const handleDeleteConfirm = async () => {
    API.request('scholar/delete', {
      id: selectedScholarId,
    }, error => {
      console.log(error)
    });
    //to see the changes in the table after and close the modal
    setScholars(scholars.filter(scholar => scholar.id !== selectedScholarId));
    setShowConfirm(false);
   };
 
  return {
     scholars,
     show,
     selectedScholar,
     showConfirm,
     selectedScholarId,
     handleShow,
     handleClose,
     handleDeleteShow,
     handleDeleteConfirm,
     //handleDeleteCancel,
  };
 };
 
 const ScholarList = () => {
  const {
     scholars,
     show,
     selectedScholar,
     showConfirm,
     selectedScholarId,
     handleShow,
     handleClose,
     handleDeleteShow,
     handleDeleteConfirm,
     handleDeleteCancel,
  } = useScholarList();
 
  return (
    <>
      <div className="header-container">
        <Breadcrumbs header="List of Scholars" subheader="1st sem 2023" />
      </div>
      <Modal show={showConfirm} onHide={handleDeleteCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            No
          </Button>
          <Button variant="primary" onClick={handleDeleteConfirm}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Scholar Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedScholar && (
            <>
              <p>ID: {selectedScholar.id}</p>
              <p>User ID: {selectedScholar.user_id}</p>
              <p>Last Name: {selectedScholar.account_details?.last_name}</p>
              <p>First Name: {selectedScholar.account_details?.first_name}</p>
              <p>Program: {selectedScholar.account_details?.program}</p>
            </>
          )}
          
          <Link
            to={{
              pathname: `scholars/${selectedScholar?.user_id}/scholar_details`,
              state: { scholar: selectedScholar }
            }}
          >
            <Button variant="primary" onClick={() => handleShow()}>Scholar Details</Button>
          </Link>
          <Link
            to={{
              pathname: `scholars/${selectedScholar?.user_id}/scholar_portfolio`,
              state: { scholar: selectedScholar }
            }}
          >
            <Button variant="primary" onClick={() => handleShow()}>View portfolio</Button>
          </Link>
          <Link
            to={{
              pathname: `scholars/${selectedScholar?.user_id}/scholar_tasks`,
              state: { scholar: selectedScholar }
            }}
          >
            <Button variant="primary" onClick={() => handleShow()}>Scholar Tasks</Button>
          </Link>
          <Link
            to={{
              pathname: `scholars/${selectedScholar?.user_id}/scholar_requests`,
              state: { scholar: selectedScholar }
            }}
          >
            <Button variant="primary" onClick={() => handleShow()}>Scholar Requests</Button>
          </Link>
          <Link
            to={{
              pathname: `scholars/${selectedScholar?.user_id}/scholar_leave_applications`,
              state: { scholar: selectedScholar }
            }}
          >
            <Button variant="primary" onClick={() => handleShow()}>Leave Application</Button>
          </Link>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
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
            {scholars.map((scholar) => (
                <tr key={scholar.id}>
                  <td>{scholar.id}</td>
                  <td>{scholar.user_id}</td>
                  <td>{scholar.account_details?.last_name}</td>
                  <td>{scholar.account_details?.first_name}</td>
                  <td>{scholar.account_details?.program}</td>
                  <td>
                    <span className='link' onClick={() => handleShow(scholar)}><a href="#">View</a></span>
                    <span className='link' onClick={() => handleDeleteShow(scholar.id)}><a href="#">  Delete</a></span>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default ScholarList;