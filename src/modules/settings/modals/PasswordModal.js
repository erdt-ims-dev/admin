import React, { Component } from 'react'
import 'modules/applications/applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faChevronDown, faChevronUp, faEye, faUpload } from '@fortawesome/free-solid-svg-icons'
import Breadcrumb from 'modules/generic/breadcrumb';
import InputFieldV4 from 'modules/generic/inputV4';
import InputFieldV3 from 'modules/generic/inputV3';
import InputFieldV2 from 'modules/generic/inputV2';
import InputField from 'modules/generic/input';
import WarningModal from 'modules/generic/warningModalV2'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import placeholder from 'assets/img/placeholder.jpeg'
import { Button, Modal } from 'react-bootstrap';
import API from 'services/Api'
import { connect } from 'react-redux'; // Import connect from react-redux


class PasswordModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: null,
            errorPassword: null,
            newPassword: null,
            errorNewPassword: null,
            isCollapsed: true,

            user_id: null,
            error: null,
            user_id: null,
            first_name: null,
            middle_name: null,
            last_name: null,
            program: null,
        };
        
      }
      componentDidMount() {
        this.setState({
          user_id: this.props.details.user_id,
          first_name: this.props.details.first_name,
          middle_name: this.props.details.middle_name,
          last_name: this.props.details.last_name,
          program: this.props.details.program,
          
      })
    }
    
    componentDidUpdate(prevProps) {
        
        
    }
    
    handleDiscard(){
        this.setState({
        
        });
    }
    updatePassword = () => {
      const { user_id, password, newPassword } = this.state;
      if(password == null && newPassword == null){
        this.setState({
          error: 'Fields cannot be blank'
        })
        return
      }
      if ((!password ||!newPassword)) {
        this.setState({
            error: 'Fill in missing fields'
        });
        return;
    }
      let formData = new FormData();
      formData.append('user_id', user_id);
      formData.append('current_password', password);
      formData.append('new_password', newPassword);
    
      API.uploadFile('user/updatePassword', formData, response => {
        // Set loading to false after the API call is completed
        this.props.setIsLoadingV2(false);
    
        // Check if there was an error in the response
        if (response.error!== null) {
          // Handle validation errors or any other errors returned by the server
          this.setState({
            error: response.error
          });
          return;
        }
    
        // Check if the update was successful
        if (response.data ) {
          this.props.updateUser(response.user)
        } else {
          // Handle unexpected errors
          alert('Something went wrong. Try again.');
        }
      }, error => {
        // Set loading to false in case of an error
        this.props.setIsLoadingV2(false);
        console.log(error);
        // Optionally display an error message or handle the error differently
      });
    }
        

    render() {
    return (
        <div className=''>
            {/* <div className="headerStyle"><h2>LEAVE REQUESTS</h2></div> */}
    <Modal
      show={this.props.show}
      onHide={()=>{this.props.onHide()}}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header style={{
        backgroundColor: '#f1f5fb'
      }}>
        <Modal.Title id="contained-modal-title-vcenter">
        Change Password
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{
        backgroundColor: '#f1f5fb'
      }}>
      <Container>
      <Row className='sectionHeader'>
        

        </Row>

        <Row className='Row'>
            <Col className='imageCircle'>
                <img className='circle' src={this.props.details.profile_picture}></img>
            </Col>
            <Col className='imageText'>
                <p style={{ fontWeight: 'bold'}}>{this.props.details ?  `${this.state.first_name} ${this.props.details.middle_name} ${this.props.details.last_name}, ${this.props.details.program}` : ''}</p>
            </Col>
        </Row>

          <Row className='Row'>
          <Col xs={6} style={{
                                
            }}>
                <Col className=''>
                <InputField
                id={3}
                type={'password'}
                label={'Current Password'}
                placeholder={'Enter Current Password'}
                locked={false}
                active={false}
                onChange={(currentPassword, errorCurrentPassword) => {
                    this.setState({
                        currentPassword, errorCurrentPassword
                    })
                    }}
                />
            </Col>
            </Col>
            <Col xs={6}>
            <InputField
                id={4}
                type={'password'}
                label={'New Password'}
                placeholder={'Input New Password'}
                locked={false}
                active={false}
                onChange={(newPassword, errorNewPassword) => {
                    this.setState({
                        newPassword, errorNewPassword
                    })
                    }}
                />
            </Col>
          </Row>
        
    <WarningModal
        show={this.state.discardModal}
        message={"Are you sure you want to discard changes?"}
        button1={"No"}
        button2={"Yes"}
        onContinue={() => {
            this.setState({
            discardModal: false
            })
            this.props.onHide()
    }}
        onHide={() => {this.props.onHide()}}
    />

    </Container>
        
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={()=>{
            this.handleDiscard()
            this.setState({
                discardModal: true
            })
            }}>Discard Changes</Button>
        <Button variant='primary' onClick={()=>{this.uploadFile()}}>Save Changes</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(PasswordModal);
