import { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom';
import { Table, Button, Modal, Form } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import API from 'services/Api';
import { toast, ToastContainer, Slide } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';

const TABLE_HEADERS = ["#", "Midterm Assessment", "Final Assessment", "Status", "Action"];

function ScholarTasks() {
    const location = useLocation();
    const scholar = location.state.scholar;

    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        id: scholar.id,
        midterm_assessment: '',
        final_assessment: '',
        approval_status: 'pending',
    });
    const [selectedTask, setSelectedTask] = useState(null);
    const [validation, setValidation] = useState({ midterm_assessment: true, final_assessment: true });
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState({ add: false, edit: false, delete: false });

    const midtermInput = useRef(null);
    const finalInput = useRef(null);

    const handleModalShow = (type, task = null) => {
        setSelectedTask(task);
        
        setShowModal({ ...showModal, [type]: true });
    };

    const handleModalClose = (type) => setShowModal({ ...showModal, [type]: false });

    const fetchTasks = async () => {
        setIsLoading(true);
        API.request(
            'scholar_tasks/retrieveMultipleByParameter',
            { col: 'scholar_id', value: scholar.id },
            response => {
                if (response && response.data) {
                    setTasks(response.data);
                } else {
                    toast.error('Error fetching tasks');
                }
                setIsLoading(false);
            },
            error => {
                console.error(error);
                toast.error('Error fetching tasks');
                setIsLoading(false);
            }
        );
    };

    const formValidation = () => {
        const isValid = !!(newTask.midterm_assessment && newTask.final_assessment);
        setValidation({ midterm_assessment: !!newTask.midterm_assessment, final_assessment: !!newTask.final_assessment });
        return isValid;
    };

    const handleFileChange = (fieldName, event) => {
        const file = event.target.files[0];
        setNewTask(prevTask => ({ ...prevTask, [fieldName]: file }));
        if (selectedTask) setSelectedTask({ ...selectedTask, [fieldName]: file });
    };

    const createTask = async (e) => {
      e.preventDefault();
      
      if (!midtermInput.current.files[0] || !finalInput.current.files[0]) {
        toast.info('Both Midterm and Final files need to be uploaded.');
        return;
    }
    if (!formValidation()) return;
      setIsLoading(true);
      const formData = new FormData();
      formData.append('scholar_id', newTask.id);
      formData.append('midterm_assessment', midtermInput.current.files[0]);
      formData.append('final_assessment', finalInput.current.files[0]);
  
      API.uploadFile('scholar_tasks/create', formData, response => {
          if (response.data && !response.data.error) {
              const newTaskData = {
                  id: response.data.id, // Assuming the response contains the new task ID
                  midterm_assessment: URL.createObjectURL(midtermInput.current.files[0]), // Create a URL for viewing
                  final_assessment: URL.createObjectURL(finalInput.current.files[0]), // Create a URL for viewing
                  approval_status: 'pending',
              };
              setTasks(prevTasks => [...prevTasks, newTaskData]); // Update local tasks state
              toast.success('Task created successfully');
              setShowModal({ ...showModal, add: false });
          } else {
              toast.error('Error creating task');
          }
          setIsLoading(false);
      }, error => {
          console.error(error);
          toast.error('Error creating task');
          setIsLoading(false);
      });
  };
  

    const editTask = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('id', selectedTask.id);
        formData.append('scholar_id', selectedTask.scholar_id);
        formData.append('midterm_assessment', selectedTask.midterm_assessment || midtermInput.current.files[0]);
        formData.append('final_assessment', selectedTask.final_assessment || finalInput.current.files[0]);
        formData.append('approval_status', selectedTask.approval_status);

        API.uploadFile('scholar_tasks/updateOne', formData, response => {
            if (response && response.data) {
                fetchTasks();
                toast.success('Task updated successfully');
            } else {
                toast.error('Error updating task');
            }
            setIsLoading(false);
            setShowModal({ ...showModal, edit: false });
        }, error => {
            console.error(error);
            toast.error('Error updating task');
            setIsLoading(false);
        });
    };

    const deleteTask = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log('Deleting Task:', selectedTask);
        API.request('scholar_tasks/delete', { id: selectedTask.id }, () => {
            setTasks(tasks.filter(task => task.id !== selectedTask.id));
            toast.success('Task deleted successfully');
            setIsLoading(false);
            setShowModal({ ...showModal, delete: false });
        }, error => {
            console.error(error);
            toast.error('Error deleting task');
            setIsLoading(false);
        });
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <>
            <ToastContainer position="top-center" autoClose={5000} hideProgressBar transition={Slide} />
            <div style={{ float: 'left', textAlign: 'left' }}>
                <h3>Welcome {scholar.account_details.last_name} {scholar.account_details.first_name}</h3>
                <p>This is the Scholar Tasks page</p>
            </div>
            {/* <Button onClick={() => handleModalShow('add')} style={{ float: 'right', marginTop: '1rem' }}>Add New Task</Button> */}
            <div class="contentButton">
              <button onClick={() => handleModalShow('add')} style={{ float: 'right', marginTop: '1rem' }}>+ Add New Task</button>
            </div>
            <Table style={{ marginTop: '4.5rem' }}>
                <thead>
                    <tr>{TABLE_HEADERS.map(header => <th key={header}>{header}</th>)}</tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={TABLE_HEADERS.length}><Skeleton count={3} height={50} /></td>
                        </tr>
                    )}
                    {!isLoading && tasks.length === 0 && (
                        <tr>
                            <td colSpan={TABLE_HEADERS.length} style={{ textAlign: 'center' }}>
                                Oops, looks like there are no tasks submitted.
                            </td>
                        </tr>
                    )}
                    {!isLoading && tasks.length > 0 && (
                        tasks.map((task, index) => (
                            <tr key={task.id || task.tempId}>
                                <td>{index + 1}</td>
                                <td><a href={task.midterm_assessment} target="_blank" rel="noreferrer noopener">View File</a></td>
                                <td><a href={task.final_assessment} target="_blank" rel="noreferrer noopener">View File</a></td>
                                <td>{task.approval_status}</td>
                                <td>
                                    <span className="link" onClick={() => handleModalShow('edit', task)}>Edit</span>
                                    <span className="link" onClick={() => handleModalShow('delete', task)}>Delete</span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            <Modal show={showModal.add} onHide={() => handleModalClose('add')}>
                <Modal.Header closeButton><Modal.Title>Add New Task</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formMidterm">
                            <Form.Label>Midterm</Form.Label>
                            <Form.Control type="file" onChange={(event) => handleFileChange('midterm_assessment', event)} ref={midtermInput} />
                        </Form.Group>
                        <Form.Group controlId="formFinal">
                            <Form.Label>Final</Form.Label>
                            <Form.Control type="file" onChange={(event) => handleFileChange('final_assessment', event)} ref={finalInput} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleModalClose('add')}>Close</Button>
                    <Button variant="primary" onClick={createTask}>Submit</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModal.edit} onHide={() => handleModalClose('edit')}>
                <Modal.Header closeButton><Modal.Title>Edit Task</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formMidterm">
                            <Form.Label>Midterm</Form.Label>
                            <Form.Control type="file" onChange={(event) => handleFileChange('midterm_assessment', event)} ref={midtermInput} />
                        </Form.Group>
                        <Form.Group controlId="formFinal">
                            <Form.Label>Final</Form.Label>
                            <Form.Control type="file" onChange={(event) => handleFileChange('final_assessment', event)} ref={finalInput} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleModalClose('edit')}>Close</Button>
                    <Button variant="primary" onClick={editTask}>Submit</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModal.delete} onHide={() => handleModalClose('delete')}>
                <Modal.Header closeButton><Modal.Title>Delete Task</Modal.Title></Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this task?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleModalClose('delete')}>Close</Button>
                    <Button variant="danger" onClick={deleteTask}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ScholarTasks;
