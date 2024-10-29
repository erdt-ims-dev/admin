import React, { useEffect, useState } from "react";
import { Table, Row, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import Skeleton from 'react-loading-skeleton';
import Dropdown from "react-dropdown-select";
import Breadcrumbs from "../generic/breadcrumb";
import "./style.scss";
import API from 'services/Api';
import { Link } from 'react-router-dom';

const TABLE_HEADERS = ["#", "Scholar ID", "Last Name", "First Name", "Program", "Actions"];

const SEMESTER_OPTIONS = [
  { label: "1st semester", value: "1st semester" },
  { label: "2nd semester", value: "2nd semester" },
  { label: "Summer semester", value: "Summer semester" },
];

const YEAR_OPTIONS = [
  { label: "2023", value: "2023" },
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
];

const ScholarList = () => {
  const getDefaultSemesterAndYear = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; 
    const currentYear = currentDate.getFullYear();
    
    let semester;
    if (currentMonth >= 1 && currentMonth <= 4) semester = "1st semester";
    else if (currentMonth >= 5 && currentMonth <= 7) semester = "Summer semester";
    else semester = "2nd semester";

    return { semester, year: currentYear.toString() };
  };

  const { semester: defaultSemester, year: defaultYear } = getDefaultSemesterAndYear();
  const [scholars, setScholars] = useState([]);
  const [filteredScholars, setFilteredScholars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState(defaultSemester);
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedScholar, setSelectedScholar] = useState(null);
  const [selectedScholarId, setSelectedScholarId] = useState(null);

  const fetchScholars = async (semester, year) => {
    setLoading(true);
    try {
      API.request('scholar/filter', { semester, year }, response => {
        if (response && response.data) {
          API.request('account_details/retrieveAll', {}, accountResponse => {
            if (accountResponse && accountResponse.data) {
              const updatedScholars = response.data.map(scholar => {
                const account = accountResponse.data.find(acc => acc.id === scholar.id);
                return {...scholar, account_details: account? account : null };
              });
              setScholars(updatedScholars);
              setFilteredScholars(updatedScholars);
            }
            setLoading(false);
          });
        } else {
          console.log('Error retrieving scholars');
          setLoading(false);
        }
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholars(selectedSemester, selectedYear);
  }, [selectedSemester, selectedYear]);

  const handleSemesterChange = (selected) => {
    const semester = selected[0]?.value || "1st semester";
    setSelectedSemester(semester);
  };

  const handleYearChange = (selected) => {
    const year = selected[0]?.value || "2023";
    setSelectedYear(year);
  };

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
    setScholars(scholars.filter(scholar => scholar.id!== selectedScholarId));
    setShowConfirm(false);
  };

  const handleDeleteCancel = () => setShowConfirm(false);

  return (
    <>
      <div className="contentHeader">
        <div className="contentLabel">
          <h4>List of Scholars</h4>
          <p>Choose semester and year to filter</p>
        </div>        
      </div>
      
      <Row className="w-100 mb-4" style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ flex: "1", marginRight: "10px" }}>
          <Dropdown
            options={SEMESTER_OPTIONS}
            values={[{ label: selectedSemester, value: selectedSemester }]}
            onChange={handleSemesterChange}
            placeholder="Select Semester"
          />
        </div>
        <div style={{ flex: "1" }}>
          <Dropdown
            options={YEAR_OPTIONS}
            values={[{ label: selectedYear, value: selectedYear }]}
            onChange={handleYearChange}
            placeholder="Select Year"
          />
        </div>
      </Row>

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
            {loading? (
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
              filteredScholars.map((scholar, index) => (
                <tr key={scholar.id}>
                  <td>{index + 1}</td>
                  <td>{scholar.id}</td>
                  <td>{scholar.account_details?.last_name}</td>
                  <td>{scholar.account_details?.first_name}</td>
                  <td>{scholar.account_details?.program}</td>
                  <td style={{ textAlign: "center" }}>
                  <span className='link' onClick={() => handleShow(scholar)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.8898 19.0493L15.8588 15.0182C15.7869 14.9463 15.6932 14.9088 15.5932 14.9088H15.2713C16.3431 13.7495 16.9994 12.2027 16.9994 10.4997C16.9994 6.90923 14.0901 4 10.4997 4C6.90923 4 4 6.90923 4 10.4997C4 14.0901 6.90923 16.9994 10.4997 16.9994C12.2027 16.9994 13.7495 16.3431 14.9088 15.2744V15.5932C14.9088 15.6932 14.9495 15.7869 15.0182 15.8588L19.0493 19.8898C19.1961 20.0367 19.4336 20.0367 19.5805 19.8898L19.8898 19.5805C20.0367 19.4336 20.0367 19.1961 19.8898 19.0493ZM10.4997 15.9994C7.45921 15.9994 4.99995 13.5402 4.99995 10.4997C4.99995 7.45921 7.45921 4.99995 10.4997 4.99995C13.5402 4.99995 15.9994 7.45921 15.9994 10.4997C15.9994 13.5402 13.5402 15.9994 10.4997 15.9994Z" fill="#404041"/>
                    </svg>
                    <label className='link-label'>View</label>
                  </span>
                  <span className='link' onClick={() => handleDeleteShow(scholar.id)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.4874 11.9998L16.8537 8.63358C17.0484 8.4389 17.0484 8.12296 16.8537 7.92796L16.0715 7.14577C15.8768 6.95108 15.5608 6.95108 15.3658 7.14577L11.9998 10.5123L8.63354 7.14604C8.43884 6.95134 8.12291 6.95134 7.92721 7.14604L7.14503 7.92823C6.95033 8.12293 6.95033 8.43887 7.14503 8.63357L10.5113 11.9998L7.14503 15.366L7.92721 16.1482C8.12291 16.3429 8.43884 16.3429 8.63354 16.1482L11.9998 12.781L15.3658 16.1479C15.5605 16.3426 15.8764 16.3426 16.0711 16.1479L16.8537 15.366L13.4874 11.9998Z" fill="#404041"/>
                    </svg>
                    <label className='link-label'>Delete</label>
                  </span>
                </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
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
    </>
  );
};

export default ScholarList;
