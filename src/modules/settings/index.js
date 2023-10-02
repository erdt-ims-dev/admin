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
const notification = [
    {
        title: "Show Notifications for Incoming Applicants",
        disabled: false
    },
    {
        title: "Show Notifications for Endorsed Applicants",
        disabled: false
    },
    {
        title: "Show Notifications for Coordinator Approved Applicants",
        disabled: false
    },
]

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
                        <Row className='sectionHeader'>
                        <p>General Settings</p>

                        </Row>
                        <hr className='break'/>

                        <Row className='Row'>
                            <Col className='imageCircle'>
                                <img className='circle' src={placeholder}></img>
                            </Col>
                            <Col className='imageText'>
                                <p className=''>This will be the profile picture displayed</p>
                            </Col>
                        </Row>
                        <Row className='Row'>
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
                                id={2}
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
                        <Row className='Row'>
                            <Col>
                            <InputField
                                id={3}
                                type={'field'}
                                label={'Admin'}
                                locked={true}
                                active={false}
                                />
                            </Col>
                            <Col>
                            <InputField
                                id={3}
                                type={'field'}
                                label={'Active'}
                                locked={true}
                                active={false}
                                
                                />
                            </Col>
                        </Row>
                    <hr className='break'/>
                    <Row className='sectionHeader'>
                        <p>Notification Settings</p>
                    </Row>
                    {
                        notification.map((item, index)=>{
                            return(
                                <div>
                                    
                                        <Row className='Row'>
                                            <Col md={4}>
                                                <p>{item.title}</p>
                                            </Col>
                                            <Col md={4}>
                                            
                                            </Col>
                                            <Col md={4} className='switch'>
                                            <input className="tgl tgl-skewed" id={"cb" + index} type="checkbox"/>
                                            <label class="tgl-btn" data-tg-off="OFF" data-tg-on="ON" for={"cb" + index}></label>
                                            </Col>
                                        </Row>
                                </div>
                            )
                        })
                    }
                    </Container>
                   
                    
                </div> 
            </div>
        )
    }
}

export default Settings