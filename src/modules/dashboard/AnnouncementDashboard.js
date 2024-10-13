import React, { Component } from 'react';
import { connect } from 'react-redux'; // Added for Redux state management
import './style.css';
import Breadcrumb from 'modules/generic/breadcrumb';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { BarChart } from '@mui/x-charts/BarChart';
import API from 'services/Api';
import placeholder from 'assets/img/placeholder.jpeg';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import AnnouncementBubble from './AnnouncementBubble';

class AnnouncementDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: null,
      isLoading: true,
      showModal: false, // For password change modal
      newPassword: '', // New password state
      confirmPassword: '', // Confirm password state
      saveDisabled: true, // Save button state
    };
  }

  componentDidMount() {
    this.getAnnouncements();

    const { user } = this.props;
    // Show password change modal if user is unverified (first-time login)
    if (user && user.status === 'unverified') {
      this.setState({ showModal: true });
      toast.info('Please set your password before proceeding');
    }
  }

  getAnnouncements() {
    API.request('admin_system_message/retrieveViaDashboard', {}, response => {
      if (response && response.data) {
        this.setState({
          messages: response.data,
          isLoading: false,
        });
      } else {
        // Handle case where no data is returned
      }
    }, error => {
      console.log(error);
    });
  }

  validatePasswords = () => {
    const { newPassword, confirmPassword } = this.state;
    // Enable "Save Changes" button only if passwords match and are not empty
    this.setState({ saveDisabled: !(newPassword && confirmPassword && newPassword === confirmPassword) });
  };

  handlePasswordChange = () => {
    const { newPassword, confirmPassword } = this.state;
    const { user, logout } = this.props;

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    // API call to change the password
    API.request('user/updatePassword', {
      new_password: newPassword,
      email: user.email,
    }, response => {
      if (response && response.success) {
        toast.success('Password successfully changed! Please login again');
        logout(); // Logout the user on successful password change
      } else {
        toast.error('Failed to change password');
      }
    }, error => {
      toast.error('An error occurred while changing the password');
    });
  };

  render() {
    const { messages, isLoading, showModal, newPassword, confirmPassword, saveDisabled } = this.state;

    if (isLoading) {
      return (
        <div className=''>
          <Breadcrumb header={"Dashboard"} subheader={"Announcements are posted below"} />
          <Container>
            <AnnouncementBubble isLoading={isLoading} />
            <AnnouncementBubble isLoading={isLoading} />
            <AnnouncementBubble isLoading={isLoading} />
          </Container>
        </div>
      );
    }

    return (
      <div className=''>
        <Breadcrumb header={"Dashboard"} subheader={"Announcements are posted below"} />
        <Container>
          {messages &&
            messages.map((item) => (
              <AnnouncementBubble
                key={item.message.id}
                profilePic={item.profilePicture}
                title={item.message.message_title}
                message={item.message.message_body}
                time={new Date(item.message.created_at).toLocaleString()} // Convert createdAt to readable format
              />
            ))}
        </Container>

        {/* Password Change Modal */}
        <Modal
          show={showModal}
          onHide={() => this.setState({ showModal: false })} // Close modal
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Change Your Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="newPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => this.setState({ newPassword: e.target.value }, this.validatePasswords)}
                />
              </Form.Group>
              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => this.setState({ confirmPassword: e.target.value }, this.validatePasswords)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handlePasswordChange} disabled={saveDisabled}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user, // Map user state from Redux
  };
};

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch({ type: 'LOGOUT' }),
  userActivity: () => dispatch({ type: 'USER_ACTIVITY' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementDashboard);
