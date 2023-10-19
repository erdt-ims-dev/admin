import React, { Component } from 'react'
import { ListGroup } from 'react-bootstrap'
import ERDT from '../../assets/img/erdtl.png'
import USCLogo from '../../assets/img/usc.png'
import DCISM from '../../assets/img/dcism.png'
import Circuit from '../../assets/img/circuitboard.png'
import './style.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import InputField from '../generic/input';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { GoogleLogin } from '@react-oauth/google';
// Import history for every new page you create
import history from "history/browser";
class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: null,
          fname: null,
          errorfName: null,
          lname: null,
          errorlName: null,
          email: null,
          errorEmail: null,
          password: null,
          errorPassword: null,
          password: null,
          errorPassword: null,
          cpassword: null,
          errorcPassword: null
        };
      }
      
    render() {
      const {cpassword, errorcPassword, fName, errorfName, lName, errorlName, email, errorEmail, password, errorPassword} = this.state;
        return (
           <div className='loginContainer'>
              <div className='loginForm'>
            <Container style={{
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              flexDirection: 'column'
            }} className=''>
            <Row className='Row'>
              <h3>Hi There</h3>
            </Row>
            <Row className='Row mx-4' >
            <Col className='Col-Gap-Left'>
              <InputField
                id={1}
                type={'name'}
                label={'First Name'}
                locked={false}
                active={false}
                onChange={(fName, errorfName) => {
                    this.setState({
                      fName, errorfName
                    })
                  }}
                />
            </Col>

            <Col className='Col-Gap-Right'>
              <InputField
                id={2}
                type={'name'}
                label={'Last Name'}
                locked={false}
                active={false}
                onChange={(lName, errorlName) => {
                    this.setState({
                      lName, errorlName
                    })
                  }}
                />
            </Col>
            </Row>

            <Row className='Row mx-4'>
            <InputField
              id={3}
              type={'email'}
              label={'Email'}
              locked={false}
              active={false}
              onChange={(email, errorEmail) => {
                  this.setState({
                    email, errorEmail
                  })
                }}
              />
            </Row>
            <Row className='Row mx-4'>
            <InputField
              id={4}
              type={'password'}
              label={'Password'}
              locked={false}
              active={false}
              onChange={(password, errorPassword) => {
                  this.setState({
                    password, errorPassword
                  })
                }}
              />
            </Row>
            <Row className='Row mx-4'>
            <InputField
              id={5}
              type={'password'}
              label={'Confirm Password'}
              locked={false}
              active={false}
              onChange={(cpassword, errorcPassword) => {
                  this.setState({
                    cpassword, errorcPassword
                  })
                }}
              />
            </Row>
            <Row className='Row mx-4'>
              <Button variant='primary' size='lg'>Register</Button>
            </Row>
            </Container>
            <Container className=''>
              <div className='rContainer'>
              <Row className='Row'>
                <p>Sign Up for USC-ERDt: IMS</p>
              </Row>
              <Row className='Row'>
                Create a new account to sign in to
              </Row>
              <Row className='Row'>
                <p>Already Have an Account?</p>
              </Row>
              <Row className='Row'>
                <p>Sign in <a href='/login'>here</a></p>
              </Row>
              </div>
            </Container>
            </div>
           </div>
        )
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   console.log(`Email: ${email}, Password: ${password}`);
        
    }
}

export default Register