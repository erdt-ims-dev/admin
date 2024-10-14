import { Button, Modal, Table } from "react-bootstrap";
import Breadcrumbs from "../generic/breadcrumb";
import { Box } from "@mui/material";
import "./style.scss";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import UserInfoCard from "../generic/UserInfoCard";
import  Api  from "../../services/Api";

const TABLE_HEADERS = ["Title", "Date", "Actions"];

const mockAnnouncements = [
  {
    id: "announcement_1",
    title: "Sample announcement 1",
    message: "This is a sample announcement.",
    date: "11/05/23",
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
    Api.request('admin_system_message/retrieveAll', {

    }, response => {
      if (response && response.data )
        {
          setAnnouncements([response.data])
        }
      }, error => 
        {
          console.error("There was an error in fetching announcements.");
          setAnnouncements([]);
        }
    )

      
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

  return (
    <div className="system-announcements">
      <Box sx={{ display: "flex" }}>
        <Breadcrumbs header="System Announcements1" />
        <button className="btn">+ New</button>
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
              {announcements.map(({ id, system_message, date }) => (
                <tr key={id}>
                  <td>{system_message}</td>
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
