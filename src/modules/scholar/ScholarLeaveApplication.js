import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import API from 'services/Api'

function ScholarLeaveApplication() {
  const location = useLocation();
  const scholar = location.state.scholar;

  const [leaverequests, setLeaveRequests] = useState([]);
  //const { scholarId } = useParams();
  //const { history, show } = this.props;
  const fetchRequests = async () => {
    API.request('leave_application/retrieveMultipleByParameter', { col: 'user_id', value: scholar.user_id }, response => {
      if (response && response.data) {
        // Make the second API call to retrieve account details
        setLeaveRequests(response.data)
      } else {
        console.log('error on retrieve');
      }
    }, error => {
      console.log(error);
    });
  }
  console.log(leaverequests);
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
          <th>user</th>
          <th>comment</th>
          <th>leave start</th>
          <th>leave end</th>
          <th>leave letter</th>
          <th>status</th>
        </tr>
      </thead>
      <tbody>
        {leaverequests.map((request, index) => (
          <tr key={request.id}>
            <td>{index+1}</td>
            <td>{request.user_id}</td>
            <td>{request.comment_id}</td>
            <td>{request.leave_start}</td>
            <td>{request.leave_end}</td>
            <td>{request.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );
}

  
  export default ScholarLeaveApplication;