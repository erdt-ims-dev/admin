import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import API from 'services/Api';
import { Table, Button, Modal, Form } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Skeleton CSS
import 'react-toastify/dist/ReactToastify.css';
import "./style.scss";

const TABLE_HEADERS = ["#", "Study Name", "Study", "Study Category", "Publish Type", "Action"];

function ScholarPortfolio() {
    const location = useLocation();
    const scholar = location.state.scholar;

    const [portfolios, setPortfolios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [selectedPortfolio, setSelectedPortfolio] = useState(null); // Add state for selected portfolio
    const [editShow, setEditShow] = useState(false); // State for edit modal
    const [deleteShow, setDeleteShow] = useState(false); // State for delete modal

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleEditShow = (portfolio) => {
        setSelectedPortfolio(portfolio);
        setEditShow(true);
    };
    const handleEditClose = () => setEditShow(false);

    const handleDeleteShow = (portfolio) => {
        setSelectedPortfolio(portfolio);
        setDeleteShow(true);
    };
    const handleDeleteClose = () => setDeleteShow(false);

    const fetchPortfolio = async () => {
        API.request('scholar_portfolio/retrieveMultipleByParameter', { col: 'scholar_id', value: scholar.id }, 
        response => {
            if (response && response.data) {
                setPortfolios(response.data);
            } else {
                toast.error('Error retrieving portfolios');
            }
            setIsLoading(false); // End loading after data fetch
        }, error => {
            toast.error('Error retrieving portfolios');
            setIsLoading(false);
        });
    };

    useEffect(() => {
        fetchPortfolio();
    }, []);

    return (
      <>
        <div style={{ float:'left', textAlign:'left'}}>
            <h3>{scholar.account_details.last_name} {scholar.account_details.first_name}'s Portfolio</h3>
            <p>Below are all the files submitted</p>
        </div>
        <div style={{float:'right', marginTop:'1rem'}}>
            <Button onClick={handleShow}> Add New Study </Button>
        </div>

        <Modal show={show} onHide={handleClose}>
            {/* Modal content for adding new study */}
        </Modal>

        <div className="table-container" style={{ marginTop: '4.5rem' }}>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {TABLE_HEADERS.map((header) => (
                            <th key={header}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        // Render Skeleton Rows
                        Array(5).fill().map((_, index) => (
                            <tr key={index}>
                                {TABLE_HEADERS.map((_, colIndex) => (
                                    <td key={colIndex}>
                                        <Skeleton width={100} />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        portfolios.map((portfolio, index) => (
                            <tr key={portfolio.id || portfolio.tempId}>
                                <td>{index + 1}</td>
                                <td>{portfolio.study_name}</td>
                                <td>
                                    <a href={portfolio.study} target="_blank" rel="noreferrer noopener">View link</a>
                                </td>
                                <td>{portfolio.study_category}</td>
                                <td>{portfolio.publish_type}</td>
                                <td>
                                    <span className="link" onClick={() => handleEditShow(portfolio)}>Edit</span>
                                    <span className="link" onClick={() => handleDeleteShow(portfolio)}> Delete</span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
      </>
    );
}

export default ScholarPortfolio;
