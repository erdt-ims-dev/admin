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


function ScholarDetails() {
    const location = useLocation();
    const scholar = location.state.scholar;
    const [activeField, setActiveField] = useState(false);
    const [formData, setFormData] = useState({
      first_name: scholar.account_details.first_name,
      middle_name: scholar.account_details.middle_name,
      last_name: scholar.account_details.last_name,
      program: scholar.account_details.program,
      email: scholar.email,
   });
    const [userData, setUserData] = useState({});
    console.log(scholar);
    const files = [
    {
        title: "Transcript of Record",
        disabled: false,
        alias: "tor",
        link: "",
        ref: useRef(scholar.account_details.tor),
    },
    {
        title: "Birth Certificate",
        disabled: false,
        alias: "birth",
        link: "",
        ref: useRef(scholar.account_details.birth),
    },
    {
        title: "Recommendation Letter",
        disabled: false,
        alias: "recommendation",
        link: "",
        ref: useRef(scholar.account_details.recommendation),
        
    },
    {
        title: "Narrative Essay",
        disabled: false,
        alias: "essay",
        link: "",
        ref: useRef(scholar.account_details.essay),
    },
    {
        title: "Medical Cerificate",
        disabled: false,
        alias: "medical",
        link: "",
        ref: useRef(scholar.account_details.medical),
    },
    {
        title: "NBI Clearance",
        disabled: false,
        alias: "nbi",
        link: "",
        ref: useRef(scholar.account_details.nbi),
    },
    {
        title: "Admission Notice",
        disabled: false,
        alias: "notice",
        link: "",
        ref: useRef(scholar.account_details.notice),
    },
  ]
 
   //assign links from acc details to files array
   files.forEach(file => {
    if (file.alias in scholar.account_details) {
      file.link = scholar.account_details[file.alias];
    }
  });
 
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
    const formData = new FormData();
    formData.append('user_id', scholar.user_id);
    formData.append('tor', scholar.account_details.tor ? scholar.account_details.tor : files[0].ref.current.files[0]);
    formData.append('birth_certificate', files[1].ref.current.files[0]);
    formData.append('recommendation_letter', files[2].ref.current.files[0]);
    formData.append('narrative_essay', files[3].ref.current.files[0]);
    formData.append('medical_certificate', files[4].ref.current.files[0]);
    formData.append('nbi_clearance', files[5].ref.current.files[0]);
    formData.append('admission_notice', files[6].ref.current.files[0]);
    API.uploadFile('account_details/uploadNewFiles', formData, response => {
      if (response && response.data) {
        console.log(formData);
        console.log('Data updated successfully', response.data);
      } else {
        console.log('error on update');
      }
    }, error => {
      console.log(error)
    })
    
    formData.append('id', scholar.user_id);
    formData.append('first_name', scholar.first_name);
    formData.append('middle_name', scholar.middle_name);
    formData.append('last_name', scholar.last_name);
    formData.append('program', scholar.program);
    API.uploadFile('account_details/updateDetails', formData, response => {
      if (response && response.data) {
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