import React, { Component } from 'react'
import 'modules/applications/applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faChevronDown, faChevronUp, faFilePdf, faMagnifyingGlass, faPen, } from '@fortawesome/free-solid-svg-icons'
import Breadcrumb from 'modules/generic/breadcrumb';
import InputFieldV4 from 'modules/generic/inputV4';
import InputFieldV3 from 'modules/generic/inputV3';
import WarningModal from 'modules/generic/warningModalV2'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import placeholder from 'assets/img/placeholder.jpeg'
import { Button, Modal } from 'react-bootstrap';
import API from 'services/Api'
import { connect } from 'react-redux'; // Import connect from react-redux
import 'modules/applications/editModal/style.css'
import { toast } from 'react-toastify'; // Import toast from react-toastify

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

class EditModal extends Component {
    constructor(props) {
        super(props);
        this.fileInputs = {};
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
          errorConfirm: null,
        //   Id: props.setData.id,
          data: null, 
          setEmail: null,
          selectedFiles: {
            tor: null,
            birth_certificate: null,
            narrative_essay: null,
            medical_certificate: null,
            nbi_clearance: null,
            admission_notice: null,
          },
            fileToOverwrite: null,
            fileToUpload: null,
            overwriteModal: false,
            discardModal: false,
            isCollapsed: true,

            // added alias mapping
            aliasToTitle: {},
            // Modified state checker
            hasChanges: false,
        };
        
      }
      componentDidMount() {
        const { setData } = this.props;
        if (setData && setData!== null) {
            this.getComment();
        }
        const aliasToTitle = {};
        files.forEach(file => {
            aliasToTitle[file.alias] = file.title;
        });
        this.setState({ aliasToTitle });
    }
    
    componentDidUpdate(prevProps) {
        // Check if setData has changed and now contains non-null values
        if (!prevProps.setData || prevProps.setData === null || this.props.setData!== prevProps.setData) {
            this.getComment();
        }
    }
    toggleFilesSectionVisibility() {
        this.setState(prevState => ({
            isCollapsed:!prevState.isCollapsed,
        }));
    };
    getComment() {
        const { setData } = this.props;
    
        // Ensure setData is not null before proceeding
        if (!setData) {
            return; // Exit the function early if setData is null
        }
    
        API.request('comments/retrieveWithAccountDetails', {
            id: setData.id,
        }, response => {
            // Trigger loading state to false after the API call is completed
            this.props.setIsLoadingV2(false);
            if (response && response.data) {
                this.setState({
                    comment: response.data.message ? response.data.message : ""
                })
            } else {
                console.log('error on retrieve');
            }
        }, error => {
            this.props.setIsLoadingV2(false);
            console.log(error);
        });
    }
    handleHide(){
        this.setState({
            isCollapsed: true
        })
        this.props.onHide()
    }

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
                hasChanges: true,
            }), () => {
                // Optionally, you can close the file selection window here
            });
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

        handleWarning = () => {
            this.setState({
                overwriteModal: false
            })
        }
        uploadFile() {
            if (!this.state.hasChanges) {
                toast.warn("No changes made.");
                return;
            }
            const { selectedFiles, aliasToTitle } = this.state;
            const { setData } = this.props;
            let formData = new FormData();
            console.log('id', setData)
            // Append user_id to the FormData
            formData.append('account_details_id', setData.account_details_id);
        
            // Loop through each file and check if it's a PDF
            for (const [field, fileData] of Object.entries(selectedFiles)) {
                if (fileData && fileData.file) {
                    const file = fileData.file;

                    // Check if the file type is PDF
                    if (file.type !== 'application/pdf') {
                        const fieldTitle = aliasToTitle[field] || field; // Use title from aliasToTitle, fallback to alias
                        toast.error(`"${file.name}" is not a PDF file. Please upload PDF files only in the "${fieldTitle}" field.`);
                        return; // Stop the function if a non-PDF file is found
                    }
                    
                    // Append each valid file with its field name as the key
                    formData.append(field, file);
                }
            }
        
            // Set loading to true before starting the API call
            this.props.setIsLoadingV2(true);
        
            // Make a single API call with all files
            API.uploadFile('account_details/uploadViaScholar', formData, response => {
                // Set loading to false after the API call is completed
                this.props.setIsLoadingV2(false);
        
                if (response && response.data) {
                    toast.success("File(s) uploaded successfully!");
                    // this.props.setDetails(response.details)
                    this.handleDiscard();
                    this.props.refreshList();
                    this.props.onHide();
                } else {
                    toast.error("Error uploading files to the server. Please try again.");
                    this.handleDiscard();
                }
            }, error => {
                this.props.setIsLoadingV2(false);
                toast.error("Upload failed. Check your connection or try again.");
                console.log(error);
            });
        }
        handleDiscard(){
            this.setState({
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
            data: null, 
            setEmail: null,
            selectedFiles: {
            tor: null,
            birth_certificate: null,
            narrative_essay: null,
            medical_certificate: null,
            nbi_clearance: null,
            admission_notice: null,
            },
            fileToOverwrite: null,
            fileToUpload: null,
            overwriteModal: false,
            discardModal: false
            });
        }
        viewFile = (alias) => {
            const { selectedFiles } = this.state;
            const { fileURL } = selectedFiles[alias] || {}; // Use an empty object as a fallback
            if (fileURL) {
               // Display the file using the fileURL
               window.open(fileURL, '_blank');
            } else {
                toast.warn("No file selected for viewing.");
            }
           };

    render() {
        const { selectedFiles} = this.state
        const {setData} = this.props
    return (
        <div className=''>
            {/* <div className="headerStyle"><h2>LEAVE REQUESTS</h2></div> */}
    <Modal
      show={this.props.show}
      onHide={()=>{this.handleHide()}}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header style={{
        backgroundColor: '#f1f5fb'
      }}>
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
            <Col xs={9} className="text-left">
                <p style={{fontWeight: 'bold'}}>File Uploads</p>
            </Col>
            <Col xs={3} className="text-right d-flex justify-content-end align-items-center">
            <FontAwesomeIcon
                icon={this.state.isCollapsed? faChevronDown : faChevronUp}
                onClick={()=>{this.toggleFilesSectionVisibility()}}
                className={`icon ${this.state.isCollapsed? 'collapsed' : ''}`}
            />
            </Col>        
        </Row>
    <hr className='break'></hr>
    <div className={`files-container ${this.state.isCollapsed? '' : 'expanded'}`}>
    { !this.state.isCollapsed &&
        (
            files.map((item, index) => {
            const fileUrl = setData ? setData[item.alias] : ''; // Get the file URL from setData
            return (
                <div key={index}>
                    
                        <Row className='Row'>
                            <Col >
                                <p>{item.title}</p>
                            </Col>
                            
                            <Col  className='switch'>
                            {fileUrl && (
                                <>
                                <div class="contentButton link">
                                        <button onClick={() => {
                                        window.open(fileUrl, '_blank');
                                        }} style={{display: 'flex', alignItems: 'center'}}>
                                        <FontAwesomeIcon icon={faFilePdf} style={{marginRight: 5}} />
                                        <span className="upload-text">Submitted File</span>
                                        </button>
                                    </div>
                                {/* <span 
                                    className='icon'
                                    onClick={() => {
                                        window.open(fileUrl, '_blank');
                                    }}
                                >View Server File</span> */}
                               
                                </>
                                
                            )}
                            
                            </Col>
                            <Col className='switch'>
                                {selectedFiles[item.alias] ? 
                                (
                                    <div class="contentButton link">
                                        <button onClick={() => this.viewFile(item.alias)} style={{display: 'flex', alignItems: 'center'}}>
                                        <FontAwesomeIcon icon={faMagnifyingGlass} style={{marginRight: 5}} />
                                        <span className="upload-text">Preview File</span>
                                        </button>
                                    </div>
                                    // <span className='icon' onClick={() => this.viewFile(item.alias)}>Preview</span>
                                ) 
                                    : ""
                                    
                                }

                            </Col>
                            <Col className='switch'>
                            <input
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(event) => this.handleFileChange(event, item.alias)}
                                ref={(input) => {
                                    this.fileInputs[item.alias] = input;
                                }}
                            />
                            <div class="contentButton link">
                                <button onClick={() => this.handleUpdateClick(item.alias)} style={{display: 'flex', alignItems: 'center'}}>
                                <FontAwesomeIcon icon={faPen} style={{marginRight: 5}} />
                                <span className="upload-text">Update File</span>
                                </button>
                            </div>
                            </Col>

                        </Row>
                </div>
            )
        })
    )
    }
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
        message={"Are you sure you want to discard changes?"}
        button1={"No"}
        button2={"Yes"}
        onContinue={() => {
            this.setState({
            discardModal: false
            })
            this.handleHide()
    }}
        onHide={() => {this.handleDiscard()}}
    />

    </Container>
        
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={()=>{
            this.handleDiscard()
            this.setState({
                discardModal: true
            })
            }}>Discard Changes</Button>
        <Button variant='primary' onClick={()=>{this.uploadFile()}} disabled={!this.state.hasChanges}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
                    
                   
                    
                </div> 
        )
    }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  return {
    setIsLoadingV2: (status) => {
        dispatch({ type: 'SET_IS_LOADING_V2', payload: { status } });
      },
      setDetails: (details) => dispatch({ type: 'SET_DETAILS', payload: { details } }),

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditModal);
