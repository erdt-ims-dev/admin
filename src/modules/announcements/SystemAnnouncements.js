import { Button, Modal, Table } from "react-bootstrap";
import Breadcrumbs from "../generic/breadcrumb";
import { Box } from "@mui/material";
import "./style.scss";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import UserInfoCard from "../generic/UserInfoCard";
import { Api } from "@mui/icons-material";

const TABLE_HEADERS = ["Title", "Date", "Actions"];

const mockAnnouncements = [
  {
    id: "announcement_1",
    title: "Sample announcement 1",
    message: "This is a sample announcement.",
    date: "11/05/23",
  },
  {
    id: "announcement_2",
    title: "Sample announcement 2",
    message:
      "Find every kind of design, as well as commercial washing machines for washing a lot of clothing each and every day.",
    date: "11/10/23",
  },
  {
    id: "announcement_3",
    title: "Sample announcement 3",
    message:
      "Her position at the table shifted as the program grew more complex; she dropped her feet to the ground and leaned forward, taking in the rapidly changing situation.",
    date: "11/11/23",
  },
];

const mockGetAnnouncements = async () =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ status: 200, data: mockAnnouncements }), 500);
  });

const mockGetAnnouncement = async (announcementId) =>
  new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          status: 200,
          data: mockAnnouncements.find((a) => a.id === announcementId),
        }),
      500
    );
  });

const SystemAnnouncements = () => {
  const [announcements, setAnnouncements] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    const getAnnouncements = async () => {
      const response = await mockGetAnnouncements();

      if (response.status !== 200) {
        console.error("There was an error in fetching announcements.");
        setAnnouncements([]);
        return;
      }

      setAnnouncements(response.data);
    };

    getAnnouncements();
  }, []);

  const handleViewAnnouncement = async (announcementId) => {
    try {
      const response = await mockGetAnnouncement(announcementId);

      if (response.status !== 200) {
        console.error("There was an error fetching the announcement.");
        alert("There was an error in fetching the announcement.");
        return;
      }

      setSelectedAnnouncement(response.data);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  Api.request('retrieveAll', {

  }, response => {
    if (response && response.data )
      {
        console.log(response)
      }
    }, error => 
      {
        console.log(error)
      }
  )

  return (
    <div className="system-announcements">
      <Box sx={{ display: "flex" }}>
        <Breadcrumbs header="System Announcements" />
        <Button>Create new announcement</Button>
      </Box>

      {!!announcements ? (
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
              {announcements.map(({ id, title, date }) => (
                <tr key={id}>
                  <td>{title}</td>
                  <td>{date}</td>
                  <td>
                    <FontAwesomeIcon
                      className="icon"
                      icon={faEye}
                      size="sm"
                      onClick={() => handleViewAnnouncement(id)}
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
      ) : (
        "Loading..."
      )}

      <Modal
        size="md"
        show={isViewModalOpen}
        onHide={() => setIsViewModalOpen(false)}
      >
        <Modal.Body>
          <UserInfoCard name="Allison Smith" course="staff" size={65} />
          <h3 className="my-3">{selectedAnnouncement?.title}</h3>
          <small className="announcement-date">
            {selectedAnnouncement?.date}
          </small>
          <p>{selectedAnnouncement?.message}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button size="sm" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SystemAnnouncements;
