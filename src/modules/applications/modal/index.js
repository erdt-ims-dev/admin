import React, { Component } from 'react'
import 'modules/applications/applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faEye, faUpload } from '@fortawesome/free-solid-svg-icons'
import Breadcrumb from 'modules/generic/breadcrumb';
import InputField from 'modules/generic/input';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import placeholder from 'assets/img/placeholder.jpeg'
import { Button, Modal } from 'react-bootstrap';


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

class ViewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
      <Modal.Header >
        <Modal.Title id="contained-modal-title-vcenter">
        General Information
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
    <Row className='sectionHeader'>
        <p>File Uploads</p>
        
    </Row>
    <hr className='break'></hr>
    {
        files.map((item, index)=>{
            return(
                <div>
                    
                        <Row className='Row'>
                            <Col md={3}>
                                <p>{item.title}</p>
                            </Col>
                            <Col md={3}>
                            
                            </Col>
                            <Col md={3}></Col>
                            <Col md={3} className='switch'>
                                {/* <FontAwesomeIcon
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
                                    /> */}
                                    <span 
                                    className='icon'
                                    onClick={()=>{}}
                                    >View</span>
                            </Col>
                        </Row>
                </div>
            )
        })
    }
    </Container>
        
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this.props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
                    
                   
                    
                </div> 
        )
    }
}

export default ViewModal