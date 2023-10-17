import React, { Component } from 'react'
import { Navbar, Container, Breadcrumb } from 'react-bootstrap'
import erdt from '../../assets/img/erdtl.png'
import './style.css'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
              <Container className='left-headerContainer'>
                <img src={erdt} className="logo"/>
              </Container>
              <Container className='right-headerContainer'>
                <Col>
                <p className='headerFont' href='#' onClick={()=> this.props.navigate("/contact")}>Contact us</p>
                </Col>
                <Col>
                <p className='headerFont' href='#' onClick={()=> this.props.navigate("/faq")}>FAQs</p>
                </Col>
                <Col>
                <p className='headerFont' href='#' onClick={()=> this.props.navigate("/faq")}>Documentation</p>
                </Col>
                {/* <Col>
                  <FontAwesomeIcon icon={faBell} className='lg'/>
                </Col> */}
              </Container>
              
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