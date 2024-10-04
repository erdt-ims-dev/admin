import React, { Component } from "react";
import { connect } from 'react-redux';
import "./style.css";
import Button from "react-bootstrap/Button";
import InputField from "modules/generic/inputV2";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { withRouter } from "react-router-dom";
import Helper from 'common/Helper';
import API from 'services/Api';
import { toast } from 'react-toastify'; // Import toast from react-toastify

class Login extends Component {
  state = {
    email: '',
    password: '',
    errorEmail: '',
    errorPassword: '',
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

    this.setState({ errorPassword: '' });
    this.props.setIsLoading(true);

    API.request('login', { email, password }, response => {
      if (response && response.data) {
        this.props.setIsLoading(false);
        const { token, email } = response.data;
        localStorage.setItem(`${Helper.APP_NAME}token`, token);
        this.props.login(response.data, token);
        this.setDetails(email);
        
        // Show success toast
        toast.success("Login successful! Welcome back."); // Add toast notification here
      } else if (response && response.error) {
        this.props.setIsLoading(false);
        this.setState({ errorEmail: response.error });
        toast.error(response.error); // Add toast notification for error
      }
    }, error => {
      this.props.setIsLoading(false);
      console.log(error);
      toast.error("An error occurred during login."); // Add generic error toast
    });
  }

  setDetails = (email) => {
    API.request('user/retrieveWithAccountDetails', { email }, response => {
      if (response && response.data) {
        this.props.setDetails(response.data);
        this.props.history.push("/dashboard");
      }
    }, error => {
      console.log(error);
    });
  }

  render() {
    const { errorEmail, errorPassword } = this.state;

    return (
      <div className="loginContainer">
        <div className="loginForm">
          <Container className="LeftFlex">
            <Row className="Row">
              <h3 className="text-center">Welcome</h3>
            </Row>
            <Row className="Row mx-4">
              <InputField
                id={1}
                type="email"
                label="Email"
                locked={false}
                active={false}
                onChange={(email) => this.setState({ email, errorEmail: '' })}
              />
              <p className="errorText">{errorEmail}</p>
            </Row>
            <Row className="Row mx-4">
              <InputField
                id={2}
                type="password"
                label="Password"
                locked={false}
                active={false}
                onChange={(password) => this.setState({ password, errorPassword: '' })}
              />
              <p className="errorText">{errorPassword}</p>
            </Row>
            <Row className="Row mx-4">
              <Button variant="primary" size="lg" onClick={this.startLogin}>
                Sign In
              </Button>
            </Row>
            <Row className="Row">
              <p
                className="text-center text-white underline-hover"
                onClick={() => this.props.history.push("/forgot-password")}
              >
                Forgot Password?
              </p>
            </Row>
            <Row className="Row">
              <p className="text-white text-center mb-4">
                Don't have an account? Register{" "}
                <a
                  className="underline-hover"
                  onClick={() => this.props.history.push("/register")}
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
  login: (user, token) => dispatch({ type: 'LOGIN', payload: { user, token } }),
  setDetails: (details) => dispatch({ type: 'SET_DETAILS', payload: { details } }),
  setIsLoading: (status) => dispatch({ type: 'SET_IS_LOADING', payload: { status } })
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
