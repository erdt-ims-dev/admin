import React, { Component } from 'react'
import { ListGroup } from 'react-bootstrap'
import ERDT from '../../assets/img/erdtl.png'
import USCLogo from '../../assets/img/usc.png'
import DCISM from '../../assets/img/dcism.png'
import Circuit from '../../assets/img/circuitboard.png'
import './style.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import history from "history/browser";
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: null
        };
      }
    navigate(route){
      this.history.push(route)
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
                <h2>LOGIN</h2>
                <Form.Label></Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                  Input Registered Email
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label></Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Forgot pass?" />
              </Form.Group>
              <Button variant="light" type="submit" 
                onClick={history.push("/dashboard")}
              >
                Enter
              </Button>
            </Form>
            </div>
           </div>
        )
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   console.log(`Email: ${email}, Password: ${password}`);
        
    }
}

export default Login