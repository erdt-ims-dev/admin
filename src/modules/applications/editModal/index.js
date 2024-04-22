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
import { Button, Modal } from 'react-bootstrap';
import API from 'services/Api'


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
    {
        title: "Program Study",
        disabled: false,
        key: 'program'
    },
]

class EditModal extends Component {
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
          setEmail: null
        };
      }
    componentDidMount() {
        
        // this.updateData();
    }
    
    componentDidUpdate(prevProps) {
        
    }

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
    render() {
        const {data, setEmail} = this.state
        const {setData} = this.props
        console.log("view", setData)
    return (
        <div className=''>
            {/* <div className="headerStyle"><h2>LEAVE REQUESTS</h2></div> */}
    <Modal
      show={this.props.show}
      onHide={this.props.onHide}
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
                <p className=''>{setData ? setData.program : ''}</p>
            </Col>
        </Row>
        <Row className='Row'>
            <Col className=''>
                <InputFieldV3
                id={1}
                type={'name'}
                label={'First Name'}
                inject={setData ? setData.first_name : ''}
                locked={true}
                active={false}
                onChange={(first_name, error_first_name) => {
                    this.setState({
                        first_name, error_first_name
                    })
                    }}
                />
            </Col>
            <Col className=''>
                <InputFieldV3
                id={1}
                type={'name'}
                label={'Middle Name'}
                inject={setData ? setData.middle_name : ''}
                locked={true}
                active={false}
                onChange={(middle_name, error_middle_name) => {
                    this.setState({
                        middle_name, error_middle_name
                    })
                    }}
                />
            </Col>
            <Col className=''>
                <InputFieldV3
                id={1}
                type={'name'}
                label={'Last Name'}
                inject={setData ? setData.last_name : ''}
                locked={true}
                active={false}
                onChange={(last_name, error_last_name) => {
                    this.setState({
                        last_name, error_last_name
                    })
                    }}
                />
            </Col>
        </Row>
        <Row className='Row'>
            {/* <Col>
            <InputField
                id={2}
                type={'email'}
                label={setEmail ? setEmail.email : ""}
                locked={true}
                active={false}
                onChange={(email, errorEmail) => {
                    this.setState({
                        email, errorEmail
                    })
                    }}
                />
            </Col> */}
            <Col>
            <InputFieldV3
                id={3}
                type={'field'}
                label={'Account Type'}
                inject={'Applicant'}
                locked={true}
                active={false}
                />
            </Col>
        </Row>
    <Row className='Row'>
        <p>File Uploads</p>
        
    </Row>
    <hr className='break'></hr>
    {
        files.map((item, index) => {
            const fileUrl = setData ? setData[item.key] : ''; // Get the file URL from setData
            return (
                <div key={index}>
                    
                        <Row className='Row'>
                            <Col md={4}>
                                <p>{item.title}</p>
                            </Col>
                            <Col md={4}>
                            
                            </Col>
                            <Col md={4} className='switch'>
                            {fileUrl && (
                                <>
                                <span 
                                    className='icon'
                                    onClick={() => {
                                        window.open(fileUrl, '_blank');
                                    }}
                                >View Uploaded File</span>
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
                                >Update
                                </span>
                                </>
                                
                                
                            )}
                            </Col>

                        </Row>
                </div>
            )
        })
    }
    </Container>
        
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={this.props.onHide}>Discard Changes</Button>
        <Button variant='primary' onClick={this.props.onHide}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
                    
                   
                    
                </div> 
        )
    }
}

export default EditModal
