import React, { Component } from 'react'
import { Navbar, Container, Breadcrumb } from 'react-bootstrap'
import erdt from '../../assets/img/erdt-logo-black.png'
import './style.css'
import { faArrowRightFromBracket, faBars, faBell, faEllipsisV, faGear, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { connect } from 'react-redux'

export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: null
        };
      }
    render() {
      const {details} = this.props
        return (
            <div className='headerContainer'>
              <Container className='left-headerContainer'>
              <FontAwesomeIcon icon={faBars} 
              className='white fa-lg' 
              style={{
                padding: 10
              }}
              onClick={this.props.handleOpenSidebar}/>
              </Container>
              <Container className='right-headerContainer' fluid>
                <Col style={{
                  display: "flex",
                  flexDirection: "row",
                }}>
                  <Col style={{
                    display: "flex",
                    justifyContent: "end",
                    margin: "1%",
                    gap: "5%",
                    padding: "3%"
                  }}>
                  <FontAwesomeIcon icon={faBell} className='white fa-lg' style={{
                    padding: 10
                  }}/>
                  <FontAwesomeIcon icon={faUser} className='white fa-lg' style={{
                    padding: 10
                  }}/>
                  <span  style={{
                    padding: 10,
                    color: "white"
                  }}> Hi {details.first_name ? details.first_name : "User"}!</span>
                  <FontAwesomeIcon icon={faEllipsisV} className='white fa-lg' style={{
                    padding: 10
                  }}/>
                  </Col>
                </Col>
                
                
                
                {/* <Col>
                  <FontAwesomeIcon icon={faBell} className='lg'/>
                </Col> */}
              </Container>
              
            </div>

            
        )
    }
}

const mapStateToProps = (state) => {
  return {
      details: state.details
  };
};

export default connect(mapStateToProps)(Header);