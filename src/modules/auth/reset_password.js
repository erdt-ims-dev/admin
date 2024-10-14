import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from 'services/Api';
import { connect } from 'react-redux';
import { Container, Form, Button } from 'react-bootstrap'; // Import Bootstrap components
import './style.css'; // Assuming you have some styles for this component

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            newPassword: '',
            confirmPassword: '',
            errorMessage: ''
        };
    }

    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        const token = query.get('token');
        if (!token) {
            this.setState({ errorMessage: "Invalid token." });
            toast.error("Invalid token.");
        } else {
            this.setState({ token });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { newPassword, confirmPassword, token } = this.state;

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        this.props.setIsLoadingV2(true); // Set loading state to true
        API.request('reset_password', { token, password: newPassword }, response => {
            this.props.setIsLoadingV2(false); // Set loading state to false
            if (response && response.data) {
                toast.success("Password has been reset successfully!");
                // Redirect to login or any other page
                this.props.history.push('/login'); // Example redirect to login page
            } else {
                toast.error(response.error || "Failed to reset password.");
            }
        }, error => {
            this.props.setIsLoadingV2(false); // Set loading state to false
            console.error(error);
            toast.error("An error occurred while resetting the password.");
        });
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        const { newPassword, confirmPassword, errorMessage } = this.state;

        return (
            <Container className="reset-password-container" style={{ maxWidth: '400px', marginTop: '50px' }}>
                <h2 className="text-center mb-4">Reset Password</h2>
                {errorMessage && <p className="error-text text-danger text-center">{errorMessage}</p>}
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="newPassword">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="newPassword"
                            value={newPassword}
                            onChange={this.handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={this.handleChange}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" block>
                        Reset Password
                    </Button>
                </Form>
            </Container>
        );
    }
}

// Map Redux actions to component props
const mapDispatchToProps = (dispatch) => ({
    setIsLoadingV2: (status) => dispatch({ type: 'SET_IS_LOADING_V2', payload: { status } }),
});

// Wrap the component with withRouter and connect to Redux
export default connect(null, mapDispatchToProps)(withRouter(ResetPassword));
