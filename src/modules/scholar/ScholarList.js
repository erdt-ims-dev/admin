import { useEffect, useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import Breadcrumbs from "../generic/breadcrumb";
import "./style.scss";
import API from 'services/Api';
import ViewModal from '../accounts/editModal/index';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton

const TABLE_HEADERS = ["#", "Scholar ID", "Last Name", "First Name", "Program", "Actions"];

const useScholarList = () => {
  const [scholars, setScholars] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedScholarId, setSelectedScholarId] = useState(null);
  const [selectedScholar, setSelectedScholar] = useState(null);
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
 
  const fetchScholars = async () => {
    setLoading(true); // Set loading to true when fetching data
    try {
      API.request('scholar/retrieveAll', {}, response => {
        if (response && response.data) {
          API.request('account_details/retrieveAll', {}, accountResponse => {
            if (accountResponse && accountResponse.data) {
              const updatedScholars = response.data.map(scholar => {
                const account = accountResponse.data.find(acc => acc.id === scholar.id);
                return { ...scholar, account_details: account ? account : null };
              });
              setScholars(updatedScholars);
            } else {
              console.log('Error retrieving account details');
            }
            setLoading(false); // Set loading to false after account details fetch
          }, error => {
            console.log('Error retrieving account details:', error);
            setLoading(false); // Set loading to false if there's an error
          });
        } else {
          console.log('Error on scholar retrieve');
          setLoading(false); // Set loading to false if there's an error
        }
      }, error => {
        console.log('Error on scholar retrieve:', error);
        setLoading(false); // Set loading to false if there's an error
      });
    } catch (error) {
      console.log(error);
      setLoading(false); // Ensure loading is set to false on catch
    }
  };

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
      console.log('Error deleting scholar:', error);
    });
    setScholars(scholars.filter(scholar => scholar.id !== selectedScholarId));
    setShowConfirm(false);
  };
  
  const handleDeleteCancel = () => { setShowConfirm(false); }

  return {
    scholars,
    loading, // Return loading state
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
    loading, // Destructure loading state
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
      <div className="contentHeader">
        <div className="contentLabel">
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
          
          <Link to={{ pathname: `scholars/${selectedScholar?.user_id}/scholar_portfolio`, state: { scholar: selectedScholar } }}>
            <Button variant="primary">Scholar Portfolio</Button>
          </Link>
          <Link to={{ pathname: `scholars/${selectedScholar?.user_id}/scholar_tasks`, state: { scholar: selectedScholar } }}>
            <Button variant="primary">Scholar Tasks</Button>
          </Link>
          <Link to={{ pathname: `scholars/${selectedScholar?.user_id}/scholar_leave_applications`, state: { scholar: selectedScholar } }}>
            <Button variant="primary">Leave Application</Button>
          </Link>
          <Link to={{ pathname: `scholars/${selectedScholar?.user_id}/scholar_details`, state: { scholar: selectedScholar } }}>
            <Button variant="primary">Scholar Details</Button>
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
            {loading ? (
              // Render skeletons while loading
              [...Array(4)].map((_, index) => (
                <tr key={index}>
                  <td><Skeleton width={30} /></td>
                  <td><Skeleton width={100} /></td>
                  <td><Skeleton width={100} /></td>
                  <td><Skeleton width={100} /></td>
                  <td><Skeleton width={100} /></td>
                  <td><Skeleton width={100} /></td>
                </tr>
              ))
            ) : (
              scholars.map((scholar, index) => (
                <tr key={scholar.id}>
                  <td>{index + 1}</td>
                  <td>{scholar.id}</td>
                  <td>{scholar.account_details?.last_name}</td>
                  <td>{scholar.account_details?.first_name}</td>
                  <td>{scholar.account_details?.program}</td>
                  <td style={{ textAlign: "center" }}>
                    <span className='link' onClick={() => handleShow(scholar)}>
                      <FontAwesomeIcon icon={faEye} />
                      <label className="link-label">View</label>
                    </span>
                    <span className='link' onClick={() => handleDeleteShow(scholar.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                      <label className="link-label">Delete</label>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default ScholarList;
