import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
import ERDT from "../../assets/img/erdtl.png";
import USCLogo from "../../assets/img/usc.png";
import DCISM from "../../assets/img/dcism.png";
import Circuit from "../../assets/img/circuitboard.png";
import "./style.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

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
    
    
    console.log("1:",firstName, lastName, email, password, confirmPassword)
    console.log("2:",errorFirstName, errorLastName, errorEmail, errorPassword, errorConfirmPassword)
    // Check for missing fields
    if(firstName == null || firstName == '' || lastName == null || lastName == '' || email == null || email == '' || password == null || password == '' || confirmPassword == null || confirmPassword == ''){
      this.setState({errorMessage: 'Please fill in missing fields'})
      return false
    }
    
    
    // Validate Password
    if(this.validatePassword(password) === false) {
      this.setState({errorMessage: 'Passwords should be atleast 8 characters. It must be alphanumeric characters. It should contain 1 number, 1 special character and 1 capital letter.'})
      return
    } else {
      this.setState({errorMessage: null})
    }
    // Check if CPass matches pass
    if (password !== confirmPassword) {
      this.setState({
        errorMessage: 'Passwords do not match'
      })
      return false
    }
    // Requests
    API.request('register', {
      email, password,
      first_name: firstName,
      last_name: lastName,
    }, response => {
      if (response && response.data) (
        console.log(response)
      )
    }, error => {
      console.log(error)
    })
  }
  render() {
    const { firstName, lastName, email, password, confirmPassword} = this.state;
    const { errorFirstName, errorLastName, errorEmail, errorPassword, errorConfirmPassword, errorMessage} = this.state;
    return (
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
              <h3>Hi There</h3>
              <p style={{
                color: "red",
                fontSize: 10
              }}>
                {
                  errorMessage
                }
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
            </Row>
            <Row className="Row mx-4">
              <Button variant="primary" size="lg" onClick={()=>{
                this.submit()
              }}>
                Register
              </Button>
            </Row>
          </Container>
          <Container className="">
            <div className="rContainer">
              <Row className="Row">
                <p>Sign Up for USC-ERDt: IMS</p>
              </Row>
              <Row className="Row">Create a new account to sign in to</Row>
              <Row className="Row">
                <p>Already Have an Account?</p>
              </Row>
              <Row className="Row">
                <p>
                  Sign in <a href="/login">here</a>
                </p>
              </Row>
            </div>
          </Container>
        </div>
      </div>
    );
    // const handleSubmit = (event) => {
    //   event.preventDefault();
    //   console.log(`Email: ${email}, Password: ${password}`);
  }
}

export default withRouter(Register);
