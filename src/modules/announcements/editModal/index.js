import React, { Component } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import '../style.css';
import API from 'services/Api'
import { connect } from 'react-redux'

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
    
     handleSubmit() {
      const loggedInUser = this.props.user
      const {setData} = this.props
      const {title, message} = this.state
    
      // Trigger loading state to true before the API call
      this.props.setIsLoadingV2(true);
      API.request('admin_system_message/update', {
        id: setData.id,
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
        const { show, onHide, setData } = this.props;
        const { title, message } = this.state;
    return (
        <Modal show={show} onHide={onHide}>
        <div style={{ background: "#404041", color: "#f5f5f5", borderRadius: "8px 8px 0px 0px"}} data-bs-theme="dark" className='bg-dark p-2'>
            <Modal.Header closeButton>
                <Modal.Title>Edit Announcement</Modal.Title>
        </Modal.Header>
        </div>
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
            <Button style={{
              marginTop: 25
            }} variant="dark" onClick={()=>{this.handleSubmit()}}>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditModal);
