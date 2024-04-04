import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { Table, Button, Modal } from "react-bootstrap";
import API from 'services/Api'

const TABLE_HEADERS = ["#", "Comment", "Leave Start", "Leave End", "Leave Letter", "Status"];

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
    {/* <table>
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
    </table> */}
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
            {leaverequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id + 1}</td>
                  <td>{request.comment_id}</td>
                  <td>{request.leave_start}</td>
                  <td>{request.leave_end}</td>
                  <td> <input 
                          type="file" 
                          style={{ display: 'block', padding: 0, marginLeft: 'auto', marginRight: 'auto', marginTop: 0, marginBottom: 0, width: '200px' }} 
                          // onChange={(event) => this.handleFileChange(event, item.alias)}
                          // ref={(input) => {
                          //     this.fileInputs = { ...this.fileInputs, [item.alias]: input };
                          //  }}
                          /> </td>
                  <td>{request.status}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

  
  export default ScholarLeaveApplication;