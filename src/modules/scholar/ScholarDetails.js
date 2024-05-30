import { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import Breadcrumb from 'modules/generic/breadcrumb';
import InputField from 'modules/generic/inputV2';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import placeholder from 'assets/img/placeholder.jpeg'
import { Button, Modal } from 'react-bootstrap';
import API from 'services/Api';

const defaultUserData = {
  id: null,
  uuid: null,
  email: '',
  email_verified_at: null,
  status: '',
  account_type: '',
  created_at: '',
  updated_at: '',
  deleted_at: null,
};

function ScholarDetails() {
    const location = useLocation();
    const scholar = location.state.scholar;
    const [activeField, setActiveField] = useState(false);
    const [formData, setFormData] = useState({
      id: scholar.id,
      user_id: scholar.id,
      first_name: scholar.account_details.first_name,
      middle_name: scholar.account_details.middle_name,
      last_name: scholar.account_details.last_name,
      program: scholar.account_details.program,
      email: scholar.email,
      tor: scholar.account_details.tor,
      birth: scholar.account_details.birth_certificate,
      recommendation: scholar.account_details.recommendation_letter,
      essay: scholar.account_details.narrative_essay,
      medical: scholar.account_details.medical_certificate,
      nbi: scholar.account_details.nbi_clearance,
      notice: scholar.account_details.admission_notice,
   });
   console.log("formdata", formData);
    const [userData, setUserData] = useState({});
    console.log("scholar", scholar);
    const files = [
    {
        title: "Transcript of Record",
        disabled: false,
        alias: "tor",
        link: scholar.account_details.tor,
        ref: useRef(scholar.account_details.tor),
    },
    {
        title: "Birth Certificate",
        disabled: false,
        alias: "birth",
        link: scholar.account_details.birth_certificate,
        ref: useRef(scholar.account_details.birth_certificate),
    },
    {
        title: "Recommendation Letter",
        disabled: false,
        alias: "recommendation",
        link: scholar.account_details.recommendation_letter,
        ref: useRef(scholar.account_details.recommendation_letter),
        
    },
    {
        title: "Narrative Essay",
        disabled: false,
        alias: "essay",
        link: scholar.account_details.narrative_essay,
        ref: useRef(scholar.account_details.narrative_essay),
    },
    {
        title: "Medical Cerificate",
        disabled: false,
        alias: "medical",
        link: scholar.account_details.medical_certificate,
        ref: useRef(scholar.account_details.medical_certificate),
    },
    {
        title: "NBI Clearance",
        disabled: false,
        alias: "nbi",
        link: scholar.account_details.nbi_clearance,
        ref: useRef(scholar.account_details.nbi_clearance),
    },
    {
        title: "Admission Notice",
        disabled: false,
        alias: "notice",
        link: scholar.account_details.admission_notice,
        ref: useRef(scholar.account_details.admission_notice),
    },
  ]
 console.log(files);
 const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const letterFile = useRef(null);
  const handleInputChange = (fieldName, value) => {
    setFormData(prevState => ({
        ...prevState,
        [fieldName]: value
    }));
  };
  const handleFileChange = (fieldName, event) => {
    const file = event.target.files[0];
    setFormData((prevState) => ({
      ...prevState,
        [fieldName]: file,
      }));
  };
  const updateDetails = async (e) =>
  {
    e.preventDefault();
    const formData1 = new FormData();
    formData1.append('user_id', formData.user_id);
    formData1.append('id', formData.id);
    formData1.append('first_name', formData.first_name);
    formData1.append('middle_name', formData.middle_name);
    formData1.append('last_name', formData.last_name);
    formData1.append('program', formData.program);
    formData1.append('email', formData.email);
    formData1.append('tor', formData.tor ? formData.tor : files[0].ref.current.files[0]);
    formData1.append('birth_certificate', formData.birth_certificate ? formData.birth_certificate : files[1].ref.current.files[0]);
    formData1.append('recommendation_letter', formData.recommendation_letter ? formData.recommendation_letter : files[2].ref.current.files[0]);
    formData1.append('narrative_essay', formData.narrative_essay ? formData.narrative_essay : files[3].ref.current.files[0]);
    formData1.append('medical_certificate', formData.medical_certificate ? formData.medical_certificate : files[4].ref.current.files[0]);
    formData1.append('nbi_clearance', formData.nbi_clearance ? formData.nbi_clearance : files[5].ref.current.files[0]);
    formData1.append('admission_notice', formData.admission_notice ? formData.admission_notice : files[6].ref.current.files[0]);
    API.uploadFile('account_details/updateDataAndFiles', formData1, response => {
      if (!response.data.error) {
        console.log(formData);
        console.log('Data updated successfully', response.data);
      } else {
        console.log('error on update');
      }
    }, error => {
      console.log(error)
    })
     
    setActiveField(false); 
  }

  useEffect(() => {
    
  }, []); 
  
    return (
      <>
        <Container>
          <Row className='sectionHeader'>
          <p>Account details of User: {scholar.account_details.user_id}</p>

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
                  id={'first_name'}
                  type={'name'}
                  label={'First Name'}
                  placeholder= {scholar.account_details.first_name}
                  locked={false}
                  active={setActiveField}
                  onChange={(value) => handleInputChange('first_name', value)} 
                  onFocus={activeField}
                  name="middle_name"
                  value={formData.first_name}
                  />
              </Col>
              <Col className=''>
                  <InputField
                  id={'middle_name'}
                  type={'name'}
                  label={'Middle Name'}
                  placeholder= {scholar.account_details.middle_name}
                  locked={false}
                  active={setActiveField}
                  onChange={(value) => handleInputChange('middle_name', value)} 
                  onFocus={activeField}
                  name="middle_name"
                  value={formData.middle_name}
                  />
              </Col>
              <Col className=''>
                  <InputField
                  id={'last_name'}
                  type={'name'}
                  label={'Last Name'}
                  placeholder= {scholar.account_details.last_name}
                  locked={false}
                  active={setActiveField}
                  onChange={(value) => handleInputChange('last_name', value)} 
                  onFocus={activeField}
                  name="last_name"
                  value={formData.last_name}
                  />
              </Col>
          </Row>
          <Row className='Row'>
              <Col >
              <InputField
                id={'email'}
                type={'email'}
                label={'email'}
                placeholder= {formData.email}
                locked={false}
                active={setActiveField}
                onChange={(value) => handleInputChange('email', value)} 
                onFocus={activeField}
                name="email"
                value={formData.email}
              />
              </Col>
              <Col>
              <InputField
                  id={3}
                  type={'field'}
                  label={'Program'}
                  placeholder={'Program'}
                  locked={false}
                  active={true}
                  onFocus={activeField}
                  onChange={(value) => handleInputChange('program', value)} 
                  name="program"
                  value={scholar.account_details.program}
                  />
              </Col>
              <Col>
              <InputField
                  id={3}
                  type={'field'}
                  label={'Status'}
                  placeholder={'Status'}
                  locked={true}
                  active={false}
                  onChange={() => {
                      
                    }}
                  value={scholar.status}
                  />
              </Col>
          </Row>
      
      {/* Notification */}
      <hr className='break'/>
      <Row className='sectionHeader'>
          <p>File Uploads</p>
      </Row>
      
      {
        files.map((item, index) => {
          // Correctly format the href using template literals outside of JSX
          
          return (
            
            <div key={index}>
              <Row className='Row'>
                <Col md={4}>
                  <p>{item.title}</p>
                </Col>
                <Col md={4}>
                  {/* Conditionally render the file link */}  {/* <a className='icon' href={fileLink} target='_blank' rel='noopener noreferrer'>View File</a> */}
                  <a href={(item.link !== null) ? item.link : "#"} target="_blank" rel="noreferrer noopener">View File</a>
                </Col>
                <Col md={4} className='switch'>
                  <Col>
                  <input type="file" id="file" name="file" onChange={(event) => handleFileChange(item.link, event)} ref={item.ref} target="_blank" rel="noreferrer noopener"/>
                  </Col>
                  <Col>
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      onChange={(event) => this.handleFileChange(event, item.alias)}
                    />
                    
                  </Col>
                </Col>
              </Row>
            </div>
          );
        })
      }
      <hr className='break'/>
      <Row className='sectionHeader'> 
      <Col md={10}>
      
      </Col>
      <Col md={2}>
          <Button onClick={updateDetails}>
              Update Account
          </Button>
      </Col>
      </Row>
      
      </Container>
      </>
    );
  }
  
  export default ScholarDetails;