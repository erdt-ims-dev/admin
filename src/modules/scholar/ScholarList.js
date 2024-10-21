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
            // Manually match each scholar with their account details
            const updatedScholars = response.data.map(scholar => {
              // Find the matching account details by user_id
              const account = accountResponse.data.find(acc => acc.id === scholar.id);
              return {...scholar, account_details: account? account : null }; // Include account details if found, otherwise null
            });
  
            setScholars(updatedScholars); // Update the state with scholars including their account details
            // console.log("updated scholar: ", updatedScholars); // Log the updated scholars data
          } else {
            console.log('Error retrieving account details');
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
  
   const handleDeleteCancel = async () => { setShowConfirm(false); }
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
     handleDeleteCancel,
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
      {/* <div className="header-container">
        <Breadcrumbs header="List of Scholars" subheader="1st sem 2023" />
      </div> */}
      <div class="contentHeader">
        <div class="contentLabel">
          <h4>List of Scholars</h4>
          <p>1st sem 2023</p>
        </div>
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
              pathname: `scholars/${selectedScholar?.user_id}/scholar_portfolio`,
              state: { scholar: selectedScholar }
            }}
          >
            <Button variant="primary" onClick={() => handleShow()}>Scholar portfolio</Button>
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
              pathname: `scholars/${selectedScholar?.user_id}/scholar_leave_applications`,
              state: { scholar: selectedScholar }
            }}
          >
            <Button variant="primary" onClick={() => handleShow()}>Leave Application</Button>
          </Link>
          <Link
            to={{
              pathname: `scholars/${selectedScholar?.user_id}/scholar_details`,
              state: { scholar: selectedScholar }
            }}
          >
            <Button variant="primary" onClick={() => handleShow()}>Scholar Details</Button>
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
            {scholars.map((scholar, index) => (
                <tr key={scholar.id}>
                  <td>{index+1}</td>
                  <td>{scholar.id}</td>
                  <td>{scholar.account_details?.last_name}</td>
                  <td>{scholar.account_details?.first_name}</td>
                  <td>{scholar.account_details?.program}</td>
                  <td style={{ textAlign: "center" }}>
                    <span className='link' onClick={() => handleShow(scholar)}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.8898 19.0493L15.8588 15.0182C15.7869 14.9463 15.6932 14.9088 15.5932 14.9088H15.2713C16.3431 13.7495 16.9994 12.2027 16.9994 10.4997C16.9994 6.90923 14.0901 4 10.4997 4C6.90923 4 4 6.90923 4 10.4997C4 14.0901 6.90923 16.9994 10.4997 16.9994C12.2027 16.9994 13.7495 16.3431 14.9088 15.2744V15.5932C14.9088 15.6932 14.9495 15.7869 15.0182 15.8588L19.0493 19.8898C19.1961 20.0367 19.4336 20.0367 19.5805 19.8898L19.8898 19.5805C20.0367 19.4336 20.0367 19.1961 19.8898 19.0493ZM10.4997 15.9994C7.45921 15.9994 4.99995 13.5402 4.99995 10.4997C4.99995 7.45921 7.45921 4.99995 10.4997 4.99995C13.5402 4.99995 15.9994 7.45921 15.9994 10.4997C15.9994 13.5402 13.5402 15.9994 10.4997 15.9994Z" fill="#404041"/>
                      </svg>
                      <label class="link-label">View</label>
                    </span>
                    <span className='link' onClick={() => handleDeleteShow(scholar.id)}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.4874 11.9998L16.8537 8.63358C17.0484 8.4389 17.0484 8.12296 16.8537 7.92796L16.0715 7.14577C15.8768 6.95108 15.5608 6.95108 15.3658 7.14577L11.9998 10.5123L8.63354 7.14608C8.43885 6.9514 8.12291 6.9514 7.92791 7.14608L7.14602 7.92796C6.95133 8.12265 6.95133 8.43858 7.14602 8.63358L10.5123 11.9998L7.14602 15.3661C6.95133 15.5608 6.95133 15.8767 7.14602 16.0717L7.92822 16.8539C8.12291 17.0486 8.43885 17.0486 8.63385 16.8539L11.9998 13.4873L15.3661 16.8536C15.5608 17.0483 15.8768 17.0483 16.0718 16.8536L16.854 16.0714C17.0487 15.8767 17.0487 15.5608 16.854 15.3658L13.4874 11.9998Z" fill="red"/>
                      </svg>
                      <label class="link-label">Delete</label>
                    </span>
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