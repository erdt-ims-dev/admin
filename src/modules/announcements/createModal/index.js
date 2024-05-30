import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import API from 'services/Api';
import { connect } from 'react-redux'

class CreateModal extends Component {
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

 handleSubmitAnnouncement() {
  const loggedInUser = this.props.user
  const {title, message} = this.state
  // const announcementString = JSON.stringify(announcement);

  // Trigger loading state to true before the API call
  this.props.setIsLoadingV2(true);

  API.request('admin_system_message/create', {
    message_by: loggedInUser.email,
    message_title: title,
    message_body: message
  }, response => {
    this.props.setIsLoadingV2(false);
    if (response && response.data) {
      this.props.onHide()
      this.props.refreshList()
      this.setState({
        title: '',
        message: ''
      })
    }else{
      console.log('error on retrieve')
    }
  }, error => {
    this.props.setIsLoadingV2(false);
    console.log(error)
  })
  // this.closeCreate();
};

 render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
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
            <Button style={{
              marginTop: 25
            }} variant="primary" onClick={()=>{this.handleSubmitAnnouncement()}}>
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
 }
}

const mapStateToProps = (state) => ({
  user: state.user,
  details: state.details, 
 });
 const mapDispatchToProps = (dispatch) => {
  return {
      setIsLoadingV2: (status) => {
        dispatch({ type: 'SET_IS_LOADING_V2', payload: { status } });
      }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateModal);