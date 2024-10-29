import { useEffect, useState } from "react";
import { Table, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import Skeleton from 'react-loading-skeleton';
import Dropdown from "react-dropdown-select";
import Breadcrumbs from "../generic/breadcrumb";
import "./style.scss";
import API from 'services/Api';

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
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-based
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

  const fetchScholars = async (semester, year) => {
    setLoading(true);
    try {
      API.request('scholar/filter', { semester, year }, response => {
        if (response && response.data) {
          API.request('account_details/retrieveAll', {}, accountResponse => {
            if (accountResponse && accountResponse.data) {
              const updatedScholars = response.data.map(scholar => {
                const account = accountResponse.data.find(acc => acc.id === scholar.id);
                return { ...scholar, account_details: account ? account : null };
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
            {loading ? (
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
                    <span className='link'>
                      <FontAwesomeIcon icon={faEye} />
                      <label className="link-label">View</label>
                    </span>
                    <span className='link'>
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
