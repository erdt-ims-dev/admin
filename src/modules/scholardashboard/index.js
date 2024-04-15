import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { Table, Button, Modal, Form } from "react-bootstrap";
import API from 'services/Api'

const TABLE_HEADERS = ["#", "Midterm Assessment", "Final Assessment", "Status", "Action"];

function ScholarRequests() {
  const location = useLocation();

  const [accountDetails, setAccountDetails] = useState({}); 
  const [requests, setRequests] = useState([]);
  //const { scholarId } = useParams();
  //const { history, show } = this.props;
  const fetchRequests = async () => {
    API.request('user/retrieveMultiple', { col: 'account_type', value: 'endorsed' }, response => {
      if (response && response.data) {
        // Fetch account details for each request
        const accountDetailsPromises = response.data.map(request =>
          API.request('account_details/retrieveOne', { col: 'user_id', value: response.id})
        );

        Promise.all(accountDetailsPromises).then(accountDetailsResponses => {
          const details = accountDetailsResponses.reduce((acc, response, index) => {
            if (response && response.data) {
              acc[response.data.id] = response.data; // Store account details by account_details_id
            }
            return acc;
          }, {});
          console.log(details);
          console.log(response.data);
          //setAccountDetails(details); // Update account details state
          //setRequests(response.data); // Update requests state
        });
      } else {
        console.log('error on retrieve');
      }
    }, error => {
      console.log(error);
    });
 }

 useEffect(() => {
    fetchRequests();
 }, []);

 return (
    <>
    
      <p>This is the Scholar Requests page</p>
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Scholar ID</th>
            <th>Status</th>
            <th>Comment ID</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => {
            const accountDetail = accountDetails[request.account_details_id];
            return (
              <tr key={request.id}>
                <td>{index+1}</td>
                <td>{accountDetail ? accountDetail.first_name : 'Loading...'}</td>
                <td>{accountDetail ? accountDetail.last_name : 'Loading...'}</td>
                <td>{request.scholar_id}</td>
                <td>{request.status}</td>
                <td>{request.comment_id}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}

  
  export default ScholarRequests;