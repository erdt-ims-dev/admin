import React, { Component } from 'react'
import './applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faEye, faUpload } from '@fortawesome/free-solid-svg-icons'
import Breadcrumb from '../generic/breadcrumb';
import InputField from '../generic/input';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import placeholder from '../../assets/img/placeholder.jpeg'
import { Button } from 'react-bootstrap';


const files = [
    {
        title: "Transcript of Record",
        disabled: false
    },
    {
        title: "Birth Certificate",
        disabled: false
    },
    {
        title: "Valid ID",
        disabled: false
    },
    {
        title: "Narrative Essay",
        disabled: false
    },
    {
        title: "Medical Cerificate",
        disabled: false
    },
    {
        title: "NBI Clearance",
        disabled: false
    },
    {
        title: "Admission Notice",
        disabled: false
    },
    {
        title: "Program Study",
        disabled: false
    },
]

class newApplicant extends Component {
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
          errorPassowrd: null,
          confirmPassowrd: null,
          errorConfirm: null
        };
      }
    render() {
        const {showModal} = this.state
        return (
            <div>
                {/* <div className="headerStyle"><h2>LEAVE REQUESTS</h2></div> */}
                
                <Breadcrumb
                    header={"Create New Applicant"}
                    subheader={"Application Form"}/>

                <div className='containerBlue' style={{
                    marginTop: "1%",
                    marginBottom: "1%"
                }}>
                        
                    <Container>
                        <Row className='sectionHeader'>
                        <p>General Information</p>

                        </Row>
                        <hr className='break'/>

                        <Row className='Row'>
                            <Col className='imageCircle'>
                                <img className='circle' src={placeholder}></img>
                            </Col>
                            <Col className='imageText'>
                                <p className=''>This will be the profile picture displayed</p>
                            </Col>
                        </Row>
                        <Row className='Row'>
                            <Col className=''>
                                <InputField
                                id={1}
                                type={'name'}
                                label={'First Name'}
                                locked={false}
                                active={false}
                                onChange={(first_name, error_first_name) => {
                                    this.setState({
                                        first_name, error_first_name
                                    })
                                  }}
                                />
                            </Col>
                            <Col className=''>
                                <InputField
                                id={1}
                                type={'name'}
                                label={'Middle Name'}
                                locked={false}
                                active={false}
                                onChange={(middle_name, error_middle_name) => {
                                    this.setState({
                                        middle_name, error_middle_name
                                    })
                                  }}
                                />
                            </Col>
                            <Col className=''>
                                <InputField
                                id={1}
                                type={'name'}
                                label={'Last Name'}
                                locked={false}
                                active={false}
                                onChange={(last_name, error_last_name) => {
                                    this.setState({
                                        last_name, error_last_name
                                    })
                                  }}
                                />
                            </Col>
                        </Row>
                        <Row className='Row'>
                            <Col>
                            <InputField
                                id={2}
                                type={'email'}
                                label={'Email'}
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
                            <InputField
                                id={3}
                                type={'field'}
                                label={'Applicant'}
                                locked={true}
                                active={false}
                                />
                            </Col>
                        </Row>
                    {/* Password */}
                    {/* <hr className='break'/>
                    <Row className='sectionHeader'>
                        <p>Password Settings</p>
                    </Row>
                    <Row className='Row'>
                            <Col className=''>
                                <InputField
                                id={1}
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
                                id={2}
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
                        </Row> */}
                    {/* Notification */}
                    <hr className='break'/>
                    <Row className='sectionHeader'>
                        <p>File Uploads</p>
                    </Row>
                    {
                        files.map((item, index)=>{
                            return(
                                <div>
                                    
                                        <Row className='Row'>
                                            <Col md={4}>
                                                <p>{item.title}</p>
                                            </Col>
                                            <Col md={4}>
                                            
                                            </Col>
                                            <Col md={4} className='switch'>
                                                <FontAwesomeIcon
                                                    className="icon"
                                                    icon={faEye}
                                                    size="md"
                                                    onClick={() => {}}
                                                    style={{
                                                        marginLeft: 10,
                                                        marginRight: 10
                                                    }}
                                                    />
                                                    <FontAwesomeIcon
                                                    className="icon"
                                                    icon={faUpload}
                                                    size="md"
                                                    onClick={() => {}}
                                                    style={{
                                                        marginLeft: 10,
                                                        marginRight: 10
                                                    }}
                                                    />
                                            </Col>
                                        </Row>
                                </div>
                            )
                        })
                    }
                    <hr className='break'/>
                    <Row className='sectionHeader'> 
                    <Col md={10}>
                    
                    </Col>
                    <Col md={2}>
                        <Button>
                            Create Applicant
                        </Button>
                    </Col>
                    </Row>
                   
                    </Container>
                   
                    
                </div> 
            </div>
        )
    }
}

export default newApplicant