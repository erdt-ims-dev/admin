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
        };
      }
      
    render() {
      const {email, errorEmail, password, errorPassword} = this.state;
        return (
           <div className=''>
              <div className='loginForm'>
            <Container className=''>
            <Row className='Row'>
              <h3>Hi There</h3>
            </Row>
            <Row className='Row mx-4'>
            <InputField
              id={1}
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
              id={1}
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
              <Button variant='primary' size='lg'>Sign In</Button>
            </Row>
            <Row>
              {/* Or */}
            </Row>
            <Row className='Row mx-4'>
              <hr></hr>
              <p>Or</p>
            </Row>
            <Row className='Row mx-4'>
              <Button variant='secondary' size='lg'>Sign in via Google</Button>
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
                <p>Sign in <a href='#'>here</a></p>
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