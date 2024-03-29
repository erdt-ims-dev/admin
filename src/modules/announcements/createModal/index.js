import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

class createModal extends Component {
 constructor(props) {
    super(props);
    this.state = {
      title: '',
      message: '',
    };
 }

 handleTitleChange = (e) => {
    this.setState({ title: e.target.value });
 };

 handleMessageChange = (e) => {
    this.setState({ message: e.target.value });
 };

 handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.handleSubmit({ title: this.state.title, message: this.state.message });
    this.setState({ title: '', message: '' });
 };

 render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Announcement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.handleSubmitForm}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" value={this.state.title} onChange={this.handleTitleChange} />
            </Form.Group>
            <Form.Group controlId="formMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Enter message" value={this.state.message} onChange={this.handleMessageChange} />
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

export default createModal;