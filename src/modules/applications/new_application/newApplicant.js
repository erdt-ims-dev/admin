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
        alias: "birth"
    },
    {
        title: "Recommendation Letter",
        disabled: false,
        alias: "recommendation"
        
    },
    {
        title: "Narrative Essay",
        disabled: false,
        alias: "essay"
    },
    {
        title: "Medical Cerificate",
        disabled: false,
        alias: "medical"
    },
    {
        title: "NBI Clearance",
        disabled: false,
        alias: "nbi"
    },
    {
        title: "Admission Notice",
        disabled: false,
        alias: "notice"
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
            nbi: null,
            admission_notice: null,
          },

          user: [],
          retrieveError: false, 
          retrievedExisting: false
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
                            retrieveError: false
                        }, () => {
                            this.uploadFile(response.data)
                        });
                        if (response.data.account_type != 'new') {
                            this.setState({
                                retrievedExisting: true
                            });
                            successCallback(false);
                        } else {
                            successCallback(true, response.data);
                        }
                    } else {
                        console.log('error on retrieve', response.error);
                        this.setState({
                            retrieveError: true
                        });
                        errorCallback(new Error('Error retrieving user'));
                    }
                }, error => {
                    console.log(error);
                    errorCallback(error);
                });
            } else {
                errorCallback(new Error('Email is not provided'));
            }
        }
        //    handleUpload = () => {

        //     // find existing user via email
        //     this.retrieveUser(
        //         (userFound, errorCallback, user) => {
        //             if (userFound) {
        //                 console.log("user found")
        //             } else {
        //                 // User not found or is not new, handle accordingly
        //                 console.log("error on callback")
        //             }
        //         },
        //         (error) => {
        //             // Handle error
        //             console.error(error);
        //         }
        //     );
        //    };

           uploadFile(user){
            const {selectedFiles} = this.state
            Object.entries(selectedFiles).forEach(([field, fileData]) => {
                if (fileData && fileData.file) {
                  let formData = new FormData();
                  formData.append('file', fileData.file);
                  formData.append('user_id', user.id);
                  formData.append('field', field);

                  API.uploadFile('account_details/update', formData, response => {
                    if (response && response.data) {
                      console.log(response)
                    }else{
                      console.log('error on retrieve')
                    }
                  }, error => {
                    console.log(error)
                  })

                }
             });
           }
           
           handleUpload = async () => {
            const { user, selectedFiles } = this.state;
            try {
                const userFound = await this.retrieveUser();
                if (userFound && user != null) {
                    // Use Promise.all to wait for all API calls to complete
                    await Promise.all(Object.entries(selectedFiles).map(async ([field, file]) => {
                        if (file) {
                            console.log(file)
                            const response = await API.request('account_details/update', {
                                user_id: user.id,
                                file: file,
                                field: field
                            });
                            if (!response || !response.data) {
                                console.log('error on retrieve');
                            }
                        } else {
                            console.log('No file uploaded for', field);
                        }
                    }));
                    // All API calls completed successfully
                    console.log('All files uploaded successfully');
                } else {
                    this.setState({ errorEmail: 'Email not found' });
                }
            } catch (error) {
                console.error('Error retrieving user:', error);
                this.setState({ errorEmail: 'An error occurred while retrieving user' });
            }
        };
        
    render() {
        const {retrieveError, retrievedExisting, selectedFiles} = this.state
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
                                placeholder={'First Name'}
                                locked={false}
                                active={false}
                                onChange={(value) => {
                                    this.setState({
                                        first_name: value
                                    })
                                  }}
                                />
                            </Col>
                            <Col className=''>
                                <InputField
                                id={1}
                                type={'name'}
                                label={'Middle Name'}
                                placeholder={'Middle Name'}
                                locked={false}
                                active={false}
                                onChange={(value) => {
                                    this.setState({
                                        middle_name: value
                                    })
                                  }}
                                />
                            </Col>
                            <Col className=''>
                                <InputField
                                id={1}
                                type={'name'}
                                label={'Last Name'}
                                placeholder={'Last Name'}
                                locked={false}
                                active={false}
                                onChange={(value) => {
                                    this.setState({
                                        last_name: value
                                    })
                                  }}
                                />
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
                                    email: value
                                },)
                            }}
                        />
                                <p className='errorText'>{retrieveError ? "Email not Found" : ""}</p>
                                <p className='errorText'>{retrievedExisting ? "This email already has a pending/endorsed application" : ""}</p>
                            </Col>
                            <Col>
                            <InputField
                                id={3}
                                type={'field'}
                                label={'Applicant'}
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
                    <Col md={10}>
                    
                    </Col>
                    <Col md={2}>
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