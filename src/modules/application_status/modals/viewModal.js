import React, { Component } from 'react'
import 'modules/applications/applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faFilePdf, faUpload } from '@fortawesome/free-solid-svg-icons'
import Breadcrumb from 'modules/generic/breadcrumb';
import InputField from 'modules/generic/input';
import InputFieldV4 from 'modules/generic/inputV4';
import InputFieldV3 from 'modules/generic/inputV3';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import placeholder from 'assets/img/placeholder.jpeg'
import { Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import API from 'services/Api'
import 'modules/application_status/style.css'
import { toast } from 'react-toastify'; // Toast notification


const files = [
    {
        title: "Transcript of Record",
        disabled: false,
        key: 'tor'
    },
    {
        title: "Birth Certificate",
        disabled: false,
        key: 'birth_certificate'
    },
    {
        title: "Recommendation Letter",
        disabled: false,
        key: "recommendation_letter"
        
    },
    {
        title: "Narrative Essay",
        disabled: false,
        key: 'narrative_essay'
    },
    {
        title: "Medical Certificate",
        disabled: false,
        key: 'medical_certificate'
    },
    {
        title: "NBI Clearance",
        disabled: false,
        key: 'nbi_clearance'
    },
    {
        title: "Admission Notice",
        disabled: false,
        key: 'admission_notice'
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
          errorConfirm: null,
        //   Id: props.setData.id,
          data: null, 
          setEmail: null,
          comment: null,
          isCollapsed: true,

          details: null,
          fileObject: null
        };
      }
      componentDidMount() {
        this.setState({
            details: this.props.details
        })
        this.getFiles(() => {
            // This function will be called after getList successfully retrieves data
            this.setState({
                tableLoader: false,
            });
        });
    }
    getFiles(callback){
        const {details} = this.props;
        this.props.setIsLoadingV2(true);
        API.request('account_details/retrieveWithAccountDetailsWithDetailsId', {
            account_details_id: details.id
          }, response => {
              if (response && response.data) {
                //   toast.success("")
                this.setState({
                    fileObject: response.data
                })
              } else {
                    toast.error("Something went wrong. Please try again")
                  this.setState({
                    tableLoader: false
                  })
                  // Optionally, call the callback function with an error or a specific value
                  if (typeof callback === 'function') {
                      callback(false);
                  }
              }
              this.props.setIsLoadingV2(false);

          }, error => {
            toast.error("Something went wrong. Check your connection and try again")
              this.props.setIsLoadingV2(false);

              // Optionally, call the callback function with an error or a specific value
              if (typeof callback === 'function') {
                  callback(false);
              }
          });
    }
    componentDidUpdate(prevProps) {
        // If details or other relevant props change, update state
        if (this.props.details !== prevProps.details) {
            this.setState({ details: this.props.details });
            if (!this.state.fileObject) {
                this.getFiles();
            }
        }
    }
    toggleFilesSectionVisibility() {
        this.setState(prevState => ({
            isCollapsed:!prevState.isCollapsed,
        }));
    };
    
    handleHide(){
        this.setState({
            isCollapsed: true
        })
        this.props.onHide()
    }
    render() {
        const {details, fileObject} = this.state
    return (
        <div >
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
        View Uploaded Files
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{
        backgroundColor: '#f1f5fb',
        maxHeight: '75vh',
        overflowX: 'hidden',
        overflowY: 'auto'
      }}>
      <Container>
        {/* <Row className='sectionHeader'>
        

        </Row>  

        <Row className='Row'>
            <Col className='imageCircle'>
                <img className='circle' src={details? details.profile_picture : placeholder}></img>
            </Col>
            <Col className='imageText'>
                <p className=''>{details ?  `${details.first_name} ${details.middle_name} ${details.last_name}, ${details.program}` : ''}</p>
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
        </Row> */}
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
    <div  className={`files-container ${this.state.isCollapsed? '' : 'expanded'}`}>
    {!this.state.isCollapsed &&
        files.map((item, index) => {
            const fileUrl = fileObject? fileObject[item.key] : details[item.key];
            return (
                <div key={index}>
                    <Row className='Row'>
                        <Col md={3}>
                            <p>{item.title}</p>
                        </Col>
                        <Col md={3}></Col>
                        <Col md={3}></Col>
                        <Col md={3} className='switch'>
                            {fileUrl && (
                                // <span
                                //     className='icon'
                                //     onClick={() => {
                                //         window.open(fileUrl, '_blank');
                                //     }}
                                // >
                                //     View Uploaded File
                                // </span>
                                <div class="contentButton link">
                                        <button onClick={() => {
                                        window.open(fileUrl, '_blank');
                                        }} style={{display: 'flex', alignItems: 'center'}}>
                                        <FontAwesomeIcon icon={faFilePdf} style={{marginRight: 5}} />
                                        <span className="upload-text">Submitted File</span>
                                        </button>
                                    </div>
                            )}
                        </Col>
                    </Row>
                </div>
            );
        })}
    </div>
    
    </Container>
        
      </Modal.Body>
      <Modal.Footer style={{
        backgroundColor: '#f1f5fb'
      }}>
        <Button variant='secondary' onClick={()=>{this.handleHide()}}>Close</Button>
      </Modal.Footer>
    </Modal>
                    
                   
                    
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
        setIsLoadingV2: (details) => {
          dispatch({ type: 'SET_IS_LOADING_V2', payload: { details } });
        }
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(ViewModal);
