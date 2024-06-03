import React, { Component } from 'react'
import { connect } from 'react-redux'; // Import connect from react-redux

import 'modules/applications/applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Breadcrumb from 'modules/generic/breadcrumb';
import InputField from 'modules/generic/input';
import InputFieldV3 from 'modules/generic/inputV3';
import WarningModal from 'modules/generic/warningModalV2'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import placeholder from 'assets/img/placeholder.jpeg'
import { Button } from 'react-bootstrap';
import API from 'services/Api'
// create new application when 

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
          details: null,
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
        
            if (file) {
                fileURL = URL.createObjectURL(file);
                this.setState(prevState => ({
                    selectedFiles: {
                        ...prevState.selectedFiles,
                        [alias]: { file, fileURL },
                    },
                }), () => {
                    // Optionally, you can close the file selection window here
                });
            }
        };

        handleUpdateClick = (alias) => {
            const existingFile = this.state.selectedFiles[alias];
            if (existingFile) {
                // If a file with the same alias exists, show the overwrite modal
                this.setState({
                    overwriteModal: true,
                    fileToOverwrite: alias,
                });
            } else {
                // If no file exists, proceed to cache the file locally
                this.fileInputs[alias].click();
            }
        };

        handleFileOverwrite = (confirm) => {
            const { fileToOverwrite } = this.state;
            if (confirm) {
                // If the user confirms, proceed with the overwrite
                this.fileInputs[fileToOverwrite].click();
            } else {
                // If the user cancels, close the modal and do nothing
                this.setState({
                    overwriteModal: false,
                    fileToOverwrite: null,
                });
            }
        };
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
        retrieveUser() {
            const { email } = this.state;
            // Trigger loading state to true before the API call
            this.props.setIsLoadingV2(true);
        
            if (email) {
                API.request('user/retrieveEmailAccountDetails', {
                    email: email
                }, response => {
                    // Trigger loading state to false after the API call is completed
                    this.props.setIsLoadingV2(false);
        
                    if (response && response.user) {
                        if (response.user.account_type!== 'new') {
                            this.setState({
                                errorMessage: "This email already has an existing application or is not eligible"
                            });
                        } else {
                            this.setState({
                                user: response.user,
                                details: response.details,
                                errorMessage: "",
                                emailRetrieved: true // Set emailRetrieved to true
                            });
                        }
                    } else {
                        this.setState({
                            errorMessage: "Error on retrieve, please try again"
                        });
                    }
                }, error => {
                    // Trigger loading state to false in case of an error
                    this.props.setIsLoadingV2(false);
                    // errorCallback(error);
                });
            } else {
                this.setState({
                    errorMessage: "Field is blank"
                });
                // Trigger loading state to false if email is not provided
                this.props.setIsLoadingV2(false);
            }
        }
        uploadFile() {
            const { selectedFiles, user } = this.state;
            let formData = new FormData();
            // Trigger loading state to true before the API call
            this.props.setIsLoadingV2(true);
        
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
                // Trigger loading state to false after the API call is completed
                this.props.setIsLoadingV2(false);
        
                if (response && response.data) {
                    alert("File(s) uploaded to server");
                    this.props.history.push('/application');
                } else {
                    alert("There has been an error uploading your files to the server. Please try again");
                    this.handleDiscard();
                }
            }, error => {
                // Trigger loading state to false in case of an error
                this.props.setIsLoadingV2(false);
                console.log(error);
            });
        }
                   
    render() {
        const {errorMessage, selectedFiles, user, details} = this.state
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
                                <img className='circle' src={ details ? details.profile_picture : placeholder} alt='profile'></img>
                            </Col>
                            <Col className='imageText'>
                                <p className=''>{details ? (details.first_name + " " + details.middle_name + " " + details.last_name) : "Candidate details will be shown here"}</p>
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
                                <p className='errorText'>{errorMessage !== "" ? errorMessage : ""}</p>
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
                                                onClick={() => this.handleUpdateClick(item.alias)}
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
                            <Button variant="danger" onClick={()=>{
                                this.setState({ discardModal: true})
                                
                                }}>
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
                    message={"Are you sure you want to overwrite locally uploaded file?"}
                    button1={"Discard"}
                    button2={"Continue"}
                    onContinue={() => {
                        this.handleFileOverwrite(true)
                        this.setState({
                        overwriteModal: false
                    })}
                    }
                    onHide={() => {this.setState({
                        overwriteModal: false
                    })}}
                />
                <WarningModal
                    show={this.state.discardModal}
                    onContinue={()=>{
                        this.handleDiscard()
                        this.props.history.push('/applications')
                    }}
                    button1={"No"}
                    button2={"Yes"}
                    message={"Are you sure you want to discard everything?"}
                    onHide={() => this.setState({ discardModal: false })}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  return {
      setIsLoadingV2: (status) => {
        dispatch({ type: 'SET_IS_LOADING_V2', payload: { status } });
      }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(newApplicant);
