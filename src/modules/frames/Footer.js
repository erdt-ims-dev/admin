import React, { Component } from 'react'
import { ListGroup } from 'react-bootstrap'
import ERDT from '../../assets/img/erdtl.png'
import USCLogo from '../../assets/img/usc.png'
import DCISM from '../../assets/img/dcism.png'
import './style.css'

export class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: null
        };
      }
    render() {
        return (
            <div >
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
        )
    }
}

export default Footer