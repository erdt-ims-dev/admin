import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import Breadcrumbs from "../generic/breadcrumb";
import "./style.scss";

const TABLE_HEADERS = ["Name", "Program", "Year level", "Actions"];

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

const ScholarList = () => {
  const [scholars, setScholars] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const response = await mockGetRequest();

      if (response.status !== 200) {
        console.error(
          response.status,
          "There was some error fetching the data."
        );
        return;
      }

      setScholars(response.data);
    };

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
            {scholars.map(({ id, name, program, yearLevel }) => (
              <tr key={id}>
                <td>{name}</td>
                <td>{program}</td>
                <td>{yearLevel}</td>
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
