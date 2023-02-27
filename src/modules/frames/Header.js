import React, { Component } from 'react'
import { Navbar, Container, Breadcrumb } from 'react-bootstrap'
import erdt from '../../assets/img/erdtl.png'
import './style.css'

export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: null
        };
      }
    render() {
        return (
            <div className='headerContainer'>
              <div style={{
                marginLeft: 25,
                marginTop: 10
              }}>
                <img src={erdt} className="logo"/>
              </div>
              <div className='name'>
                <h2>USC-ERDT</h2>
              </div>
            </div>
        )
    }
}

export default Header