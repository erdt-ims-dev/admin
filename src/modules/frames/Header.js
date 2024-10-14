import React, { Component } from 'react'
import { Navbar, Container, Breadcrumb } from 'react-bootstrap'
import erdt from '../../assets/img/erdt-logo-black.png'
import './style.css'
import { faArrowRightFromBracket, faBars, faBell, faEllipsisV, faGear, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { connect } from 'react-redux'
import placeholder from 'assets/img/placeholder.jpeg'

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
              className=' fa-lg' 
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
                    alignItems: 'center'
                  }}>
                  {/* <FontAwesomeIcon icon={faBell} className='white fa-lg' style={{
                    padding: 10
                  }}/> */}
                  <div className="profileImageCircle">
                      <img src={details && details.profile_picture? details.profile_picture : placeholder} alt='profile' />
                  </div>

                  {
                    details && (
                      <span style={{ padding: 10}}>
                        Hi {details.first_name || "User"}!
                      </span>
                    )
                  }
                  <FontAwesomeIcon icon={faEllipsisV} className=' fa-lg' style={{
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