import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import API from 'services/Api'
import { toast } from 'react-toastify'; // Import toast from react-toastify

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


 handleRemarkSubmit(){
  const { details } = this.props;
  let {setData} = this.props;
  // Trigger loading state to true before the API call
  this.props.setIsLoadingV2(true);

  API.request('comments/createViaApplication', {
    id: setData.id, // take account_detail_id, find it in BE
    message: this.state.message,
    comment_by: details.user_id  
  }, response => {
    // Trigger loading state to false after the API call is completed
    this.props.setIsLoadingV2(false);
    if (response && response.comments) {
      toast.error('Comment Successfully Added.')
      this.props.onHide()
      this.props.refreshList()
      this.setState({
        message: ''
      })
    }else{
      toast.error('Something went wrong. Please try again.')
      console.log('error on retrieve')
    }
  }, error => {
    this.props.setIsLoadingV2(false);
    toast.error('Something went wrong. Check your connection and try again.')

    console.log(error);
  })
}

 render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Add Remarks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            
            <Form.Group controlId="formMessage" style={{
              marginTop: 10,
              marginBottom: 10
            }}>
              <Form.Label>Add Remarks for Applicant</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Enter remarks" value={this.state.message} onChange={this.handleMessageChange} />
            </Form.Group>
            <Button variant="primary" onClick={()=>{this.handleRemarkSubmit()}}>
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

export default connect(mapStateToProps, mapDispatchToProps)(RemarksModal);