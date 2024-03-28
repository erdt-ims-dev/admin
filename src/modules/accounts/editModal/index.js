import React, { Component } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import '../style.css';
import API from 'services/Api'
class EditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newType: props.setData ? props.setData.account_type : ''
        };
      }

    
    componentDidUpdate(prevProps) {
        if (this.props.setData !== prevProps.setData) {
            this.setState({
                newType: this.props.setData ? this.props.setData.account_type : ''
            });
        }
    }
    handleSubmit(){
        const {setData} = this.props
        const {newType} = this.state
        API.request('user/update', {
            id: setData.id,
            col: 'account_type',
            value: newType
        }, response => {
          if (response && response.data) {
            this.props.onHide()
            this.props.refresh()
          }else{
            console.log('error on retrieve')
          }
        }, error => {
          console.log(error)
        })
    }
    render() {
        const { show, onHide, setData } = this.props;
        const { newType } = this.state;
    return (
            <Modal show={show} onHide={onHide} size="lg" centered>
                <Modal.Header>
                    <Modal.Title>Edit Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" placeholder="Enter first name" value={setData? setData.email : ""} readOnly />
                        </Form.Group>
                        <Form.Group controlId="formStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control type="text" placeholder="Enter middle name" value={setData? setData.status: ""} readOnly />
                        </Form.Group>
                        <Form.Group controlId="formAccountType">
                            <Form.Label>Account Type</Form.Label>
                            <Form.Control 
                                className='customSelect' 
                                as="select" 
                                value={newType}
                                onChange={(e) => this.setState({ newType: e.target.value })}
                            >
                                <option value="admin">admin</option>
                                <option value="staff">staff</option>
                                <option value="applicant">applicant</option>
                                <option value="scholar">scholar</option>
                                <option value="new">new</option>
                            </Form.Control>
                        </Form.Group>
                        
                        {/* Add other fields as necessary */}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Discard
                    </Button>
                    <Button variant="primary" onClick={()=>{this.handleSubmit()}}>
                        Save
                    </Button>
                    {/* Add a button for saving changes if necessary */}
                </Modal.Footer>
            </Modal>
        );
    }
}

export default EditModal
