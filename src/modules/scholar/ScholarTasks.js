import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { Table, Button, Modal } from "react-bootstrap";
import API from 'services/Api'

const TABLE_HEADERS = ["#", "Midterm Assessment", "Final Assessment", "Status"];

function ScholarTasks() {
    const location = useLocation();
    const scholar = location.state.scholar;

    const [tasks, setTasks] = useState([]);
    //const { scholarId } = useParams();
    //const { history, show } = this.props;
    
    const fetchTasks = async () => {
      API.request('scholar_tasks/retrieveMultipleByParameter', { col: 'scholar_id', value: scholar.user_id }, response => {
        if (response && response.data) {
          // Make the second API call to retrieve account details
          setTasks(response.data)
        } else {
          console.log('error on retrieve');
        }
      }, error => {
        console.log(error);
      });
    }
    console.log(tasks);
    useEffect(() => {
      fetchTasks();
    }, []);


    return (
      <>
      <h3>welcome {scholar.account_details.last_name} {scholar.account_details.first_name}</h3>
      <p>This is the Scholar Tasks page</p>
      {/* <table>
        <thead>
          <tr>
            <th>#</th>
            <th>id</th>
            <th>Midterm Assessment</th>
            <th>Final Assessment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task.id}>
              <td>{index+1}</td>
              <td>{task.id}</td>
              <td>{task.midterm_assessment}</td>
              <td>{task.final_assessment}</td>
              <td>{task.approval_status}</td>
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
            {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.id + 1}</td>
                  {/* <td>{portfolio.scholar_id}</td> */}
                  {/* <td>{portfolio.study}</td> */}
                  <td> <input 
                          type="file" 
                          style={{ display: 'block', padding: 0, marginLeft: 'auto', marginRight: 'auto', marginTop: 0, marginBottom: 0, width: '200px' }} 
                          // onChange={(event) => this.handleFileChange(event, item.alias)}
                          // ref={(input) => {
                          //     this.fileInputs = { ...this.fileInputs, [item.alias]: input };
                          //  }}
                          /> </td>
                  {/* <td>{portfolio.study_category}</td> */}
                  <td> <input 
                          type="file" 
                          style={{ display: 'block', padding: 0, marginLeft: 'auto', marginRight: 'auto', marginTop: 0, marginBottom: 0, width: '200px' }} 
                          // onChange={(event) => this.handleFileChange(event, item.alias)}
                          // ref={(input) => {
                          //     this.fileInputs = { ...this.fileInputs, [item.alias]: input };
                          //  }}
                          /> </td>
                  <td>{task.approval_status}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      </>
    );
  }
  
  export default ScholarTasks;