import { Box } from "@mui/material";
import Breadcrumbs from "../generic/breadcrumb";
import "./style.scss";
import { Button, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const mockApplicants = [
  {
    id: "test_id_0",
    name: "Allison Smith",
    program: "MS-ME",
  },
  {
    id: "test_id_1",
    name: "Lorenzo Scott",
    program: "MS-ME",
  },
  {
    id: "test_id_2",
    name: "Edward Rose",
    program: "MS-ME",
  },
  {
    id: "test_id_3",
    name: "Kylie Bradley",
    program: "MS-ME",
  },
];

const mockGetApplicants = async () =>
  new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          status: 200,
          data: mockApplicants,
        }),
      500
    );
  });

const ApplicantList = () => {
  const [applicants, setApplicants] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const getApplicants = async () => {
      const response = await mockGetApplicants();

      if (response.status !== 200) {
        console.error(
          response.status,
          "There was some error fetching the data."
        );
        return;
      }

      setApplicants(response.data);
    };

    getApplicants();
  }, []);

  const handleView = (id) => history.push("/applicants/" + id);

  return (
    <div className="container">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Breadcrumbs header="List of Applicants" />
        <Button onClick={() => history.push("/applicants/add")}>
          Add new applicant
        </Button>
      </Box>

      <div className="table-container">
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Program</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map(({ id, name, program }) => (
              <tr key={id}>
                <td>{name}</td>
                <td>{program}</td>
                <td>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                      justifyContent: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      className="icon"
                      icon={faThumbsUp}
                      size="sm"
                    />
                    <FontAwesomeIcon
                      className="icon"
                      icon={faEye}
                      size="sm"
                      onClick={() => handleView(id)}
                    />
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ApplicantList;
