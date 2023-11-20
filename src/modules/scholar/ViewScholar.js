import { useParams } from "react-router-dom";
import "./style.scss";
import UserInfoCard from "../generic/UserInfoCard";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Button, Modal, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faEye,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";

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

const mockScholarData = [
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
];

const mockGetScholarDetails = async (scholarId) => {
  const scholar = mockScholarData.find(({ id }) => id === scholarId);

  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          status: 200,
          data: scholar,
        }),
      250
    );
  });
};

const mockGetApplications = async () =>
  new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          status: 200,
          data: [
            {
              id: "test_id_0",
              date_submitted: "February 23, 2023",
              dates: "February 23, 24, 25, 2023",
              status: "APPROVED",
            },
          ],
        }),
      250
    );
  });

const ViewScholar = () => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [scholar, setScholar] = useState(null);
  const [leaveApplications, setLeaveApplications] = useState(null);
  const { scholarId } = useParams();

  // Calls API on render
  useEffect(() => {
    const getScholar = async () => {
      const response = await mockGetScholarDetails(scholarId);

      if (response.status !== 200) {
        console.error("There was an error in fetching scholar details.");
        return;
      }

      setScholar(response.data);
    };

    getScholar();
  }, [scholarId]);

  // Fetches leave applications on modal open
  useEffect(() => {
    const getApplications = async () => {
      const response = await mockGetApplications();

      if (response.status !== 200) {
        console.error("There was an error in fetching applications.");
        return;
      }

      setLeaveApplications(response.data);
    };

    if (isLeaveModalOpen && leaveApplications === null) {
      getApplications();
    }
  }, [isLeaveModalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!scholar) return <>Loading...</>;

  return (
    <>
      <div className="view-scholar container">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <UserInfoCard
            name={scholar.name}
            course={scholar.program}
            yearLevel={scholar.yearLevel}
            src=""
          />

          <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Button onClick={() => setIsLeaveModalOpen(true)}>
              Leave applications
            </Button>
            <Box sx={{ display: "flex", gap: "8px" }}>
              <Button>Portfolio</Button>
              <Button>Submitted files</Button>
            </Box>
          </Box>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal
        size="lg"
        show={isLeaveModalOpen}
        onHide={() => setIsLeaveModalOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Leave applications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <thead>
              <tr>
                <th>Date submitted</th>
                <th>Inclusive dates</th>
                <th>Status</th>
                <th>Leave request</th>
              </tr>
            </thead>
            <tbody>
              {leaveApplications?.map(
                ({ date_submitted, dates, status, id }) => (
                  <tr key={id}>
                    <td>{date_submitted}</td>
                    <td>{dates}</td>
                    <td>{status}</td>
                    <td>
                      <FontAwesomeIcon
                        className="icon"
                        icon={faDownload}
                        size="sm"
                        onClick={() => {}}
                      />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ViewScholar;
