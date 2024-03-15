import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import Breadcrumbs from "../generic/breadcrumb";
import "./style.scss";
import API from 'services/Api'

const TABLE_HEADERS = ["#", "Scholar ID", "Requests", "Tasks", "Portfolio", "Leave Application", "Profile"];

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

const ScholarList = () => {
  const [scholars, setScholars] = useState([]);
  const history = useHistory();

  const fetchData = async () => {
    API.request('scholar/retrieveAll', {}, response => {
      if (response && response.data) {
        setScholars(response.data);
      } else {
        console.log('error on retrieve');
      }
    }, error => {
      console.log(error);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleView = (id) => history.push("/scholars/" + id);
  const handleDelete = (id) => console.log("delete", id);

  return (
    <>
      <div className="header-container">
        <Breadcrumbs header="List of Scholars" subheader="1st sem 2023" />
      </div>

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
            {scholars.map(({ id, user_id, scholar_request_id, scholar_task_id, scholar_portfolio_id, scholar_leave_app_id }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{user_id}</td>
                <td>{scholar_request_id}</td>
                <td>{scholar_task_id}</td>
                <td>{scholar_portfolio_id}</td>
                <td>{scholar_leave_app_id}</td>
                <td>
                  <FontAwesomeIcon
                    className="icon"
                    icon={faEye}
                    size="sm"
                    onClick={() => handleView(id)}
                  />
                  <FontAwesomeIcon
                    className="icon"
                    icon={faTrash}
                    size="sm"
                    onClick={() => handleDelete(id)}
                  />
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
