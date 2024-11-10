import React, { Component } from 'react'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEye, faX, faComment, faImages, faCheckDouble } from '@fortawesome/free-solid-svg-icons'
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
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faUpload, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify'; // Import toast from react-toastify

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
          newEmail: null,
          errorNewEmail: null,
          password: null,
          errorPassword: null,
          newPassword: null,
          errorNewPassword: null,
          fileInput: null,
          showEmailModal: false,
          showPasswordModal: false,
          warningModal: false,
          selectedProgram: '',
          aliasToTitle: {},

          selectedFiles: {
            tor: null,
            birth_certificate: null,
            narrative_essay: null,
            medical_certificate: null,
            nbi_clearance: null,
            admission_notice: null,
            // added alias mapping
        },
        overwriteModal: false,
        discardModal: false,
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
            profile: this.props.details.profile_picture ? this.props.details.profile_picture : null
        })
        // change alias to title
        const aliasToTitle = {};
        files.forEach(file => {
            aliasToTitle[file.alias] = file.title;
        });
        this.setState({ aliasToTitle });
      }
    //   File Section
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
            if (file.type !== "application/pdf") {
                toast.error("Only PDF files are allowed"); // Display an error message
                return;
              }
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
    handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];
    
        if (file) {
            // Check if the selected file type is valid
            if (!validImageTypes.includes(file.type)) {
                toast.error("Invalid file type. Please upload a PNG or JPEG image.");
                
                // Reset the file input so that the user can select again without needing to clear manually
                event.target.value = null;
                return;
            }
    
            // If the file type is valid, update the state
            this.setState({ fileInput: file });
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
    handleDisregard(){
        this.setState({
            warningModal: false
        })
    }
      
        handleChange = (event) => {
            this.setState({ program: event.target.value });
        };
      handleFileInput = () => {
        // Use the file input reference to trigger the file selection dialog
        // if (this.fileInputRef) {
        //     this.fileInputRef.click();
        // }
        if (this.fileInputRef) {
            this.fileInputRef.onchange = this.handleProfilePictureChange;
            this.fileInputRef.click();
        }
    };
     validateSelectedFiles = () => {
        const { selectedFiles } = this.state;
        // Check if all entries in selectedFiles have both file and fileURL
        return Object.values(selectedFiles).every(
            (fileEntry) => fileEntry && fileEntry.file && fileEntry.fileURL
        );
    };
    // validateSelectedFiles = () => {
    //     const { selectedFiles, files } = this.state;
    //     const missingFiles = [];
    //     console.log("validate")
    //     selectedFiles.forEach((file) => {
    //         const fileEntry = selectedFiles[file.alias];
    
    //         // Check if fileEntry is valid and contains the file and fileURL properties
    //         if (!fileEntry || !fileEntry.file || !fileEntry.fileURL) {
    //             missingFiles.push(file.title); // Add the title of the missing file for clearer messaging
    //         }
    //     });
    
    //     if (missingFiles.length > 0) {
    //         toast.info(`Please upload the following files: ${missingFiles.join(', ')}`);
    //     }
    
    //     // Return true if there are no missing files, else return false
    //     return missingFiles.length === 0;
    // };
    uploadFile() {
        const { aliasToTitle, selectedFiles, user, first_name, middle_name, last_name } = this.state;
        // const missingFiles = this.validateSelectedFiles();
        console.log("validate")

        // if (missingFiles.length > 0) {
        //     // Show specific missing file names
        //     toast.info(`Please upload the following required files: ${missingFiles.join(", ")}`);
        //     return; // Exit the function early if files are missing
        // }
        if (!this.validateSelectedFiles()) {
            toast.info("Please upload all required files.");
            return; // Exit the function early if not validated
        }
        let formData = new FormData();
        // Trigger loading state to true before the API call
        this.props.setIsLoadingV2(true);
        // Append user_id to the FormData
        formData.append('user_id', this.state.user_id);
        formData.append('first_name', first_name);
        if(middle_name) {
            formData.append('middle_name', middle_name);
        }else {
            formData.append('middle_name', "");

        }
        formData.append('last_name', last_name);
        formData.append('program', this.state.program);
        // Loop through each file and append it to the FormData
        Object.entries(selectedFiles).forEach(([field, fileData]) => {
            if (fileData && fileData.file) {
                // Append each file with its field name as the key
                formData.append(field, fileData.file);
            }
        });
    
        // Make a single API call with all files
        API.uploadFile('account_details/setupProfile', formData, response => {
            // Trigger loading state to false after the API call is completed
            this.props.setIsLoadingV2(false);
    
            if (response && response.data !== null) {
                toast.success("Files successfully uploaded to server.");


                this.updateUser()
            } else {
                toast.error("There has been an error uploading your files to the server. Please try again.");
                this.handleDiscard();
            }
        }, error => {
            // Trigger loading state to false in case of an error
            toast.error("There has been an error uploading your files to the server. Check your connection and try again");

            this.props.setIsLoadingV2(false);
            console.log(error);
        });
    }
    
    updateUser(){
        this.props.setIsLoadingV2(true);

        API.uploadFile('user/retrieveEmailAccountDetails', {
        email: this.state.email
        }, response => {
            // Trigger loading state to false after the API call is completed
            this.props.setIsLoadingV2(false);
            // console.log(response)
            if (response && response.data.user && response.data.details ) {
                this.props.updateUser(response.data.user)
                this.props.setDetails(response.data.details)
                this.props.history.push('/dashboard');
            } else {
                toast.error("There has been an error uploading your files to the server. Please try again");
                this.handleDiscard();
            }
        }, error => {
            // Trigger loading state to false in case of an error
            toast.error("There has been an error uploading your files to the server. Check your connection and try again");
            this.props.setIsLoadingV2(false);
            console.log(error);
        });
    }
    
   
    
    // Profile
    uploadProfile(){
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
        
                if (response.data) {
                    toast.success("Profile picture successfully updated.");
                    this.props.setDetails(response.data.data)
                    this.setState({
                        fileInput: null
                    })
                } else {
                    toast.error("There has been an error uploading your files to the server. Please try again.");
                }
            }, error => {
                // Set loading to false in case of an error
                toast.error("There has been an error uploading your files to the server. Check your connection and try again");
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
        const { selectedFiles} = this.state
        const hasFilesSelected = Object.values(selectedFiles).some(file => file !== null);

        const programs = [
            { value: 'MSME', label: 'Masters in Mechanical Engineering' },
            { value: 'MSChE', label: 'Masters in Chemical Engineering' },
            { value: 'MSEE', label: 'Masters in Electrical Engineering' },
            { value: 'MSCpE', label: 'Masters in Computer Engineering' },
            { value: 'MSECE', label: 'Masters in Electronic Communication Engineering' },
            { value: 'MSCE', label: 'Masters in Civil Engineering' },

            { value: 'PhDME', label: 'Doctorate in Mechanical Engineering' },
            { value: 'PhDChE', label: 'Doctorate in Chemical Engineering' },
            { value: 'PhDEE', label: 'Doctorate in Electrical Engineering' },
            { value: 'PhDCpE', label: 'Doctorate in Computer Engineering' },
            { value: 'PhDECE', label: 'Doctorate in Electronic Communication Engineering' },
            { value: 'PhDCE', label: 'Doctorate in Civil Engineering' },
          ];
        const {showModal} = this.state
        return (
            <div>
                {/* <div className="headerStyle"><h2>LEAVE REQUESTS</h2></div> */}
                
                <Breadcrumb
                    header={"Setup profile"}
                    subheader={"Setup your profile"}/>

                <div className='containerBlue'>
                        
                    <Container>
                        <Row className='sectionHeader'>
                        <p style={{fontWeight: 'bold'}}>Profile</p>

                        </Row>
                        <hr className='break'/>

                        <Row className='Row' style={{alignItems: 'center'}}>
                        <Col className='imageCircle'>
                        <div className='overlay'>
                            <img 
                                className='circle' 
                                src={
                                    this.state.fileInput 
                                        ? URL.createObjectURL(this.state.fileInput) 
                                        : this.props.details.profile_picture?.trim() 
                                            ? this.props.details.profile_picture 
                                            : placeholder
                                }
                                alt='profile' 
                                onClick={this.handleFileInput} 
                            />
                            <input 
                                type="file" 
                                accept="image/png, image/jpeg, image/jpg"
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
                                {/* <Button onClick={this.handleFileInput} variant="light"  style={{fontSize: '14px', width: 'auto', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>Update Profile Picture</Button> */}
                                <div class="contentButton link">
                                    <button onClick={this.handleFileInput} style={{display: 'flex', alignItems: 'center'}}>
                                    <FontAwesomeIcon icon={faImages} style={{marginRight: 5}} />
                                    <span className="upload-text">Upload Picture</span>
                                    </button>
                                </div>
                                {
                                    this.state.fileInput && (
                                    // <Button disabled={this.state.fileInput ? false : true} onClick={()=>{this.openWarningModal()}} variant="light"  style={{fontSize: '14px', width: 'auto', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                    // Confirm update
                                    // </Button>
                                    <div class="contentButton link">
                                        <button disabled={this.state.fileInput ? false : true} onClick={()=>{this.openWarningModal()}} style={{display: 'flex', alignItems: 'center'}}>
                                        <FontAwesomeIcon icon={faCheckDouble} style={{marginRight: 5}} />
                                        <span className="upload-text">Confirm</span>
                                        </button>
                                    </div>
                                )}
                            </Col>
                        </Row>
                        
                        <hr className='break'/>
                        <Row className='sectionHeader'>
                        <p style={{fontWeight: 'bold'}}>Update Info</p>
                        </Row>
                        <Row className='Row'>
                            <Col>
                            <InputFieldV4
                                id={1}
                                type={'text'}
                                label={'First Name'}
                                inject={this.state.first_name}
                                locked={false}
                                active={false}
                                onChange={(first_name, error_first_name) => {
                                    this.setState({
                                        first_name, error_first_name
                                    })
                                  }}
                                />
                            </Col>
                            <Col>
                            <InputFieldV4
                                id={2}
                                type={'text'}
                                label={'Middle Name'}
                                inject={this.state.middle_name}
                                locked={false}
                                active={false}
                                onChange={(middle_name, error_middle_name) => {
                                    this.setState({
                                        middle_name, error_middle_name
                                    })
                                  }}
                                />
                            </Col>
                            <Col>
                            <InputFieldV4
                                id={3}
                                type={'text'}
                                label={'Last Name'}
                                inject={this.state.last_name}
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
                        <Row className="Row">
                        <Form >
                        <Form.Group controlId="programSelector" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: 'left'
                        }}>
                        <Form.Label >Select Your Program</Form.Label>
                        <Form.Select value={this.state.program} onChange={this.handleChange}>
                            <option value="">Select...</option>
                            {programs.map((program) => (
                            <option key={program.value} value={program.value}>
                                {program.label}
                            </option>
                            ))}
                        </Form.Select>
                        </Form.Group>
                    </Form>
                        </Row>
                        <hr className='break'/>
                        <Row className='sectionHeader'>
                        <p style={{fontWeight: 'bold'}}>Required File Uploads</p>
                        </Row>
                        <Row className='Row' >
                           

                    {
                        files.map((item, index)=>{
                            return(
                                <div>
                                    
                                        <Row className='Row' key={index} style={{marginBottom: 10}}>
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
                                                {/* {selectedFiles[item.alias] ? (<span className='icon' onClick={() => this.viewFile(item.alias)}>Preview</span>) : ""} */}
                                                {selectedFiles[item.alias] && 
                                                (
                                                <div class="contentButton link">
                                                    <button onClick={() => this.viewFile(item.alias)} style={{display: 'flex', alignItems: 'center'}}>
                                                    <FontAwesomeIcon icon={faMagnifyingGlass} style={{marginRight: 5}} />
                                                    <span className="upload-text">Preview</span>
                                                </button>
                                                </div>
                                                )
                                                }
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
                                                <div class="contentButton link">
                                                <button onClick={() => this.handleUpdateClick(item.alias)} style={{display: 'flex', alignItems: 'center'}}>
                                                    <FontAwesomeIcon icon={faUpload} style={{marginRight: 5}} />
                                                    <span className="upload-text">Upload</span>
                                                </button>
                                                </div>
                                                {/* <span 
                                                className='icon'
                                                onClick={() => this.handleUpdateClick(item.alias)}
                                                >Upload
                                                </span> */}
                                                </Col>
                                            </Col>
                                        </Row>
                                </div>
                            )
                        })
                    }
                    {hasFilesSelected && (

                        <>
                        <hr className='break'/>

                        <Row className='sectionHeader'> 
                        <Col className='options'>
                            <Button variant="danger" onClick={()=>{
                                this.setState({ discardModal: true})
                                
                                }}>
                                Discard
                            </Button>
                            <Button onClick={()=>{this.uploadFile()}}>
                                Submit Application
                            </Button>
                        </Col>
                        </Row>
                        </>
                    )}
                                  
                        </Row>

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
                        this.uploadProfile()
                }}
                    onHide={() => {this.handleDisregard()}}
                />
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(Setup);