import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import API from 'services/Api'

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


  return (
    <>
    <h3>welcome {scholar.account_details.last_name} {scholar.account_details.first_name}</h3>
    <p>This is the Scholar Tasks page</p>
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