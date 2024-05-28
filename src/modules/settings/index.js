import React, { Component } from 'react'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEye, faX, faComment } from '@fortawesome/free-solid-svg-icons'
import Breadcrumb from 'modules/generic/breadcrumb';
import InputField from 'modules/generic/input';
import InputFieldV2 from 'modules/generic/inputV2';
import InputFieldV3 from 'modules/generic/inputV3';
import InputFieldV4 from 'modules/generic/inputV4';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import placeholder from 'assets/img/placeholder.jpeg'
import { connect } from 'react-redux'
import EmailModal from './modals/EmailModal'
import PasswordModal from './modals/PasswordModal'
import WarningModal from 'modules/generic/warningModalV2'
import API from 'services/Api'

const notification = [
    {
        title: "Show Notifications for Incoming Applicants",
        disabled: false
    },
    {
        title: "Show Notifications for Endorsed Applicants",
        disabled: false
    },
    {
        title: "Show Notifications for Coordinator Approved Applicants",
        disabled: false
    },
]

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
          showModal: false,
          first_name: null,
          error_first_name: null,
          middle_name: null,
          error_middle_name: null,
          last_name: null,
          error_last_name:  null,
          email: null,
          errorEmail: null,
          newEmail: null,
          errorNewEmail: null,
          password: null,
          errorPassword: null,
          newPassword: null,
          errorNewPassword: null,
          fileInput: null,
          showEmailModal: false,
          showPasswordModal: false,
          warningModal: false
        };
        this.fileInputRef = null
      }
      closeEmailModal(){
        this.setState({
            showEmailModal: false
        })
      }
      openEmailModal(){
        this.setState({
            showEmailModal: true
        })
      }
      
      closePasswordModal(){
        this.setState({
            showPasswordModal: false
        })
      }
      openPasswordModal(){
        this.setState({
            showPasswordModal: true
        })
      }

      closeWarningModal(){
        this.setState({
            warningModal: false
        })
      }
      openWarningModal(){
        this.setState({
            warningModal: true
        })
      }
      componentDidMount(){
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
            profile: this.props.details.profile_picture 
        })
      }
      handleFileInput = () => {
        // Use the file input reference to trigger the file selection dialog
        if (this.fileInputRef) {
            this.fileInputRef.click();
        }
    };
    uploadFile(){
        const { fileInput } = this.state;
        if (fileInput) {
            let formData = new FormData();
        
            formData.append('id', this.state.id);
            formData.append('user_id', this.state.user_id);
            formData.append('image', fileInput);
            
        
            // Set loading to true before starting the API call
            this.props.setIsLoadingV2(true);
        
            // Make a single API call with all files
            API.uploadFile('user/updateProfile', formData, response => {
                // Set loading to false after the API call is completed
                this.props.setIsLoadingV2(false);
        
                if (response && response.data) {
                    this.props.setDetails(response)
                } else {
                    alert("There has been an error updating. Please try again");
                }
            }, error => {
                // Set loading to false in case of an error
                this.props.setIsLoadingV2(false);
                console.log(error);
            });
        }
    };
    onFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Store the file in the state
            this.setState(prevState => ({
                fileInput: file
            }), () => {
                // Optionally, you can trigger any additional actions here, such as uploading the file
                // console.log("File selected:", file);
            });
        }
    };
    render() {
        const {showModal} = this.state
        return (
            <div>
                {/* <div className="headerStyle"><h2>LEAVE REQUESTS</h2></div> */}
                
                <Breadcrumb
                    header={"Settings"}
                    subheader={"View Account Settings"}/>

                <div className='containerBlue'>
                        
                    <Container>
                        <Row className='sectionHeader'>
                        <p style={{fontWeight: 'bold'}}>General Settings</p>

                        </Row>
                        <hr className='break'/>

                        <Row className='Row'>
                        <Col className='imageCircle'>
                        <div className='overlay'>
                            <img 
                                className='circle' 
                                src={
                                    this.state.fileInput 
                                       ? URL.createObjectURL(this.state.fileInput) 
                                        : this.props.details.profile_picture 
                                           ? this.props.details.profile_picture 
                                            : placeholder
                                } 
                                alt='profile' 
                                onClick={this.handleFileInput} 
                            />
                            <input 
                                type="file" 
                                ref={(input) => { this.fileInputRef = input; }} 
                                onChange={this.onFileChange} 
                                style={{ display: 'none' }}
                            />
                        </div>
                            <Col style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'start',
                                margin: 25
                            }}>
                                <p style={{fontWeight: 'bold'}} className=''>{this.state.first_name} {this.state.middle_name} {this.state.last_name}</p>
                                <p>{this.state.program}</p>

                            </Col>
                        
                        </Col>
                            <Col style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
            
                            }}>
                                <Button onClick={this.handleFileInput} variant="light"  style={{fontSize: '14px', width: 'auto', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>Update Profile Picture</Button>
                                {
                                    this.state.fileInput && (<Button disabled={this.state.fileInput ? false : true} onClick={()=>{this.openWarningModal()}} variant="light"  style={{fontSize: '14px', width: 'auto', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                    Confirm update
                                </Button>
                                )}
                            </Col>
                        </Row>
                        
                        <hr className='break'/>
                        <Row className='sectionHeader'>
                        <p style={{fontWeight: 'bold'}}>Update Email</p>
                        </Row>
                        <Row className='Row'>
                           
                            <Col>
                                Change Current Email Address
                            </Col>
                            <Col>
                                <Button onClick={()=>{this.openEmailModal()}} variant="light" style={{fontSize: '14px', width: 'auto', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>Begin Process</Button>
                            </Col>
                                  
                        </Row>
                        <hr className='break'/>
                        <Row className='sectionHeader'>
                        <p style={{fontWeight: 'bold'}}>Update Password</p>
                        </Row>
                        <Row className='Row'>

                            <Col>
                                Change Current Password
                            </Col>
                            <Col>
                                <Button onClick={()=>{this.openPasswordModal()}} variant="light" style={{fontSize: '14px', width: 'auto', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>Begin Process</Button>
                            </Col>
                        </Row>
                    
                    {/* Notification */}
                    {/* <hr className='break'/> */}
                    {/* <Row className='sectionHeader'>
                        <p style={{fontWeight: 'bold'}}>Notification Settings</p>
                    </Row>
                    {
                        notification.map((item, index)=>{
                            return(
                                <div>
                                    
                                        <Row className='Row'>
                                            <Col md={4}>
                                                <p>{item.title}</p>
                                            </Col>
                                            <Col md={4}>
                                            
                                            </Col>
                                            <Col md={4} className='switch'>
                                            <input className="tgl tgl-skewed" id={"cb" + index} type="checkbox"/>
                                            <label class="tgl-btn" data-tg-off="OFF" data-tg-on="ON" htmlFor={"cb" + index}></label>
                                            </Col>
                                        </Row>
                                </div>
                            )
                        })
                    } */}

                <EmailModal
                show={this.state.showEmailModal}
                onHide={()=>{this.closeEmailModal()}}
                />
                <PasswordModal
                show={this.state.showPasswordModal}
                onHide={()=>{this.closePasswordModal()}}
                />
                <WarningModal
                    show={this.state.warningModal}
                    message={"Update profile picture?"}
                    button1={"Disregard"}
                    button2={"Confirm Update"}
                    onContinue={() => {
                        this.setState({
                            warningModal: false
                        })
                        this.uploadFile()
                }}
                    onHide={() => {this.handleDiscard()}}
                />
                
                </Container>
                    
                </div> 
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
        setIsLoadingV2: (details) => {
          dispatch({ type: 'SET_IS_LOADING_V2', payload: { details } });
        },
        setDetails: (details) => {
            dispatch({ type: 'SET_DETAILS', payload: { details } });
        },
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Settings);