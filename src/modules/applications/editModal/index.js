import React, { Component } from 'react'
import 'modules/applications/applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faChevronDown, faChevronUp, faEye, faUpload } from '@fortawesome/free-solid-svg-icons'
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
            isCollapsed: true
        };
        
      }
      componentDidMount() {
        const { setData } = this.props;
        if (setData && setData!== null) {
            this.getComment();
        }
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
                    comment: response.data.message
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
            const { selectedFiles } = this.state;
            const { setData } = this.props;
            let formData = new FormData();
        
            // Append user_id to the FormData
            formData.append('user_id', setData.user_id);
        
            // Loop through each file and append it to the FormData
            Object.entries(selectedFiles).forEach(([field, fileData]) => {
                if (fileData && fileData.file) {
                    // Append each file with its field name as the key
                    formData.append(field, fileData.file);
                }
            });
        
            // Set loading to true before starting the API call
            this.props.setIsLoadingV2(true);
        
            // Make a single API call with all files
            API.uploadFile('account_details/uploadNewFiles', formData, response => {
                // Set loading to false after the API call is completed
                this.props.setIsLoadingV2(false);
        
                if (response && response.data) {
                    alert("File(s) uploaded to server");
                    this.handleDiscard();
                    this.props.refreshList();
                    this.props.onHide();
                } else {
                    alert("There has been an error uploading your files to the server. Please try again");
                    this.handleDiscard();
                }
            }, error => {
                // Set loading to false in case of an error
                this.props.setIsLoadingV2(false);
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
               alert("No file selected for viewing.");
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
            <Col className='imageCircle'>
                <img className='circle' src={placeholder}></img>
            </Col>
            <Col className='imageText'>
                <p className=''>{setData ?  `${setData.first_name} ${setData.middle_name} ${setData.last_name}, ${setData.program}` : ''}</p>
            </Col>
        </Row>
        <Row className='Row'>
            <Col>
            <InputFieldV4
                id={3}
                type={'field'}
                label={'Staff Comment'}
                inject={this.state.comment}
                locked={true}
                active={false}
                />
            </Col>
        </Row>
        <Row className='Row'>
            <Col xs={9} className="text-left">
                <p>File Uploads</p>
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
                                <span 
                                    className='icon'
                                    onClick={() => {
                                        window.open(fileUrl, '_blank');
                                    }}
                                >View Server File</span>
                               
                                </>
                                
                            )}
                            
                            </Col>
                            <Col className='switch'>
                                {selectedFiles[item.alias] ? (<span className='icon' onClick={() => this.viewFile(item.alias)}>Preview</span>) : ""}

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
                                <span 
                                className='icon'
                                onClick={() => this.handleUpdateClick(item.alias)}
                                >Update
                                </span>
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
        <Button variant='primary' onClick={()=>{this.uploadFile()}}>Save Changes</Button>
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
      }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditModal);
