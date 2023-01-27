import React, { Component } from 'react'
import { ListGroup } from 'react-bootstrap'
import './style.css'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: null
        };
      }
    render() {
        return (
            <div>
              <h1>Login Page</h1>
            </div>

        )
    }
}

export default Login