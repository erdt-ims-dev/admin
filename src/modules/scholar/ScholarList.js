import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import Breadcrumbs from "../generic/breadcrumb";
import "./style.scss";
import API from 'services/Api'

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

const ScholarList = () => {
  const [scholars, setScholars] = useState([]);
  const history = useHistory();

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
            {scholars.map(({ id, user_id, account_details }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{user_id}</td>
                <td>{account_details.last_name}</td>
                <td>{account_details.first_name}</td>
                <td>{account_details.program}</td>
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
