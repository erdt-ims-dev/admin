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
        this.fileInputs = {};
        this.state = {
            password: null,
            errorPassword: null,
            newPassword: null,
            errorNewPassword: null,
            isCollapsed: true
        };
        
      }
      componentDidMount() {
        this.setState({
          id: this.props.details.id,
          user_id: this.props.details.user_id,
          first_name: this.props.details.first_name,
          middle_name: this.props.details.middle_name,
          last_name: this.props.details.last_name,
          email: this.props.user.email,
          type: this.props.user.account_type,
          status: this.props.user.status,
          program: this.props.details.program,
          status: this.props.user.status,
          profile: this.props.profile_picture
      })
    }
    
    componentDidUpdate(prevProps) {
        
        
    }
    
    handleDiscard(){
        this.setState({
        
        });
    }
    updateEmail(){

    }
        

    render() {
        const { selectedFiles} = this.state
        const {setData} = this.props
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
