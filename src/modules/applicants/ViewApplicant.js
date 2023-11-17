import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Breadcrumbs from "../generic/breadcrumb";
import UserInfoCard from "../generic/UserInfoCard";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { faComment } from "@fortawesome/free-regular-svg-icons";

const TABLE_HEADERS = ["File", "Actions"];

const MOCK_FILES = [
  "Transcript of records",
  "Birth certificate",
  "Valid ID",
  "Narrative essay",
  "Medical certificate",
  "NBI clearance",
  "Admission notice",
  "Program study",
];

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

const mockGetApplicantDetails = async (applicantId) => {
  const applicant = mockApplicants.find(({ id }) => id === applicantId);

  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          status: 200,
          data: applicant,
        }),
      250
    );
  });
};

const ViewApplicant = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicant, setApplicant] = useState(null);
  const [approveFile, setApproveFile] = useState("Approve");
  const { applicantId } = useParams();

  // Calls API on render
  useEffect(() => {
    const getApplicant = async () => {
      const response = await mockGetApplicantDetails(applicantId);

      if (response.status !== 200) {
        console.error("There was an error in fetching scholar details.");
        return;
      }

      setApplicant(response.data);
    };

    getApplicant();
  }, [applicantId]);

  if (!applicant) return <>Loading...</>;

  return (
    <>
      <div className="view-applicant container">
        <Breadcrumbs header="View Application" />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <UserInfoCard
            name={applicant.name}
            course={applicant.program}
            src=""
          />
        </Box>

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
              {MOCK_FILES.map((file) => (
                <tr key={file}>
                  <td>{file}</td>
                  <td>
                    <FontAwesomeIcon
                      className="icon"
                      icon={faUpload}
                      size="sm"
                      onClick={() => {}}
                    />
                    <FontAwesomeIcon
                      className="icon"
                      icon={faEye}
                      size="sm"
                      onClick={() => {}}
                    />
                    <FontAwesomeIcon
                      className="icon"
                      icon={faTrash}
                      size="sm"
                      onClick={() => {}}
                    />
                    <FontAwesomeIcon
                      className="icon"
                      icon={faComment}
                      size="sm"
                      onClick={() => setIsModalOpen(true)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal size="md" show={isModalOpen} onHide={() => setIsModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Approve file?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select
            value={approveFile}
            onChange={(e) => setApproveFile(e.target.value)}
          >
            <option value="Approve">Approve</option>
            <option value="Disapprove">Disapprove</option>
          </Form.Select>
          {approveFile === "Disapprove" && (
            <Form.Group className="mt-3">
              <Form.Label>Remarks</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button type="button">Submit</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewApplicant;
