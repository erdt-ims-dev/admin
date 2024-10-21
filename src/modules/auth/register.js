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
import { toast } from 'react-toastify'; // Import toast from react-toastify

class Register extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    errorFirstName: '',
    errorLastName: '',
    errorEmail: ''
  };

  validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|ph|edu)$/;
    return emailRegex.test(email);
  }

  submit = () => {
    const { firstName, lastName, email } = this.state;
    let isValid = true;

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
    } else if (!this.validateEmail(email)) {
      this.setState({ errorEmail: 'Please enter a valid email address with .com or a .usc.edu.ph domain' });
      isValid = false;
    }

    if (isValid) {
      this.props.setIsLoading(true);
      API.request('register', { email, first_name: firstName, last_name: lastName }, 
      response => {
        this.props.setIsLoading(false);
        if (response && response.data) {
          toast.success('Account Created Successfully! Please check your Email'); // Success toast notification
          this.props.history.push('/'); // Redirect to the home page
        } else {
          toast.error(response.error); // Error toast notification
        }
      }, error => {
        this.props.setIsLoading(false);
        console.log(error);
        toast.error('An error occurred during registration.'); // Generic error toast notification
      });
    }
  }

  render() {
    const { firstName, lastName, email, errorFirstName, errorLastName, errorEmail } = this.state;

    return (
      <div className="loginContainer">
        <div className="loginForm">
          <Container className="d-flex flex-column justify-content-center align-content-center">
            <Row className="Row">
              <h3 className="text-center">Hi There</h3>
            </Row>
            <Row className="Row mx-4">
              <Col>
                <InputField
                  id={1}
                  type={"name"}
                  label={"First Name"}
                  locked={false}
                  active={false}
                  onChange={(firstName) => this.setState({ firstName, errorFirstName: '' })}
                />
                <p className='errorText'>{errorFirstName}</p>
              </Col>
              <Col>
                <InputField
                  id={2}
                  type={"name"}
                  label={"Last Name"}
                  locked={false}
                  active={false}
                  onChange={(lastName) => this.setState({ lastName, errorLastName: '' })}
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
                onChange={(email) => this.setState({ email, errorEmail: '' })}
              />
              <p className='errorText'>{errorEmail}</p>
            </Row>
            <Row className="Row mx-4">
              <Button variant="primary" size="lg" onClick={this.submit}>
                Register
              </Button>
            </Row>
            <Row className="Row">
              <p className="text-center text-white mb-4">
                Already have an account? Sign in{" "}
                <a
                  className="underline-hover"
                  onClick={() => this.props.history.push("/")}
                >
                  here
                </a>
              </p>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ state });

const mapDispatchToProps = (dispatch) => ({
  setIsLoading: (status) => dispatch({ type: 'SET_IS_LOADING', payload: { status } })
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Register));
