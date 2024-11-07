import React, { Component } from 'react';
import { connect } from 'react-redux'; // Import connect from react-redux
import { toast } from 'react-toastify'; // Import toast from react-toastify

import 'modules/applications/applications.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Breadcrumb from 'modules/generic/breadcrumb';
import InputField from 'modules/generic/input';
import InputFieldV3 from 'modules/generic/inputV3';
import WarningModal from 'modules/generic/warningModalV2';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import placeholder from 'assets/img/placeholder.jpeg';
import { Button } from 'react-bootstrap';
import API from 'services/Api';
import { faUpload, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const files = [
  {
    title: "Transcript of Record",
    disabled: false,
    alias: "tor",
  },
  {
    title: "Birth Certificate",
    disabled: false,
    alias: "birth_certificate",
  },
  {
    title: "Recommendation Letter",
    disabled: false,
    alias: "recommendation_letter",
  },
  {
    title: "Narrative Essay",
    disabled: false,
    alias: "narrative_essay",
  },
  {
    title: "Medical Certificate",
    disabled: false,
    alias: "medical_certificate",
  },
  {
    title: "NBI Clearance",
    disabled: false,
    alias: "nbi_clearance",
  },
  {
    title: "Admission Notice",
    disabled: false,
    alias: "admission_notice",
  },
];
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
        error_last_name: null,
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
        emailRetrieved: false,
      };
    }
  
    viewFile = (alias) => {
      const { selectedFiles } = this.state;
      const { fileURL } = selectedFiles[alias] || {};
      if (fileURL) {
        window.open(fileURL, '_blank');
      } else {
        alert('No file selected for viewing.');
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
        this.setState(
          (prevState) => ({
            selectedFiles: {
              ...prevState.selectedFiles,
              [alias]: { file, fileURL },
            },
          })
        );
      }
    };
  
    handleUpdateClick = (alias) => {
      const existingFile = this.state.selectedFiles[alias];
      if (existingFile) {
        this.setState({
          overwriteModal: true,
          fileToOverwrite: alias,
        });
      } else {
        this.fileInputs[alias].click();
      }
    };
    handleFileOverwrite = (confirm) => {
        const { fileToOverwrite } = this.state;
        if (confirm) {
          this.fileInputs[fileToOverwrite].click();
        } else {
          this.setState({
            overwriteModal: false,
            fileToOverwrite: null,
          });
        }
      };
    
      handleDiscard() {
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
          emailRetrieved: false,
        });
      }
      retrieveUser() {
        const { email } = this.state;
        this.props.setIsLoadingV2(true); // Start loading
    
        if (email) {
          API.request('user/retrieveEmailAccountDetails', { email }, (response) => {
            this.props.setIsLoadingV2(false); // Stop loading
    
            if (response && response.user) {
              if (response.user.account_type !== 'new') {
                this.setState({
                  errorMessage: 'This email already has an existing application or is not eligible',
                });
                toast.error("Email is not eligible or already has an application"); // Show error toast
              } else {
                this.setState({
                  user: response.user,
                  details: response.details,
                  errorMessage: "",
                  emailRetrieved: true,
                });
                toast.success("Email retrieved successfully!"); // Show success toast
              }
            } else {
              this.setState({ errorMessage: 'Error on retrieve, please try again' });
              toast.error("Failed to retrieve email, please try again"); // Show error toast
            }
          }, (error) => {
            this.props.setIsLoadingV2(false); // Stop loading in case of error
            toast.error("Error occurred during email retrieval"); // Show error toast
          });
        } else {
          this.setState({ errorMessage: 'Field is blank' });
          toast.error("Email field is blank!"); // Show error toast
          this.props.setIsLoadingV2(false);
        }
      }
    
      uploadFile() {
        const { selectedFiles, user } = this.state;
        // Check if all required files are uploaded
        const missingFiles = files.filter(item => !selectedFiles[item.alias] || !selectedFiles[item.alias].file);

        if (missingFiles.length > 0) {
            // Show an error toast notification for missing files
            const missingFileTitles = missingFiles.map(file => file.title).join(', ');
            toast.error(`Please upload the following files: ${missingFileTitles}`);
            return;
        }
        let formData = new FormData();
        this.props.setIsLoadingV2(true); // Start loading
    
        formData.append('user_id', user.id); // Append user_id
    
        Object.entries(selectedFiles).forEach(([field, fileData]) => {
          if (fileData && fileData.file) {
            formData.append(field, fileData.file); // Append each file
          }
        });
    
        API.uploadFile('account_details/update', formData, (response) => {
          this.props.setIsLoadingV2(false); // Stop loading
    
          if (response && response.data) {
            toast.success("Files uploaded successfully!"); // Show success toast
            this.props.history.push('/application');
          } else {
            toast.error("Error uploading files, please try again"); // Show error toast
            this.handleDiscard();
          }
        }, (error) => {
          this.props.setIsLoadingV2(false); // Stop loading in case of error
          toast.error("Error occurred during file upload"); // Show error toast
        });
      }
      render() {
        const { errorMessage, selectedFiles, user, details } = this.state;
        const hasFilesSelected = Object.values(selectedFiles).some(file => file !== null);
    
        return (
          <div>
            <Breadcrumb header={"Create New Application"} subheader={"Application Form"} />
    
            <div className="containerBlue" style={{ marginTop: "1%", marginBottom: "1%" }}>
              <Container>
                <Row className="sectionHeader">
                  <p style={{fontWeight: "bold"}}>General Information</p>
                </Row>
                <hr className="break" />
    
                <Row className="Row" style={{alignItems: "center"}}>
                  <Col className="imageCircle">
                    <img className="circle" src={details ? details.profile_picture : placeholder} alt="profile" />
                  </Col>
                  <Col className="imageText d-flex align-items-center justify-content-center">
                  <p>
                    {
                        details
                        ? `${details.first_name} ${details.middle_name ? details.middle_name + ' ' : ''}${details.last_name}`
                        : "Candidate details will be shown here"
                    }
                    </p>

                  </Col>
                </Row>
    
                <Row className="Row">
                  <Col>
                    <InputField
                      id={2}
                      className={errorMessage ? "error" : ""}
                      type={"email"}
                      label={"Email"}
                      placeholder={"Enter Registered Email"}
                      locked={false}
                      active={true}
                      onChange={(value) => this.setState({ errorMessage: null, email: value })}
                    />
                    <p className="errorText">{errorMessage}</p>
                  </Col>
                  {/* <Col>
                    <InputFieldV3 id={3} type={"field"} label={"Type"} inject={"Applicant"} placeholder={"Applicant"} locked={true} />
                  </Col> */}
                </Row>
    
                {/* Notification */}
                <hr className="break" />
                {errorMessage === "" && (
                  <>
                    <Row className="sectionHeader">
                      <p style={{fontWeight: "bold"}}>Required File Uploads</p>
                    </Row>
                    {files.map((item, index) => (
                      <div key={index}>
                        <Row className="Row">
                          <Col md={4} style={{ justifyContent: 'start', display: 'flex' }}>
                            <p>{item.title}</p>
                          </Col>
                          <Col md={4}></Col>
                          <Col md={4} className="switch">
                            <Col>
                            {selectedFiles[item.alias] && 
                            (
                              <div class="contentButton link">
                                <button onClick={() => this.viewFile(item.alias)} style={{display: 'flex', alignItems: 'center'}}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} style={{marginRight: 5}} />
                                <span className="upload-text">Preview</span>
                              </button>
                              </div>
                            )
                            // <span className="icon" onClick={() => this.viewFile(item.alias)}>Preview</span>)
                            }
                            </Col>
                            <Col>
                              <input
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(event) => this.handleFileChange(event, item.alias)}
                                ref={(input) => { this.fileInputs = { ...this.fileInputs, [item.alias]: input }; }}
                              />
                              <div class="contentButton link">
                              <button onClick={() => this.handleUpdateClick(item.alias)} style={{display: 'flex', alignItems: 'center'}}>
                                <FontAwesomeIcon icon={faUpload} style={{marginRight: 5}} />
                                <span className="upload-text">Upload</span>
                              </button>
                              </div>
                              {/* <span className="icon" onClick={() => this.handleUpdateClick(item.alias)}>Upload</span> */}
                            </Col>
                          </Col>
                        </Row>
                      </div>
                    ))}
                    <hr className="break" />
                  </>
                )}
    
                {!hasFilesSelected && !this.state.emailRetrieved && (
                  <Row className="sectionHeader">
                    <Col className="options">
                      <Button onClick={() => this.retrieveUser()}>Find Email</Button>
                    </Col>
                  </Row>
                )}
    
                {hasFilesSelected && (
                  <Row className="sectionHeader">
                    <Col className="options">
                      <Button variant="danger" onClick={() => this.setState({ discardModal: true })}>Discard</Button>
                      <Button onClick={() => this.uploadFile()}>Create Applicant</Button>
                    </Col>
                  </Row>
                )}
              </Container>
            </div>
    
            <WarningModal
              show={this.state.overwriteModal}
              message={"Are you sure you want to overwrite locally uploaded file?"}
              button1={"Discard"}
              button2={"Continue"}
              onContinue={() => { this.handleFileOverwrite(true); this.setState({ overwriteModal: false }); }}
              onHide={() => this.setState({ overwriteModal: false })}
            />
    
            <WarningModal
              show={this.state.discardModal}
              onContinue={() => { this.handleDiscard(); this.props.history.push('/applications'); }}
              button1={"No"}
              button2={"Yes"}
              message={"Are you sure you want to discard everything?"}
              onHide={() => this.setState({ discardModal: false })}
            />
          </div>
        );
      }
    }
    
    const mapStateToProps = (state) => ({ state });
    
    const mapDispatchToProps = (dispatch) => ({
      setIsLoadingV2: (status) => dispatch({ type: 'SET_IS_LOADING_V2', payload: { status } }),
    });
    
    export default connect(mapStateToProps, mapDispatchToProps)(newApplicant);
              