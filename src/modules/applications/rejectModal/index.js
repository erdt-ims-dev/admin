import React, { Component } from 'react'
import 'modules/applications/applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faEye, faUpload } from '@fortawesome/free-solid-svg-icons'
import { Button, Modal } from 'react-bootstrap';
import API from 'services/Api'
import { connect } from 'react-redux';

class endorseModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
          
        };
      }

    handleReject() {
      const {setData} = this.props
      // Trigger loading state to true before the API call
      this.props.setIsLoadingV2(true);
  
      API.request('scholar_request/reject', {
          id: setData.id,
      }, response => {
          // Trigger loading state to false after the API call is completed
          this.props.setIsLoadingV2(false);
  
          if (response && response.data) {
              this.props.onHide();
              this.props.refreshList();
          } else {
              console.log('error on retrieve');
          }
      }, error => {
          // Trigger loading state to false in case of an error
          this.props.setIsLoadingV2(false);
          console.log(error);
      });
  }
    render() {
        const {setData} = this.props
    return (
        <div className=''>
            {/* <div className="headerStyle"><h2>LEAVE REQUESTS</h2></div> */}
    <Modal
      show={this.props.show}
      onHide={this.props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header style={{
        backgroundColor: '#f1f5fb'
      }}>
        <Modal.Title id="contained-modal-title-vcenter">
        General Information
        </Modal.Title>
      </Modal.Header>
      <Modal.Body >
        Are you sure you want to reject applicant?
      </Modal.Body>
      <Modal.Footer style={{
        backgroundColor: '#f1f5fb'
      }}>
        <Button variant='secondary' onClick={this.props.onHide}>Close</Button>
        <Button onClick={()=>{this.handleReject()}}>Reject</Button>
      </Modal.Footer>
    </Modal>
                    
                   
                    
                </div> 
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(endorseModal);
