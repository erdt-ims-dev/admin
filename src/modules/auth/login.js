import React, { Component } from "react";
import { connect } from 'react-redux';
import "./style.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputField from "modules/generic/inputV2";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { withRouter } from "react-router-dom";
import Helper from 'common/Helper';
import API from 'services/Api';
import { toast } from 'react-toastify';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errorEmail: '',
    errorPassword: '',
    showForgotPasswordModal: false,
    forgotPasswordEmail: '',
    errorforgotPasswordEmail: ''
  };

  startLogin = () => {
    const { email, password } = this.state;

    if (!email) {
      this.setState({ errorEmail: "Please fill in missing field" });
      return;
    }

    if (!password) {
      this.setState({ errorPassword: "Password cannot be blank" });
      return;
    }

    this.setState({ errorPassword: '', errorEmail: '' });
    this.props.setIsLoading(true);

    API.request('login', { email, password }, response => {
      if (response && response.data) {
        this.props.setIsLoading(false);
        const { token, email } = response.data;
        localStorage.setItem(`${Helper.APP_NAME}token`, token);
        this.props.login(response.data, token);
        this.setDetails(email);

        toast.success("Login successful! Welcome back.");
      } else if (response && response.error) {
        this.props.setIsLoading(false);
        this.setState({ errorEmail: response.error });
        toast.error(response.error);
      }
    }, error => {
      this.props.setIsLoading(false);
      console.error(error);
      toast.error("An error occurred during login.");
    });
  };

  setDetails = (email) => {
    API.request('user/retrieveWithAccountDetails', { email }, response => {
      if (response && response.data) {
        this.props.setDetails(response.data);
        this.props.history.push("/dashboard");
      }
    }, error => {
      console.error(error);
    });
  };

  toggleForgotPasswordModal = () => {
    this.setState({ showForgotPasswordModal: !this.state.showForgotPasswordModal });
  };

  handleForgotPasswordSubmit = () => {
    const { forgotPasswordEmail } = this.state;

    if (!forgotPasswordEmail) {
      toast.error("Please enter your email address.");
      return;
    }
    this.props.setIsLoadingV2(true);
    API.request('forgot_password', { email: forgotPasswordEmail }, response => {
      if (response && response.data) {
        this.props.setIsLoadingV2(false);
        toast.success("Password reset instructions have been sent to your email.");
        this.toggleForgotPasswordModal();  // Assuming this function closes the modal
      } else {
        this.props.setIsLoadingV2(false);
        toast.error(response.error || "Failed to send reset instructions.");
      }
    }, error => {
      this.props.setIsLoadingV2(false);
      console.error(error);
      toast.error("An error occurred while sending the reset instructions.");
    });
    
  };

  render() {
    const { errorEmail, errorPassword, showForgotPasswordModal, forgotPasswordEmail } = this.state;

    return (
      <div className="loginContainer">
        <div className="loginForm">
          <Container className="">
            <Row className="">
              <h3 className="">Login</h3>
              <p>Sign in to access your account effortlessly. Enter your credentials below to continue.</p>
            </Row>
            <br/>
            <Row className="">
              <label><b>Email:</b></label>
              {/* <InputField
                id={1}
                type="email"
                label="Enter email here"
                locked={false}
                active={false}
                onChange={(email) => this.setState({ email, errorEmail: '' })}
              /> */}
              <input
                onChange={(e) => this.setState({ email: e.target.value, errorEmail: '' })}
                placeholder="Enter email here"
                type="email"
              />
              <p className="errorText">{errorEmail}</p>
            </Row>
            <Row className="">
              {/* <InputField
                id={2}
                type="password"
                label="Password"
                locked={false}
                active={false}
                onChange={(password) => this.setState({ password, errorPassword: '' })}
              /> */}
              <label><b>Password:</b></label>
              <input
                onChange={(e) => this.setState({ password: e.target.value, errorPassword: '' })}
                placeholder="Enter password here"
                type="password"
              />
              <p className="errorText">{errorPassword}</p>
            </Row>
            <div className="input-item">
              <div className="input-item-checkbox">
                <input type="checkbox" />
                  <p>Keep me signed in</p>
              </div>
              <b onClick={this.toggleForgotPasswordModal}>Forgot password?</b>
            </div>
              {/* <Button className="input-item-button"  onClick={this.startLogin}>Sign In</Button> */}
              <button className="input-item-button" onClick={this.startLogin}>
                Sign In
              </button>
            <Row className="">
              <p className="">
                Don't have an account? &nbsp;
                <a
                  className=""
                  onClick={() => this.props.history.push("/register")}
                >  
                 Register{" "}
                  here
                </a>
              </p>
            </Row>
            <Row className="">
              <p
                className="text-center text-white underline-hover"
                onClick={this.toggleForgotPasswordModal}
              >
                Forgot Password?
              </p>
            </Row>
          </Container>
        </div>

        {/* Forgot Password Modal with theme */}
        <Modal
          show={showForgotPasswordModal}
          onHide={this.toggleForgotPasswordModal}
          centered // Center the modal on the screen
          className="custom-modal" // Custom class for theme styling
        >
          <div style={{ background: "#404041", color: "#f5f5f5", borderRadius: "8px 8px 0px 0px"}} data-bs-theme="dark" className='bg-dark p-2'>
          <Modal.Header closeButton className="">
            <Modal.Title className="custom-modal-title">Forgot Password</Modal.Title>
          </Modal.Header>
          </div>
          <Modal.Body className="custom-modal-body">
            <Form>
              <Form.Group controlId="forgotPasswordEmail">
                <Form.Label>Enter Verified Email address</Form.Label>
                <InputField
                id={4}
                type="email"
                label="Verified Email"
                locked={false}
                active={false}
                onChange={(forgotPasswordEmail) => this.setState({ forgotPasswordEmail, errorforgotPasswordEmail: '' })}
              />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="custom-modal-footer">
            {/* <Button variant="secondary" onClick={this.toggleForgotPasswordModal} className="custom-button">
              Close
            </Button> */}
            <Button variant="success" onClick={this.handleForgotPasswordSubmit} className="custom-button-primary">
              Send Reset Link
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ state });

const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch({ type: 'LOGIN', payload: { user, token } }),
  setDetails: (details) => dispatch({ type: 'SET_DETAILS', payload: { details } }),
  setIsLoading: (status) => dispatch({ type: 'SET_IS_LOADING', payload: { status } }),
  setIsLoadingV2: (status) => dispatch({ type: 'SET_IS_LOADING_V2', payload: { status } }),
  userActivity: () => dispatch({ type: 'USER_ACTIVITY' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
