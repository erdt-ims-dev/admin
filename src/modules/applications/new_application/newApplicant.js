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
import { Button } from 'react-bootstrap';
import API from 'services/Api'

// create application form on behalf of existing user.
// to create, user must be registered and have account_type == new

const files = [
    {
        title: "Transcript of Record",
        disabled: false,
        alias: "TOR"
    },
    {
        title: "Birth Certificate",
        disabled: false,
        alias: "Birth"
    },
    {
        title: "Valid ID",
        disabled: false,
        alias: "Id"
        
    },
    {
        title: "Narrative Essay",
        disabled: false,
        alias: "Essay"
    },
    {
        title: "Medical Cerificate",
        disabled: false,
        alias: "Medical"
    },
    {
        title: "NBI Clearance",
        disabled: false,
        alias: "NBI"
    },
    {
        title: "Admission Notice",
        disabled: false,
        alias: "Admission"
    },
    {
        title: "Program Study",
        disabled: false,
        alias: "Program"
    },
]

class newApplicant extends Component {
    constructor(props) {
        super(props);
        this.state = {
          showModal: this.props,
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
          errorConfirm: null,
          selectedFiles: {
            TOR: null,
            Birth: null,
            Id: null,
            Essay: null,
            Medical: null,
            NBI: null,
            Admission: null,
            Program: null,
          },
        };
        };
        
        retrieveUser(){
            // retrieves user based on email provided
            // email needs to be checked first
            API.request('account_details/updateTor', {
                col: 'status',
                value: 'pending'
              }, response => {
                if (response && response.data) {
                  response.data.forEach((element, index )=> {
                  });
                }else{
                  console.log('error on retrieve')
                }
              }, error => {
                console.log(error)
              })
        }
        viewFile = (alias) => {
            const { selectedFiles } = this.state;
            const { fileURL } = selectedFiles[alias] || {}; // Use an empty object as a fallback
            if (fileURL) {
               // Display the file using the fileURL
               window.open(fileURL, '_blank');
            } else {
               console.log("No file selected for viewing.");
            }
           };
           handleFileChange = (event, alias) => {
            const file = event.target.files[0];
            let fileURL = null; 
            console.log("alias", alias)
            if(file){
                fileURL = URL.createObjectURL(file);
                this.setState(prevState => ({
                    selectedFiles: {
                      ...prevState.selectedFiles,
                      [alias]: { file, fileURL },
                    },
                 }), ()=>{
                    console.log("File", this.state.selectedFiles)
                 });
            }else{
                console.log('no selected file')
            }
           };
           
     handleUpload = () => {
        const { selectedFile, email, first_name, middle_name, last_name,  } = this.state;
        if (!selectedFile) {
          alert('Please select a file to upload.');
          return;
        }
        if(email != null || undefined){
            API.request('account_details/updateTor', {
                col: 'status',
                value: 'pending'
              }, response => {
                if (response && response.data) {
                  response.data.forEach((element, index )=> {
                    this.getDetails(element.account_details_id)
                  });
                }else{
                  console.log('error on update')
                }
              }, error => {
                console.log(error)
              })
        }
     };
    render() {
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
                    
                    {/* Notification */}
                    <hr className='break'/>
                    <Row className='sectionHeader'>
                        <p>File Uploads</p>
                    </Row>
                    {
                        files.map((item, index)=>{
                            return(
                                <div>
                                    
                                        <Row className='Row' key={index}>
                                            <Col md={4}>
                                                <p>{item.title}</p>
                                            </Col>
                                            <Col md={4}>
                                            
                                            </Col>
                                            <Col md={4} className='switch'>
                                                <Col>
                                                <span className='icon' onClick={() => this.viewFile(item.alias)}>Preview</span>

                                                </Col>

                                                <Col>
                                                <input
                                                type="file"
                                                style={{ display: 'none' }}
                                                onChange={(event) => this.handleFileChange(event, item.alias)}
                                                ref={(input) => {
                                                    this.fileInputs = { ...this.fileInputs, [item.alias]: input };
                                                 }}
                                                />
                                                <span 
                                                className='icon'
                                                onClick={() => this.fileInputs[item.alias].click()}
                                                >Upload
                                                </span>
                                                </Col>
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