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
          <Container className="">
            <Row className="">
            <h3 className="">Register</h3>
            <p>Register and proceed using the app.</p>
            </Row>
            <br/>
            <Row className="">
              <label><b>First Name:</b></label>
              <input
                onChange={(e) => this.setState({ firstName: e.target.value, errorFirstName: '' })}
                placeholder="Enter first name here"
                type="text"
              />
              <p className="errorText">{errorFirstName}</p>
                {/* <InputField
                  id={1}
                  type={"name"}
                  label={"First Name"}
                  locked={false}
                  active={false}
                  onChange={(firstName) => this.setState({ firstName, errorFirstName: '' })}
                />
                <p className='errorText'>{errorFirstName}</p> */}
            </Row>
            <Row className="">
              <label><b>Last Name:</b></label>
              <input
                onChange={(e) => this.setState({ lastName: e.target.value, errorLastName: '' })}
                placeholder="Enter last name here"
                type="text"
              />
              <p className="errorText">{errorLastName}</p>
                {/* <InputField
                  id={2}
                  type={"name"}
                  label={"Last Name"}
                  locked={false}
                  active={false}
                  onChange={(lastName) => this.setState({ lastName, errorLastName: '' })}
                />
                <p className='errorText'>{errorLastName}</p> */}
            </Row>
            <Row className="">
            <label><b>Email:</b></label>
              <input
                onChange={(e) => this.setState({ email: e.target.value, errorEmail: '' })}
                placeholder="Enter email here"
                type="email"
              />
              <p className="errorText">{errorEmail}</p>
              {/* <InputField
                id={3}
                type={"email"}
                label={"Email"}
                locked={false}
                active={false}
                onChange={(email) => this.setState({ email, errorEmail: '' })}
              />
              <p className='errorText'>{errorEmail}</p> */}
            </Row>
            <Row className="Row">
              {/* <Button variant="primary" size="lg" onClick={this.submit}>
                Register
              </Button> */}
              <button className="input-item-button" onClick={this.submit}>
                Register
              </button>
            </Row>
            <Row className="">
              <p className="">
              Already have an account? Sign in &nbsp;
                <a
                  className=""
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
