import React, { Component } from 'react'
import { ListGroup } from 'react-bootstrap'
import ERDT from '../../assets/img/erdtl.png'
import USCLogo from '../../assets/img/usc.png'
import DCISM from '../../assets/img/dcism.png'
import Circuit from '../../assets/img/circuitboard.png'
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
            <div className="bg" style={{
              backgroundImage: Circuit
            }}>
              <div id="login-form">
                <form action="/login" method="post">
                  <div id="main-holder">
                    <h1 id="login-header">LOG IN</h1>
                    <input type="text" id="username" name="username" className="login-form" placeholder="Email" />
                    <input type="password" id="password" name="password" className="login-form" placeholder="Password" />
                    <br />
                    <br />
                    <br />
                    <input type="submit" defaultValue="ENTER" />
                  </div></form>
              </div> 
              <div id="footer">
                <div className="footering">
                  <div className="column">
                    <img src={USCLogo} width={367} height={131} />
                  </div>
                  <div className="column">
                    <img src={DCISM} width={367} height={131} />
                  </div>
                  <div className="column"> </div>
                  <div className="column"> </div>
                </div>
              </div>
              </div>
            </div>

        )
    }
}

export default Login