import React, { Component } from 'react'
import 'modules/applications/applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faEye, faUpload } from '@fortawesome/free-solid-svg-icons'
import Breadcrumb from 'modules/generic/breadcrumb';
import InputField from 'modules/generic/input';
import InputFieldV3 from 'modules/generic/inputV3';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import placeholder from 'assets/img/placeholder.jpeg'
import { Button } from 'react-bootstrap';
import API from 'services/Api'
import CONFIG from 'config.js';
// create application form on behalf of existing user.
// to create, user must be registered and have account_type == new

const files = [
    {
        title: "Transcript of Record",
        disabled: false,
        alias: "tor"
    },
    {
        title: "Birth Certificate",
        disabled: false,
        alias: "birth_certificate"
    },
    {
        title: "Recommendation Letter",
        disabled: false,
        alias: "recommendation_letter"
        
    },
    {
        title: "Narrative Essay",
        disabled: false,
        alias: "narrative_essay"
    },
    {
        title: "Medical Cerificate",
        disabled: false,
        alias: "medical_certificate"
    },
    {
        title: "NBI Clearance",
        disabled: false,
        alias: "nbi_clearance"
    },
    {
        title: "Admission Notice",
        disabled: false,
        alias: "admission_notice"
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

          selectedFiles: {
            tor: null,
            birth_certificate: null,
            narrative_essay: null,
            medical_certificate: null,
            nbi_clearance: null,
            admission_notice: null,
          },

          user: [],
          retrieveError: false, 
          retrievedExisting: false,
          errorMessage: ""
        };
        };
        
        
            viewFile = (alias) => {
            const { selectedFiles } = this.state;
            const { fileURL } = selectedFiles[alias] || {}; // Use an empty object as a fallback
            if (fileURL) {
               // Display the file using the fileURL
               window.open(fileURL, '_blank');
            } else {
               alert("No file selected for viewing.");
            }
           };
           handleFileChange = (event, alias) => {
            const file = event.target.files[0];
            let fileURL = null; 
            // warning modal here
            if(file){
                fileURL = URL.createObjectURL(file);
                this.setState(prevState => ({
                    selectedFiles: {
                      ...prevState.selectedFiles,
                      [alias]: { file, fileURL },
                    },
                 }), ()=>{
                    // console.log("File", this.state.selectedFiles)
                 });
            }else{
                // console.log('no selected file')
            }
           };
           retrieveUser(successCallback, errorCallback, user = null) {
            const { email } = this.state;
            if (email) {
                API.request('user/retrieveOne', {
                    col: 'email',
                    value: email
                }, response => {
                    if (response && response.data) {
                        this.setState({
                            user: response.data,
                        }, () => {
                        });

                        if (response.data.account_type == 'new') {
    
                            this.uploadFile(response.data)
                        } else {
                            this.setState({
                                errorMessage: "This email already has an existing application"
                            });
                            // successCallback(true, response.data);
                        }
                    } else {
                        this.setState({
                            errorMessage: "Email Not Found"
                        });
                    }
                }, error => {
                    errorCallback(error);
                });
            } else {
                errorCallback(new Error('Email is not provided'));
            }
        }
        uploadFile(user) {
            const { selectedFiles } = this.state;
            let formData = new FormData();
           
            // Append user_id to the FormData
            formData.append('user_id', user.id);
           
            // Loop through each file and append it to the FormData
            Object.entries(selectedFiles).forEach(([field, fileData]) => {
               if (fileData && fileData.file) {
                 // Append each file with its field name as the key
                 formData.append(field, fileData.file);
               }
            });
           
            // Make a single API call with all files
            API.uploadFile('account_details/update', formData, response => {
               if (response && response.data) {
                 console.log(response);
               } else {
                 console.log('error on retrieve');
               }
            }, error => {
               console.log(error);
            });
           }
           
           handleUpload = async () => {
            const { user, selectedFiles } = this.state;
            try {
                this.setState({
                    errorMessage: ""
                })
                const userFound = await this.retrieveUser();
                if (userFound && user != null) {
                    
                    console.log('User found and files uploaded successfully');
                } else {
                    this.setState({ errorEmail: 'Email not found' });
                }
            } catch (error) {
                console.error('Error retrieving user:', error);
                this.setState({ errorEmail: 'An error occurred while retrieving user' });
            }
        };
        
    render() {
        const {errorMessage, retrieveError, retrievedExisting, selectedFiles} = this.state
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
                            <Col >
                            <InputField
                            id={2}
                            className={retrieveError || retrievedExisting ? "error" : ""}
                            type={'email'}
                            label={'Email'}
                            placeholder={'Email'}
                            locked={false}
                            active={true}
                            onChange={(value) => {
                                this.setState({
                                    errorMessage: "",
                                    email: value
                                },)
                            }}
                        />
                                <p className='errorText'>{errorMessage != "" ? errorMessage : ""}</p>
                            </Col>
                            <Col>
                            <InputFieldV3
                                id={3}
                                type={'field'}
                                label={'Type'}
                                inject={'Applicant'}
                                placeholder={'Applicant'}
                                locked={true}
                                active={false}
                                onChange={() => {
                                    
                                  }}
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
                                                {selectedFiles[item.alias] ? (<span className='icon' onClick={() => this.viewFile(item.alias)}>Preview</span>) : ""}

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
                    <Col className='options'>
                        <Button variant="danger" onClick={this.handleUpload}>
                            Discard
                        </Button>
                        <Button onClick={this.handleUpload}>
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