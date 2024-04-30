import React, { Component } from "react";
import {connect, useDispatch} from 'react-redux'
import "./style.css";
import Button from "react-bootstrap/Button";
import InputField from "../generic/inputV2";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { GoogleLogin } from "@react-oauth/google";
import { withRouter } from "react-router-dom";

import API from '../../services/Api'

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      firstName: null,
      errorFirstName: null,
      lastName: null,
      errorLastName: null,
      email: null,
      errorEmail: null,
      password: null,
      errorPassword: null,
      confirmPassword: null,
      errorConfirmPassword: null,

      errorMessage: ''
    };
  }
  validatePassword(password) {
    const reg = /^(?=(?:.*[A-Z]){1,})(?=(?:.*[a-z]){1,})(?=(?:.*\d){1,})(?=(?:.*[!@#$%^&*()\-_=+{};:,<.>]){1,})([A-Za-z0-9!@#$%^&*()\-_=+{};:,<.>]{6,})$/
    if (reg.test(password) === false) {
      return false;
    } else {
      return true;
    }
  }

  submit(){
    const { firstName, lastName, email, password, confirmPassword} = this.state;
    const { errorFirstName, errorLastName, errorEmail, errorPassword, errorConfirmPassword, errorMessage} = this.state;
    
    const fields = {
      firstName: 'Please fill in missing field',
      lastName: 'Please fill in missing field',
      email: 'Please fill in missing field',
      password: 'Please fill in missing field',
      confirmPassword: 'Please fill in missing field',
   };
    // Check for missing fields
    for (const [field, errorMessage] of Object.entries(fields)) {
      if (this.state[field] == null || this.state[field] === '') {
        this.setState({ [field]: errorMessage });
        return false;
      }
   }
    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|ph|edu)$/;
    if (!emailRegex.test(email)) {
    this.setState({errorEmail: 'Please enter a valid email address with .com, .ph, or .edu domain'});
    return false;
    }
    // Validate Password
    if(this.validatePassword(password) === false) {
      this.setState({
        errorPassword: 'Passwords should be atleast 8 characters. It must be alphanumeric characters. It should contain 1 number, 1 special character and 1 capital letter.'
      })
      return
    } else {
      this.setState({errorPassword: ''})
    }
    // Check if CPass matches pass
    if (password !== confirmPassword) {
      this.setState({
        errorPassword: 'Passwords do not match',
        errorConfirmPassword: 'Passwords do not match'
      })
      return false
    }
    this.props.setIsLoading(true)
    // Requests
    API.request('register', {
      email, password,
      first_name: firstName,
      last_name: lastName,
    }, response => {
      if (response && response.data) {
        this.props.setIsLoading(false)
        alert('Account Created')
        this.props.history.push('/login')
      }else{
        alert('Error on Submit')
        this.props.setIsLoading(false)
      }
    }, error => {
      console.log(error)
    })
  }
  render() {
    const { firstName, lastName, email, password, confirmPassword} = this.state;
    const { errorFirstName, errorLastName, errorEmail, errorPassword, errorConfirmPassword, errorMessage} = this.state;
    return (
      <>
      <div className="loginContainer">
        <div className="loginForm">
          <Container
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              flexDirection: "column",
            }}
            className=""
          >
            <Row className="Row">
              <h3 style={{
                display: 'flex',
                justifyContent: 'center'
              }}>Hi There</h3>
              <p style={{
                color: "red",
                fontSize: 10,
                
              }}>
              </p>
            </Row>
            <Row className="Row mx-4">
              <Col className="Col-Gap-Left">
                <InputField
                  id={1}
                  type={"name"}
                  label={"First Name"}
                  locked={false}
                  active={false}
                  onChange={(firstName, errorFirstName) => {
                    this.setState({
                      firstName,
                      errorFirstName,
                    });
                  }}
                />
                <p className='errorText'>{errorFirstName != "" ? errorFirstName : ""}</p>
              </Col>

              <Col className="Col-Gap-Right">
                <InputField
                  id={2}
                  type={"name"}
                  label={"Last Name"}
                  locked={false}
                  active={false}
                  onChange={(lastName, errorLastName) => {
                    this.setState({
                      lastName,
                      errorLastName,
                    });
                  }}
                />
                <p className='errorText'>{errorLastName != "" ? errorLastName : ""}</p>
              </Col>
            </Row>

            <Row className="Row mx-4">
              <InputField
                id={3}
                type={"email"}
                label={"Email"}
                locked={false}
                active={false}
                onChange={(email, errorEmail) => {
                  this.setState({
                    email,
                    errorEmail,
                  });
                }}
              />
              <p className='errorText'>{errorEmail != "" ? errorEmail : ""}</p>
            </Row>
            <Row className="Row mx-4">
              <InputField
                id={4}
                type={"password"}
                label={"Password"}
                locked={false}
                active={false}
                onChange={(password, errorPassword) => {
                  this.setState({
                    password,
                    errorPassword,
                  });
                }}
              />
                <p className='errorText'>{errorPassword != "" ? errorPassword : ""}</p>
            </Row>
            <Row className="Row mx-4">
              <InputField
                id={5}
                type={"password"}
                label={"Confirm Password"}
                locked={false}
                active={false}
                onChange={(confirmPassword, errorConfirmPassword) => {
                  this.setState({
                    confirmPassword,
                    errorConfirmPassword,
                  });
                }}
              />
                <p className='errorText'>{errorConfirmPassword != "" ? errorConfirmPassword : ""}</p>
            </Row>
            <Row className="Row mx-4">
              <Button variant="primary" size="lg" onClick={()=>{
                this.submit()
              }}>
                Register
              </Button>
            </Row>
            <Row className="Row">
                <p style={{
                display: 'flex',
                justifyContent: 'center',
                color: 'white'
              }}>Already have an account? Sign in{" "} 
              <a href="/login" style={{
                color: "white"
              }}>here</a>
              </p>
              </Row>
          </Container>
        </div>
      </div>
      <div>
        <Container>

        </Container>
      </div>
      </>
      
    );
    
  }
}
const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  return {
    setIsLoading: (status) => {
      dispatch({ type: 'SET_IS_LOADING', payload: { status } });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Register));
