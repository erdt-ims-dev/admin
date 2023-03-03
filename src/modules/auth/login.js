import React, { useState, Component }  from 'react';
import { ListGroup } from 'react-bootstrap'
import ERDT from '../../assets/img/erdtl.png'
import USCLogo from '../../assets/img/usc.png'
import DCISM from '../../assets/img/dcism.png'
import Circuit from '../../assets/img/circuitboard.png'
import './style.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: null
        };
      }
    render() {
        return (
           <div className='loginContainer'>
            <div className='loginForm'>
            <Form style={{
              display: 'flex',
              justifyContent: 'center',
              "flex-direction": 'column'
            }}>
              <Form.Group className="mb-3" controlId="formBasicEmail" style={{
              }}>
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            </div>
           </div>
        )
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   console.log(`Email: ${email}, Password: ${password}`);
  // };

  // return (
  //   <form onSubmit={handleSubmit}>
  //     <div>
  //       <label>Email:</label>
  //       <input
  //         type="email"
  //         value={email}
  //         onChange={(event) => setEmail(event.target.value)}
  //       />
  //     </div>
  //     <div>
  //       <label>Password:</label>
  //       <input
  //         type="password"
  //         value={password}
  //         onChange={(event) => setPassword(event.target.value)}
  //       />
  //     </div>
  //     <button type="submit">Log In</button>
  //   </form>
  // );
}
}
export default Login
