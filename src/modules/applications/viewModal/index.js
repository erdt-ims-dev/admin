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
import './style.css'


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
    render() {
        const {data, setEmail} = this.state
        const {setData} = this.props
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
        General Information
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{
        backgroundColor: '#f1f5fb',
        maxHeight: '75vh',
        overflowX: 'hidden',
        overflowY: 'auto'
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
                label={'Latest Staff Comment'}
                inject={this.state.comment}
                locked={true}
                active={false}
                />
            </Col>
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
    <div  className={`files-container ${this.state.isCollapsed? '' : 'expanded'}`}>
    {!this.state.isCollapsed &&
        files.map((item, index) => {
            const fileUrl = setData? setData[item.key] : '';
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
                                    }} style={{display: 'flex', alignItems: 'center', width: '10rem'}}>
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
