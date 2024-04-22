import React, { Component } from 'react'
import 'modules/applications/applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Breadcrumb from 'modules/generic/breadcrumb';
import InputField from 'modules/generic/input';
import InputFieldV3 from 'modules/generic/inputV3';
import WarningModal from 'modules/generic/warningModal'
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
          errorMessage: null,
          overwriteModal: false,
          discardModal: false,
          fileToOverwrite: null,
          fileToUpload: null,
          emailRetrieved: false
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
        
            // Check if a file has already been uploaded for the given alias
            const existingFile = this.state.selectedFiles[alias];
            if (existingFile) {
                // If a file exists, show the warning modal and store the file to be uploaded
                this.setState({
                    overwriteModal: true,
                    fileToOverwrite: alias, // Store the alias of the file to be overwritten
                    fileToUpload: file, // Store the file to be uploaded
                });
            } else {
                // If no file exists, proceed as before
                if (file) {
                    fileURL = URL.createObjectURL(file);
                    this.setState(prevState => ({
                        selectedFiles: {
                            ...prevState.selectedFiles,
                            [alias]: { file, fileURL },
                        },
                    }), () => {
                        // console.log("File", this.state.selectedFiles)
                    });
                } else {
                    // console.log('no selected file')
                }
            }
        };
        handleFileOverwrite = () => {
            const { fileToOverwrite, fileToUpload } = this.state;
            let fileURL = URL.createObjectURL(fileToUpload);
        
            // Overwrite the existing file
            this.setState(prevState => ({
                selectedFiles: {
                    ...prevState.selectedFiles,
                    [fileToOverwrite]: { file: fileToUpload, fileURL },
                },
                overwriteModal: false, // Close the warning modal
                fileToUpload: null, // Clear the file to upload reference
            }), () => {
                // console.log("File overwritten", this.state.selectedFiles)
            });
        };
        //    retrieveUser(successCallback, errorCallback, user = null) {
        //     const { email } = this.state;
        //     if (email) {
        //         API.request('user/retrieveOne', {
        //             col: 'email',
        //             value: email
        //         }, response => {
        //             if (response && response.data) {
        //                 this.setState({
        //                     user: response.data,
        //                 }, () => {
        //                 });

        //                 if (response.data.account_type == 'new') {
    
        //                     this.uploadFile(response.data)
        //                 } else {
        //                     this.setState({
        //                         errorMessage: "This email already has an existing application"
        //                     });
        //                     // successCallback(true, response.data);
        //                 }
        //             } else {
        //                 this.setState({
        //                     errorMessage: "Email Not Found"
        //                 });
        //             }
        //         }, error => {
        //             errorCallback(error);
        //         });
        //     } else {
        //         errorCallback(new Error('Email is not provided'));
        //     }
        // }
        handleDiscard(){
            this.setState({
                showModal: this.props,
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
                errorMessage: null,
                overwriteModal: false,
                discardModal: false,
                fileToOverwrite: null,
                fileToUpload: null,
                emailRetrieved: false
            });
        }
        retrieveUser(){
            const { email } = this.state;
            if(email){
                API.request('user/retrieveOne', {
                                col: 'email',
                                value: email
                            }, response => {
                                if (response && response.data) {
                                    if(response.data.account_type != 'new'){
                                        this.setState({
                                            errorMessage: "This email already has an existing application"
                                        });
                                    }else{
                                        this.setState({
                                            user: response.data,
                                            errorMessage: "",
                                            emailRetrieved: true // Set emailRetrieved to true
                                        }, () => {
                                        });
                                    }
                                } else {
                                    this.setState({
                                        errorMessage: "Email Not Found"
                                    });
                                }
                            }, error => {
                                // errorCallback(error);
                            });
            }else{
                this.setState({
                    errorMessage: "Field is blank"
                });
            }
        }
        uploadFile() {
            const { selectedFiles, user } = this.state;
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
                 alert("File(s) uploaded to server")
               } else {
                alert("There has been an error uploading your files to the server. Please try again")
                this.handleDiscard()
               }
            }, error => {
               console.log(error);
            });
           }
                   
    render() {
        const {errorMessage, overwriteModal, selectedFiles} = this.state
        const hasFilesSelected = Object.values(selectedFiles).some(file => file !== null);
        return (
            <div>
                
                <Breadcrumb
                    header={"Create New Application"}
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
                            className={errorMessage ? "error" : ""}
                            type={'email'}
                            label={'Email'}
                            placeholder={'Enter Registered Email'}
                            locked={false}
                            active={true}
                            onChange={(value) => {
                                this.setState({
                                    errorMessage: null,
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
                    {errorMessage === "" && (
                        <>
                        <Row className='sectionHeader'>
                        <p>File Uploads</p>
                    </Row>
                    {
                        files.map((item, index)=>{
                            return(
                                <div>
                                    
                                        <Row className='Row' key={index}>
                                            <Col style={{
                                                justifyContent: 'start',
                                                display: 'flex'
                                            }} md={4}>
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
                        </>
                    )}
                    {!hasFilesSelected  && !this.state.emailRetrieved && (
                        <>
                        <Row className='sectionHeader'> 
                        <Col className='options'>
                            <Button onClick={()=>{this.retrieveUser()}}>
                                Find Email
                            </Button>
                        </Col>
                        </Row>
                        </>
                    )}
                    {hasFilesSelected && (
                        <>
                        <Row className='sectionHeader'> 
                        <Col className='options'>
                            <Button variant="danger" onClick={()=>{this.setState({ discardModal: true})}}>
                                Discard
                            </Button>
                            <Button onClick={()=>{this.uploadFile()}}>
                                Create Applicant
                            </Button>
                        </Col>
                        </Row>
                        </>
                    )}
                    
                    </Container>
                   
                    
                </div> 
                <WarningModal
                    show={this.state.overwriteModal}
                    message={"Are you sure you want to overwrite uploaded file?"}
                    onContinue={this.handleFileOverwrite}
                    onHide={() => this.setState({ overwriteModal: false })}
                />
                <WarningModal
                    show={this.state.discardModal}
                    onContinue={()=>{this.handleDiscard()}}
                    message={"Are you sure you want to discard everything"}
                    onHide={() => this.setState({ discardModal: false })}
                />
            </div>
        )
    }
}

export default newApplicant
