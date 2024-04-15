import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

class RemarksModal extends Component {
 constructor(props) {
    super(props);
    this.state = {
      message: '',
    };
 }


 handleMessageChange = (e) => {
    this.setState({ message: e.target.value });
 };

 handleSubmitForm = (e) => {
    let {setData} = this.props
    e.preventDefault();
    this.props.handleRemarkSubmit({ message: this.state.message, details: setData });
    this.setState({  message: '' });
 };

 render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Add Remarks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.handleSubmitForm}>
            
            <Form.Group controlId="formMessage">
              <Form.Label>Add Remarks for Applicant</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Enter remarks" value={this.state.message} onChange={this.handleMessageChange} />
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

export default RemarksModal;