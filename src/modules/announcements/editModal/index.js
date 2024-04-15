import React, { Component } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import '../style.css';
import API from 'services/Api'

class EditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            message: '',
          };
      }

    componentDidUpdate(prevProps) {
    if (this.props.setData !== prevProps.setData) {
        this.setState({
            title: this.props.setData ? this.props.setData.message_title : "",
            message: this.props.setData ? this.props.setData.message_body : ""
        });
    }
    }
    handleTitleChange = (e) => {
        this.setState({ title: e.target.value });
     };
    
     handleMessageChange = (e) => {
        this.setState({ message: e.target.value });
     };
    
     handleEditSubmit = (e) => {
        e.preventDefault();
        this.props.handleEditSubmit({ title: this.state.title, message: this.state.message });
        this.setState({ title: '', message: '' });
     };
    
    render() {
        const { show, onHide, setData } = this.props;
        const { title, message } = this.state;
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Announcement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.handleEditSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" value={title} onChange={this.handleTitleChange} />
            </Form.Group>
            <Form.Group controlId="formMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Enter message" value={message} onChange={this.handleMessageChange} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
        );
    }
}

export default EditModal
