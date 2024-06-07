import React, { Component } from "react";
import {connect} from 'react-redux'
import "./style.css";
import Button from "react-bootstrap/Button";
import InputField from "modules/generic/inputV2";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { GoogleLogin } from "@react-oauth/google";
import { withRouter } from "react-router-dom";
// import { useAuth, withAuth } from 'context/AuthContext';

import Helper from 'common/Helper';

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
  validatePassword(password) {
    const reg = /^(?=(?:.*[A-Z]){1,})(?=(?:.*[a-z]){1,})(?=(?:.*\d){1,})(?=(?:.*[!@#$%^&*()\-_=+{};:,<.>]){1,})([A-Za-z0-9!@#$%^&*()\-_=+{};:,<.>]{6,})$/
    if (reg.test(password) === false) {
      return false;
    } else {
      return true;
    }
  }
  startLogin(){
    const {email, password} = this.state;
   // Check for missing fields
   if(email == '' || email == null){
    this.setState({
      errorEmail: "Please fill in missing field "
    })
    return
   }
   if(password == '' || password == null){
    this.setState({
      errorPassword: "Password cannot be blank "
    })
    return
   }else{
      if(this.validatePassword(password) === false) {
        this.setState({
          errorPassword: 'Passwords should be at least 8 characters. It must be alphanumeric characters. It should contain 1 number, 1 special character and 1 capital letter.'
        })
        return
      } else {
        this.setState({errorPassword: ''})
      }
   }
    
   this.props.setIsLoading(true)
    API.request('login', {  
      email, password,
    }, response => {
      if (response && response.data) {
        this.props.setIsLoading(false)
        const user = response.data
        const token = response.data.token
        localStorage.setItem(`${Helper.APP_NAME}token`, token);
        this.props.login(user, token)
        this.setDetails(response.data.email)
      }else if(response && response.error){
        this.props.setIsLoading(false)
        this.setState({
          errorEmail: response.error
        })
      }
    }, error => {
      this.props.setIsLoading(false)
      console.log(error)
    })
  }
  setDetails(data){
    API.request('user/retrieveWithAccountDetails', {
      email: data
    }, response => {
      if (response && response.data) {
        this.props.setDetails(response.data)
        this.props.history.push("/dashboard");
      }
    }, error => {
      console.log(error)
    })
  }
  render() {
    const {errorEmail, errorPassword} = this.state
    return (
      <div className="loginContainer">
        <div className="loginForm">
          <Container className="LeftFlex">
            <Row className="Row">
              <h3 style={{
                display: 'flex',
                justifyContent: 'center'
              }}>Welcome</h3>
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
                <p className='errorText'>{errorEmail != "" ? errorEmail : ""}</p>
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
                <p className='errorText'>{errorPassword != "" ? errorPassword : ""}</p>
            </Row>
            <Row className="Row mx-4">
              <Button type="button" onClick={()=>{this.startLogin()}} variant="primary" size="lg" >
                Sign In
              </Button>
            </Row>
            <Row className="Row">
            <p style={{
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 25
            }}>
              Don't have an account? Register {" "}
              <a
                style={{
                  color: 'white',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
                onClick={() => { this.props.history.push("/register"); }}
              >
                here
              </a>
            </p>
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
          {/* <Container className="">
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
                  Don't have an Account? you can register{" "}
                  <a href="/register">here</a>
                </p>
              </Row>
            </div>
          </Container> */}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  return {
    login: (user, token) => {
      dispatch({ type: 'LOGIN', payload: { user, token } });
    },
    setDetails: (details) => {
      dispatch({ type: 'SET_DETAILS', payload: { details } });
    },
    setIsLoading: (status) => {
      dispatch({ type: 'SET_IS_LOADING', payload: { status } });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
