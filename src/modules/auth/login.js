import React, { Component } from "react";
import {connect, useDispatch} from 'react-redux'

import { ListGroup } from "react-bootstrap";
import "./style.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import InputField from "../generic/inputV2";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { GoogleLogin } from "@react-oauth/google";
import { withRouter } from "react-router-dom";
// import { useAuth, withAuth } from 'context/AuthContext';

import API from 'services/Api'

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
  startLogin(){
    const {email, password} = this.state;
    
    API.request('login', {
      email, password,
    }, response => {
      if (response && response.data) {
        const user = response.data
        const token = response.token

        this.props.login(user, token)
        // this.props.history.push("/dashboard");
      }
    }, error => {
      console.log(error)
    })
  }
  render() {
    return (
      <div className="loginContainer">
        <div className="loginForm">
          <Container className="LeftFlex">
            <Row className="Row">
              <h3>Welcome</h3>
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
                id={2}
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
              <Button type="button" variant="primary" size="lg" onClick={
                this.startLogin()
              } >
                Sign In
              </Button>
            </Row>
            <Row>{/* Or */}</Row>
            {/* <Row className="Row mx-4">
              <hr></hr>
              <p>Or</p>
            </Row>
            <Row className="Row mx-4">
              <Button variant="secondary" size="lg">
                Sign in via Google
              </Button>
            </Row> */}
          </Container>
          <Container className="">
            <div className="rContainer">
              <Row className="Row">
                <p>About USC-ERDT:IMS</p>
              </Row>
              <Row className="Row">
                USC-ERDT:IMS is an information management system developed by
                DCISM in cooperation with USC-ERDT to manage ERDT
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
  }
}
const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('reduxhandler');
  return {
    login: (user, token) => {dispatch(actions.login(user, token))}
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
