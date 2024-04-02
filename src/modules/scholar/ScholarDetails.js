import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Breadcrumb from 'modules/generic/breadcrumb';
import InputField from 'modules/generic/input';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import placeholder from 'assets/img/placeholder.jpeg'
import { Button } from 'react-bootstrap';
import API from 'services/Api';

const files = [
  {
      title: "Transcript of Record",
      disabled: false,
      alias: "tor"
  },
  {
      title: "Birth Certificate",
      disabled: false,
      alias: "birth"
  },
  {
      title: "Recommendation Letter",
      disabled: false,
      alias: "recommendation"
      
  },
  {
      title: "Narrative Essay",
      disabled: false,
      alias: "essay"
  },
  {
      title: "Medical Cerificate",
      disabled: false,
      alias: "medical"
  },
  {
      title: "NBI Clearance",
      disabled: false,
      alias: "nbi"
  },
  {
      title: "Admission Notice",
      disabled: false,
      alias: "notice"
  },
]

function ScholarDetails() {
    const location = useLocation();
    const scholar = location.state.scholar;
    const [activeField, setActiveField] = useState(false);
    const [formData, setFormData] = useState({
      first_name: scholar.account_details.first_name,
      middle_name: scholar.account_details.middle_name,
      last_name: scholar.account_details.last_name,
      program: scholar.account_details.program,
      email: '',
   });

   //just to set formData.email 
   useEffect(() => {
    API.request('user/retrieveOne', {
      col: 'id',
      value: scholar.id,
    }, response => {
      setFormData(prevState => ({
        ...prevState,
        email: response.data.email,
      }));
    }, error => {
      console.log(error);
    });
 }, []); 
 console.log(formData);

  const handleInputChange = (fieldName, value) => {
    setFormData(prevState => ({
        ...prevState,
        [fieldName]: value
    }));
  };
  const updateDetails = async (e) =>
  {
    e.preventDefault();
    
    API.request('account_details/updateDetails', {
      id: scholar.id,
      //if empty, defaults to original, else, uses form data
      first_name: (formData.first_name === '') ? scholar.account_details.first_name : formData.first_name,
      middle_name: (formData.middle_name === '') ? scholar.account_details.middle_name : formData.middle_name,
      last_name: (formData.last_name === '') ? scholar.account_details.last_name : formData.last_name,
      program: (formData.program === '') ? scholar.account_details.program : formData.program,
    }, response => {
      console.log('Data updated successfully');
    }, error => {
      console.log(error)
    })

    if (formData.email !== '') {
      API.request('user/update', {
        id: scholar.id,
        col: 'email',
        value: formData.email,
      }, response => {
        console.log('email updated successfully');
      }, error => {
        console.log(error)
      })
    }
    setActiveField(false); 
  }
  
    return (
      <>
        {/* <h3>This is your Scholar Details page</h3>
        <p>welcome {scholar.account_details.last_name} </p>
        <p>ID: {scholar.account_details.user_id}</p>
        <p>First Name: {scholar.account_details.first_name}</p>
        <p>Middle Name: {scholar.account_details.middle_name}</p>
        <p>Last Name: {scholar.account_details.last_name}</p>
        <p>Program: {scholar.account_details.program}</p>
        <label >Birth Certificate: {scholar.account_details.birth_certificate}</label>
        <input type="file" id="myfile" name="myfile"></input>
        <br/>
        <label>TOR: {scholar.account_details.tor}</label>
        <input type="file" id="myfile" name="myfile"></input>
        <br/>
        <label>Narrative Essay: {scholar.account_details.narrative_essay}</label>
        <input type="file" id="myfile" name="myfile"></input>
        <br/>
        <label>Recommendation Letter: {scholar.account_details.recommendation_letter}</label>
        <input type="file" id="myfile" name="myfile"></input> */}
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
                                active={true}
                                onChange={(value) => handleInputChange('first_name', value)} 
                                onFocus={true}
                                name="first_name"
                                value={formData.email  }
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
                                value={scholar.account_details.middle_name}
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
                            label={formData.email}
                            placeholder={'Email'}
                            locked={false}
                            active={setActiveField}
                            onFocus={activeField}
                            onChange={(value) => handleInputChange('email', value)} 
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
                                label={'Applicant'}
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
                    <Row className='sectionHeader'>
                        <p>File Uploads</p>
                    </Row>
                    {
                        files.map((item, index)=>{
                            return(
                                <div>
                                    
                                        <Row className='Row' key={index}>
                                            <Col md={4}>
                                                <p>{item.title}</p>
                                            </Col>
                                            <Col md={4}>
                                            
                                            </Col>
                                            <Col md={4} className='switch'>
                                                <Col>
                                                <span className='icon' onClick={() => this.viewFile(item.alias)}>Update</span>

                                                </Col>

                                                <Col>
                                                <input
                                                type="file"
                                                style={{ display: 'none' }}
                                                onChange={(event) => this.handleFileChange(event, item.alias)}
                                                // ref={(input) => {
                                                //     this.fileInputs = { ...this.fileInputs, [item.alias]: input };
                                                //  }}
                                                />
                                                <span 
                                                className='icon'
                                                // onClick={() => this.fileInputs[item.alias].click()}
                                                >Delete
                                                </span>
                                                </Col>
                                            </Col>
                                        </Row>
                                </div>
                            )
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