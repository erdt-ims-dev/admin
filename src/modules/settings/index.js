import React, { Component } from 'react'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEye, faX, faComment } from '@fortawesome/free-solid-svg-icons'
import Breadcrumb from '../generic/breadcrumb';
import InputField from '../generic/input';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import placeholder from '../../assets/img/placeholder.jpeg'


const applicants = [
    {name: "Allison Smith", course: "MS-ME", datesubmitted: "2-23-2023"},
    {name: "Lorenzo Scott", course: "MS-CE", datesubmitted: "11-12-2023"},
    {name: "Edward Rose", course: "MS-ME", datesubmitted: "11-12-2023"},
    {name: "Kylie Bradley", course: "MS-CE", datesubmitted: "11-12-2023"},
];


class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
          showModal: false,
          name: null,
          errorName: null,
          email: null,
          errorEmail: null
        };
      }
    render() {
        const {showModal} = this.state
        return (
            <div>
                {/* <div className="headerStyle"><h2>LEAVE REQUESTS</h2></div> */}
                
                <Breadcrumb
                    header={"Settings"}
                    subheader={"View Account Settings"}/>

                <div className='containerBlue'>
                    <Container>
                        <Row className='break'>
                            <Col md={3}>
                            <h4>General Setting</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='imageCircle'>
                                <img className='circle' src={placeholder}></img>
                            </Col>
                            <Col>
                                <span className='imageText'>This will be the profile picture displayed</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col className=''>
                                <InputField
                                id={1}
                                type={'name'}
                                label={'Name'}
                                locked={false}
                                active={false}
                                onChange={(name, errorName) => {
                                    this.setState({
                                      name, errorName
                                    })
                                  }}
                                />
                            </Col>
                            <Col>
                            <InputField
                                id={1}
                                type={'email'}
                                label={'Email'}
                                locked={false}
                                active={false}
                                onChange={(email, errorEmail) => {
                                    this.setState({
                                        email, errorEmail
                                    })
                                  }}
                                />
                            </Col>
                        </Row>
                    </Container>
                </div> 
                {/* <Details
                show={showModal}
                onHide={()=>this.setState({
                    showModal: false
                })}/> */}
            </div>
        )
    }
}

export default Settings