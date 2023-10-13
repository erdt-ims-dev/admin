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
           <div className='mainContainer'>
              
           </div>
        )
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   console.log(`Email: ${email}, Password: ${password}`);
        
    }
}

export default Register