import React, { Component } from 'react'
import 'modules/applications/applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faChevronDown, faChevronUp, faEye, faUpload } from '@fortawesome/free-solid-svg-icons'
import Breadcrumb from 'modules/generic/breadcrumb';
import InputFieldV4 from 'modules/generic/inputV4';
import InputField from 'modules/generic/input';
import WarningModal from 'modules/generic/warningModalV2'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import placeholder from 'assets/img/placeholder.jpeg'
import { Button, Modal } from 'react-bootstrap';
import API from 'services/Api'
import { connect } from 'react-redux'; // Import connect from react-redux


class EmailModal extends Component {
    constructor(props) {
        super(props);
        this.updateEmail = this.updateEmail.bind(this);
        this.fileInputs = {};
        this.state = {
          registeredEmail: null,
          errorEmail: null,
          newEmail: null,
          errorNewEmail: null,
          isCollapsed: true,
          error: null,

          id: null,
          user_id: null,
          first_name: null,
          middle_name: null,
          last_name: null,
          email: null,
          type: null,
          status: null,
          program: null,
          status: null,
          profile: null
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
    updateEmail = () => {
      const { user_id, registeredEmail, newEmail, email } = this.state;
      if(registeredEmail == null && newEmail == null){
        this.setState({
          error: 'Fields cannot be blank'
        })
        return
      }else if(email !== registeredEmail){
        this.setState({
          error: 'Current email field does not match with registered email'
        })
        return
      }
      if ((!email ||!newEmail)) {
        this.setState({
            error: 'Fill in missing fields'
        });
        return;
    }
      let formData = new FormData();
      formData.append('user_id', user_id);
      formData.append('current_email', registeredEmail);
      formData.append('new_email', newEmail);
    
      API.uploadFile('user/updateEmail', formData, response => {
        // Set loading to false after the API call is completed
        this.props.setIsLoadingV2(false);
    
        // Check if there was an error in the response
        if (response.error!== null) {
          // Handle validation errors or any other errors returned by the server
          this.setState({
            emailError: response.error
          });
          return;
        }
    
        // Check if the update was successful
        if (response.user && response.details) {
          this.props.setDetails(response.details)
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
        const { error} = this.state
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
        Update Email
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
                <p style={{ fontWeight: 'bold'}} className=''>{this.props.details ?  `${this.state.first_name} ${this.props.details.middle_name} ${this.props.details.last_name}, ${this.props.details.program}` : ''}</p>
            </Col>
            
        </Row>

          <Row className='Row'>
          <Col xs={6} style={{
                                
            }}>
                <Col className=''>
                <InputField
                id={1}
                type={'email'}
                label={'Current Email'}
                placeholder={'Enter Current Email'}
                // inject={this.state.email}
                locked={false}
                active={false}
                onChange={(registeredEmail, errorEmail) => {
                    this.setState({
                      registeredEmail, errorEmail
                    })
                  }}
                />
                </Col>
            </Col>
            <Col xs={6}>
            <InputField
                id={2}
                type={'email'}
                label={'New Email'}
                placeholder={'Enter New Email'}
                locked={false}
                active={false}
                onChange={(newEmail, errorNewEmail) => {
                    this.setState({
                        newEmail, errorNewEmail
                    })
                  }}
                />
            </Col>
            <p style={{
              color: 'red'
            }}>
              {error}
              
            </p>
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
        <Button variant='primary' onClick={this.updateEmail}>Save Changes</Button>
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
      },
      setDetails: (details) => {
        dispatch({ type: 'SET_DETAILS', payload: { details } });
      },
      updateUser: (user) => {
        dispatch({ type: 'UPDATE_USER', payload: { user } });
      },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailModal);
