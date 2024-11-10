import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { Table, Button, Modal, Form } from "react-bootstrap";
import API from 'services/Api'
import { useDispatch, useSelector } from 'react-redux';

const TABLE_HEADERS = ["#", "Midterm Assessment", "Final Assessment", "Status", "Action"];

function ScholarRequests() {
  const location = useLocation();
  const scholar = location.state.scholar;

  const [requests, setRequests] = useState([]);
  //const { scholarId } = useParams();
  //const { history, show } = this.props;
  const fetchRequests = async () => {
    API.request('scholar_request/retrieveMultipleByParameter', { col: 'scholar_id', value: scholar.user_id }, response => {
      if (response && response.data) {
        // Make the second API call to retrieve account details
        setRequests(response.data)
      } else {
        console.log('error on retrieve');
      }
    }, error => {
      console.log(error);
    });
  }
  console.log(requests);
  useEffect(() => {
    fetchRequests();
  }, []);
  // Redux dispatchers
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const setIsLoadingV2 = (status) => {
      dispatch({ type: 'SET_IS_LOADING_V2', payload: { status } });
  };

  return (
    <>
    <h3>welcome {scholar.account_details.last_name} {scholar.account_details.first_name}</h3>
    <p>This is the Scholar Requests page</p>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>account_details_id</th>
          <th>scholar_id</th>
          <th>status</th>
          <th>comment_id</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request, index) => (
          <tr key={request.id}>
            <td>{index+1}</td>
            <td>{request.account_details_id}</td>
            <td>{request.scholar_id}</td>
            <td>{request.status}</td>
            <td>{request.comment_id}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );
}

  
  export default ScholarRequests;