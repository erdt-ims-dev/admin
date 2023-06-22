import React, { Component } from 'react'
import { Navbar, Container, Breadcrumb } from 'react-bootstrap'
import erdt from '../../assets/img/erdtl.png'
import './style.css'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
              <div className='leftContainer'>
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
              <div className='centerContainer'></div>
              <div className='rightContainer'>
              <div>
                <FontAwesomeIcon icon={faBell}/>
              </div>
              </div>
              
            </div>

            // <div className='headerContainer'>
            // <Navbar className="bg-body-tertiary">
            //   <Container className='leftContainer'>
            //     <Navbar.Brand href="/dashboard">
            //       <img
            //         alt="logo.png"
            //         src={erdt}
            //         width="30"
            //         height="30"
            //         className="d-inline-block align-top"
            //       />{' '}
            //       USC ERDT
            //     </Navbar.Brand>
            //   </Container>
            //   <Container className='centerContainer'/>
            //   <Container className='rightContainer'>
            //     <Navbar.Collapse className='justify-content-end'>
            //       <Navbar.Text>
            //         <FontAwesomeIcon icon={faBell}/>
            //       </Navbar.Text>
            //     </Navbar.Collapse>
            //   </Container>
            // </Navbar>
            // </div>
        )
    }
}

export default Header