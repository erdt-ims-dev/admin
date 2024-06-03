import React, { Component } from "react";
import { connect } from 'react-redux';
import "./style.css";
import Button from "react-bootstrap/Button";
import InputField from "../generic/inputV2";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { withRouter } from "react-router-dom";
import API from '../../services/Api';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorFirstName: '',
      errorLastName: '',
      errorEmail: '',
      errorPassword: '',
      errorConfirmPassword: '',
      errorMessage: ''
    };
  }

  validatePassword(password) {
    const reg = /^(?=(?:.*[A-Z]){1,})(?=(?:.*[a-z]){1,})(?=(?:.*\d){1,})(?=(?:.*[@#$%^&*()\-_=+{};:,<.>]){1,})([A-Za-z0-9@#$%^&*()\-_=+{};:,<.>]{8,})$/;
    return reg.test(password);
  }

  submit() {
    let isValid = true;
    const { firstName, lastName, email, password, confirmPassword } = this.state;

    if (!firstName) {
      this.setState({ errorFirstName: 'Please fill in missing field' });
      isValid = false;
    }
    if (!lastName) {
      this.setState({ errorLastName: 'Please fill in missing field' });
      isValid = false;
    }
    if (!email) {
      this.setState({ errorEmail: 'Please fill in missing field' });
      isValid = false;
    }
    if (!password) {
      this.setState({ errorPassword: 'Please fill in missing field' });
      isValid = false;
    }
    if (!confirmPassword) {
      this.setState({ errorConfirmPassword: 'Please fill in missing field' });
      isValid = false;
    }
    if (password!== confirmPassword) {
      this.setState({ errorPassword: 'Passwords do not match', errorConfirmPassword: 'Passwords do not match' });
      isValid = false;
    }
     // Validate email
     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|ph|edu)$/;
     if (!emailRegex.test(email)) {
     this.setState({errorEmail: 'Please enter a valid email address with .com or a .usc.edu.ph domain'});
     return false;
     }
    if (!this.validatePassword(password)) {
      this.setState({ errorPassword: 'Passwords should be at least 8 characters. It must be alphanumeric characters. It should contain 1 number, 1 special character, and 1 capital letter.' });
      isValid = false;
    }

    if (isValid) {
      this.props.setIsLoading(true);
      API.request('register', {
        email, password,
        first_name: firstName,
        last_name: lastName,
      }, response => {
        this.props.setIsLoading(false);
        if (response && response.data) {
          alert('Account Created');
          this.props.history.push('/login');
        } else {
          alert('Error on Submit');
        }
      }, error => {
        this.props.setIsLoading(false);
        console.log(error);
      });
    }
  }

  render() {
    const { firstName, lastName, email, password, confirmPassword, errorFirstName, errorLastName, errorEmail, errorPassword, errorConfirmPassword } = this.state;
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
                      this.setState({ firstName, errorFirstName });
                    }}
                  />
                  <p className='errorText'>{errorFirstName}</p>
                </Col>
                <Col className="Col-Gap-Right">
                  <InputField
                    id={2}
                    type={"name"}
                    label={"Last Name"}
                    locked={false}
                    active={false}
                    onChange={(lastName, errorLastName) => {
                      this.setState({ lastName, errorLastName });
                    }}
                  />
                  <p className='errorText'>{errorLastName}</p>
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
                    this.setState({ email, errorEmail });
                  }}
                />
                <p className='errorText'>{errorEmail}</p>
              </Row>
              <Row className="Row mx-4">
                <InputField
                  id={4}
                  type={"password"}
                  label={"Password"}
                  locked={false}
                  active={false}
                  onChange={(password, errorPassword) => {
                    this.setState({ password, errorPassword });
                  }}
                />
                <p className='errorText'>{errorPassword}</p>
              </Row>
              <Row className="Row mx-4">
                <InputField
                  id={5}
                  type={"password"}
                  label={"Confirm Password"}
                  locked={false}
                  active={false}
                  onChange={(confirmPassword, errorConfirmPassword) => {
                    this.setState({ confirmPassword, errorConfirmPassword });
                  }}
                />
                <p className='errorText'>{errorConfirmPassword}</p>
              </Row>
              <Row className="Row mx-4">
                <Button variant="primary" size="lg" onClick={() => this.submit()}>
                  Register
                </Button>
              </Row>
              <Row className="Row">
                <p style={{
                  display: 'flex',
                  justifyContent: 'center',
                  color: 'white',
                  marginBottom: 25
                }}>Already have an account? Sign in{" "}
                  <a href="/login" style={{ color: "white" }}>here</a>
                </p>
              </Row>
            </Container>
          </div>
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