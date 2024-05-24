import React, { Component } from 'react'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEye, faX, faComment } from '@fortawesome/free-solid-svg-icons'
import Breadcrumb from 'modules/generic/breadcrumb';
import InputField from 'modules/generic/inputV3';
import InputFieldV4 from 'modules/generic/inputV4';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import placeholder from 'assets/img/placeholder.jpeg'
import { connect } from 'react-redux'

// Used when scholar first sets up their profile

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

class Setup extends Component {
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

          password: null,
          errorPassword: null,
          confirmPassword: null,
          errorConfirm: null,
          type: null,
          errorType: null,
          status: null,
          errorStatus: null,
            program: null,
            errorProgram: null,
            status: null,
            errorStatus: null,
          fileInput: null,
        };
        this.fileInputRef = null;

      }
      componentDidMount(){
        this.setState({
            first_name: this.props.details.first_name,
            middle_name: this.props.details.middle_name,
            last_name: this.props.details.last_name,
            email: this.props.user.email,
            type: this.props.user.account_type,
            status: this.props.user.status,
            program: this.props.details.program,
            status: this.props.user.status
        })
      }
      handleFileInput = () => {
        // Use the file input reference to trigger the file selection dialog
        if (this.fileInputRef) {
            this.fileInputRef.click();
        }
    };
    uploadFile = () => {
        const { fileInput } = this.state;
        if (fileInput) {
            // Implement your file upload logic here
            console.log("Uploading file:", fileInput);
            // Example: uploadFileToServer(fileInput);
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
                console.log("File selected:", file);
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
                        <p>General Settings</p>

                        </Row>
                        <hr className='break'/>

                        <Row className='Row'>
                        <Col className='imageCircle'>
                            <div className='overlay'>
                                <img className='circle' src={placeholder} alt='profile' onClick={this.handleFileInput} />
                                <input type="file" ref={(input) => { this.fileInputRef = input; }} onChange={this.onFileChange} style={{ display: 'none' }} />
                                <div className='overlayText'>Click to upload new picture</div>
                            </div>
                        </Col>
                            <Col className='imageText'>
                                <p className=''>{this.state.first_name} {this.state.middle_name} {this.state.last_name}, {this.state.program}</p>
                            </Col>
                        </Row>
                        <hr className='break'/>
                        <Row className='sectionHeader'>
                        <p>General Info</p>
                        </Row>
                        <Row className='Row'>
                            <Col className=''>
                                <InputFieldV4
                                id={1}
                                type={'name'}
                                label={'First Name'}
                                inject={this.state.first_name}
                                locked={false}
                                active={false}
                                onChange={(first_name, errorFirstName) => {
                                    this.setState({
                                        first_name, errorFirstName
                                    })
                                  }}
                                />
                            </Col>
                            <Col className=''>
                                <InputFieldV4
                                id={2}
                                type={'text'}
                                label={'Middle Name'}
                                inject={this.state.middle_name}
                                locked={false}
                                active={false}
                                onChange={(middle_name, errorMiddleName) => {
                                    this.setState({
                                        middle_name, errorMiddleName
                                    })
                                  }}
                                />
                            </Col>
                            <Col className=''>
                                <InputFieldV4
                                id={3}
                                type={'text'}
                                label={'Last Name'}
                                inject={this.state.last_name}
                                locked={false}
                                active={false}
                                onChange={(last_name, errorLastName) => {
                                    this.setState({
                                        last_name, errorLastName
                                    })
                                  }}
                                />
                            </Col>
                        </Row>
                        <Row className='Row'>
                            <Col>
                            <InputFieldV4
                                id={4}
                                type={'email'}
                                label={'Email'}
                                inject={this.state.email}
                                locked={false}
                                active={false}
                                onChange={(email, errorEmail) => {
                                    this.setState({
                                        email, errorEmail
                                    })
                                  }}
                                />
                            </Col>
                            <Col>
                            <InputFieldV4
                                id={5}
                                type={'text'}
                                label={'Program'}
                                inject={this.state.program}
                                locked={true}
                                active={false}
                                onChange={(email, errorEmail) => {
                                    this.setState({
                                        email, errorEmail
                                    })
                                  }}
                                />
                            </Col>
                        </Row>
                        <Row className='Row'>
                            <Col>
                            <InputFieldV4
                                id={6}
                                type={'field'}
                                label={'Account Type'}
                                inject={this.state.type}
                                locked={true}
                                active={false}
                                onChange={(type, errorType) => {
                                    this.setState({
                                        type, errorType
                                    })
                                  }}
                                />
                            </Col>
                            <Col>
                            <InputField
                                id={7}
                                type={'field'}
                                label={'Account Status'}
                                inject={this.state.status}
                                locked={true}
                                active={false}
                                onChange={(status, errorStatus) => {
                                    this.setState({
                                        status, errorStatus
                                    })
                                  }}
                                />
                            </Col>
                        </Row>
                    {/* Password */}
                    <hr className='break'/>
                    <Row className='sectionHeader'>
                        <p>Password Settings</p>
                    </Row>
                    <Row className='Row'>
                            <Col className=''>
                                <InputField
                                id={8}
                                type={'password'}
                                label={'Current Password'}
                                locked={false}
                                active={false}
                                onChange={(password, errorPassword) => {
                                    this.setState({
                                        password, errorPassword
                                    })
                                  }}
                                />
                            </Col>
                            <Col>
                            <InputField
                                id={9}
                                type={'password'}
                                label={'Confirm New Password'}
                                locked={false}
                                active={false}
                                onChange={(confirmPassword, errorConfirm) => {
                                    this.setState({
                                        confirmPassword, errorConfirm
                                    })
                                  }}
                                />
                            </Col>
                        </Row>
                    {/* Notification */}
                    <hr className='break'/>
                    <Row className='sectionHeader'>
                        <p>Notification Settings</p>
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
                    }
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
        }
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Setup);