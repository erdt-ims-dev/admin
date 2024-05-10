import { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom';
import { Table, Button, Modal, Form } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import API from 'services/Api'

const TABLE_HEADERS = ["#", "Midterm Assessment", "Final Assessment", "Status", "Action"];

function ScholarTasks() {
    const location = useLocation();
    const scholar = location.state.scholar;

    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
      midterm_assessment: '',
      final_assessment: '',
      approval_status: 'pending',
    });

    // create refs for input elements
    const midtermInput = useRef(null);
    const finalInput = useRef(null);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    //edit modal
    const [selectedTask, setSelectedTask] = useState([]);
    const [editTaskShow, setEditTaskShow] = useState(false);

    const handleEditTaskShow = (task) => {
      console.log(task);
      setSelectedTask(task);
      setEditTaskShow(true);
    }
    const handleEditTaskClose = () => setEditTaskShow(false);
    
     //delete confimation modal
     const [deleteTaskShow, setDeleteTaskShow] = useState(false);
     const handleDeleteTaskShow = (task) => {
      setSelectedTask(task);
      setDeleteTaskShow(true);
     }
     const handleDeleteTaskClose = () => setDeleteTaskShow(false);

    //input binding; not sure if works for files
    const handleInputChange = (fieldName, event) => {
      const file = event.target.files[0];
      setNewTask((prevState) => ({
      ...prevState,
        [fieldName]: file,
      }));
    };
    //fetch all
    const fetchTasks = async () => {
      API.request('scholar_tasks/retrieveMultipleByParameter', { col: 'scholar_id', value: scholar.user_id }, response => {
        if (response && response.data) {
          setTasks(response.data)
          console.log(response.data)
        } else {
          console.log('error on retrieve');
        }
      }, error => {
        console.log(error);
      });
    }
    
    //create
    const createTask = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('scholar_id', scholar.user_id);
      formData.append('midterm_assessment', midtermInput.current.files[0]);
      formData.append('final_assessment', finalInput.current.files[0]);
      //publish_type set to 'pending' by default;

      API.uploadFile('scholar_tasks/create', formData, response => {
        if (response && response.data) {
          console.log('Data created successfully', response.data);
          const newTask = {...response.data, tempId: uuidv4() };
          setTasks(prevTasks => [...prevTasks, newTask]);
          fetchTasks();
        } else {
          console.log('error on retrieve');
        }
      }, error => {
        console.log(error)
      });
      
      console.log(newTask);
      setShow(false);
    };

    //edit 
    const editTask = async (e) => {
      e.preventDefault();

      const formData = new FormData();
      
      formData.append('id', selectedTask.id);
      formData.append('scholar_id', scholar.user_id);
      formData.append('midterm_assessment', midtermInput.current.files[0]);
      //(midtermInput.current.files[0] !== null) ? formData.append('midterm_assessment', midtermInput.current.files[0]) : formData.append('midterm_assessment', '');
      formData.append('final_assessment', finalInput.current.files[0]);
      //(finalInput.current.files[0] !== null) ? formData.append('final_assessment', finalInput.current.files[0]) : formData.append('final_assessment', '');
      formData.append('approval_status', selectedTask.approval_status);
      console.log(formData);
      API.uploadFile('scholar_tasks/updateOne', formData, response => {
        if (response && response.data) {
          console.log('Data updated successfully', response.data);
          fetchTasks();
        } else {
          console.log('error on retrieve');
        }
      }, error => {
        console.log(error)
      })
      setEditTaskShow(false);
    };

    //delete
    const deleteTask = async (e) => {
      e.preventDefault();
      console.log(selectedTask.id)
      API.request('scholar_tasks/delete', {
        id: selectedTask.id,
      }, response => {
        console.log('Data deleted successfully');
      }, error => {
        console.log(error)
      })
      //console.log(selectedPortfolio);
      //to see the changes in the table after and close the modal
      setTasks(tasks.filter(tasks => tasks.id !== selectedTask.id));
      setDeleteTaskShow(false);
    };

    useEffect(() => {
      fetchTasks(); 
    }, []);



    return (
      <>
      <h3>welcome {scholar.account_details.last_name} {scholar.account_details.first_name}</h3>
      <p>This is the Scholar Tasks page</p>
        <Button 
          onClick={handleShow} 
          style={{float:'right'}}> Add New Task </Button>
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Group controlId="formStudyName">
              <Form.Label>Midterm</Form.Label>
              <Form.Control type="file" placeholder="Midterm Assessment" onChange={(event) => handleInputChange('midterm_assessment', event)} ref={midtermInput}  />
          </Form.Group>
          <Form.Group controlId="formStudy">
              <Form.Label>Final</Form.Label>
              <Form.Control type="file" placeholder="Final Assessment" onChange={(event) => handleInputChange('final_assessment', event)} ref={finalInput}  />
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Status</Form.Label>
              <Form.Control type="text" placeholder="Enter Study Category" onChange={(event) => handleInputChange('study_category', event)} value={newTask.approval_status} readOnly/>
          </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={createTask}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* to edit portfolios */}
      <Modal show={editTaskShow} onHide={handleEditTaskClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit New Study</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Group controlId="formStudyName">
              <Form.Label>Midterm</Form.Label><br/>
              <a href={selectedTask.midterm_assessment} target="_blank" rel="noreferrer noopener">link</a>
              <Form.Control type="file" placeholder="Midterm file" onChange={(event) => handleInputChange('midterm_assessment', event)} ref={midtermInput} />
          </Form.Group>
          <Form.Group controlId="formStudy">
              <Form.Label>Final</Form.Label><br/>
              <a href={selectedTask.final_assessment} target="_blank" rel="noreferrer noopener">link</a>
              <Form.Control type="file" placeholder="Final file" onChange={(event) => handleInputChange('final_assessment', event)}  ref={finalInput}/>
          </Form.Group>
          <Form.Group controlId="formStudyCategory">
              <Form.Label>Status</Form.Label>
              <Form.Control 
                        type="text" 
                        placeholder="Enter Study Category" 
                        onChange={(event) => {
                        // Extract the new value from the event
                        const newValue = event.target.value;
                        // Update the selectedTask state with the new approval_status
                        setSelectedTask(prevTask => ({...prevTask, approval_status: newValue }));
                      }} 
                      value={selectedTask?.approval_status}
                  />
          </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditTaskClose}>
            Close
          </Button>
          <Button variant="primary" onClick={editTask} >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      
       {/* delete confirmation modal for tasks */}
       <Modal show={deleteTaskShow} onHide={handleDeleteTaskClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={deleteTask}>
            Yes
          </Button>
          <Button variant="secondary" onClick={handleDeleteTaskClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
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
            {tasks.map((task, index) => (
                <tr key={task.id || task.tempId}>
                  <td key={index + 1}>{index + 1}</td>
                  {/* <td>{portfolio.scholar_id}</td> */}
                  {/* <td>{portfolio.study}</td> */}
                  <td> <a href={task.midterm_assessment} target="_blank" rel="noreferrer noopener">View File</a> </td>
                  {/* <td>{portfolio.study_category}</td> */}
                  <td > <a href={task.final_assessment} target="_blank" rel="noreferrer noopener">View File</a> </td>
                  <td>{task.approval_status}</td>
                  <td>
                    <span className='link' 
                          onClick={() => handleEditTaskShow(task)} 
                          >Edit</span>
                    <span className='link' 
                          onClick={() => handleDeleteTaskShow(task)}
                          >Delete</span>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      </>
    );
  }
  
  export default ScholarTasks;