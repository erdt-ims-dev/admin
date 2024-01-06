import React, { Component } from "react";
import { ListGroup } from "react-bootstrap";
import ERDT from "../../assets/img/erdtl.png";
import USCLogo from "../../assets/img/usc.png";
import DCISM from "../../assets/img/dcism.png";
import Circuit from "../../assets/img/circuitboard.png";
import "./style.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import InputField from "../generic/input";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { GoogleLogin } from "@react-oauth/google";
import { withRouter } from "react-router-dom";

import API from '../../services/Api'

// Import history for every new page you create
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      email: null,
      errorEmail: null,
      password: null,
      errorPassword: null,
    };
  }
  login(){
    const {email, password} = this.state;
    const {isLoggedin} = this.props;
    API.request('login', {
      email, password,
    }, response => {
      if (response && response.data) (
        // this.props.isLoggedin == true,
        this.history.push("/dashboard")
      )
    }, error => {
      console.log(error)
    })
  }
  render() {
    const { email, errorEmail, password, errorPassword } = this.state;
    const { history } = this.props;
    return (
      <div className="loginContainer">
        <div className="loginForm">
          <Container className="">
            <Row className="Row">
              <h3>Welcome Back</h3>
            </Row>
            <Row className="Row mx-4">
              <InputField
                id={1}
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
                id={1}
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
              <Button variant="primary" size="lg" onClick={this.login()}>
                Sign In
              </Button>
            </Row>
            <Row>{/* Or */}</Row>
            <Row className="Row mx-4">
              <hr></hr>
              <p>Or</p>
            </Row>
            <Row className="Row mx-4">
              <Button variant="secondary" size="lg">
                Sign in via Google
              </Button>
            </Row>
          </Container>
          <Container className="">
            <div className="rContainer">
              <Row className="Row">
                <p>About USC-ERDT:IMS</p>
              </Row>
              <Row className="Row">
                USC-ERDT:IMS is an information management system developed by
                students of DCISM in cooperation with USC-ERDT to manage ERDT
                Applicants and Scholars
              </Row>
              <Row className="Row">
                <p>
                  Don't have an Account, you can register{" "}
                  <a href="/register">here</a>
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

export default withRouter(Login);
