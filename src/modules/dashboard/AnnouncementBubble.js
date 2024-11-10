import React, { Component } from 'react'
import './style.css'
import Breadcrumb from 'modules/generic/breadcrumb';

import { Container, Row, Col, Image } from 'react-bootstrap';
import { BarChart } from '@mui/x-charts/BarChart';
import API from 'services/Api'
import placeholder from 'assets/img/placeholder.jpeg'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import { isAfter, subMonths } from 'date-fns';

class AnnouncementBubble extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: null,
        };
      }
    componentDidMount() {
    }
    render() {
        const { profilePic, title, message, time, isLoading } = this.props;
        if(isLoading){
            return (
                <Container fluid className="announcement-container">
                <Row noGutters style={{ alignItems: 'center'}}>
                    <Col style={{
                        display:'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Image src={placeholder} alt="Profile" className="profile-pic" roundedCircle />
                    </Col>
                    <Col className="bubble-content" md={{ span: 9 }} style={{
                    }}>
                        <Col>
                        <Skeleton style={{
                        display: 'flex',
                        justifyContent: 'start',
                        }} width={100}/>
                        <Skeleton style={{
                        display: 'flex',
                        justifyContent: 'start',
                        }} width={100}/>
                        </Col>
                        <Col>
                        <Skeleton count={5}/>
                        </Col>
                            
    
                    </Col>
                    
                </Row>
            </Container>
            );
        }
        return (
            <Container fluid className="announcement-container">
            <Row noGutters style={{alignItems: 'center'}}>
                <Col style={{
                    display:'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Image src={profilePic ? profilePic : placeholder} alt="Profile" className="profile-pic" roundedCircle />
                </Col>
                <Col className="bubble-content" md={{ span: 9 }} style={{
                }}>
                    <Col>
                    <h2 style={{
                        fontWeight: 'bold',
                    }}>{title}</h2>
                    <p style={{
                        display: 'flex',
                        justifyContent: 'start',
                        fontSize: '12px'
                    }}>{time}</p>
                    </Col>
                    <Col>
                    <p style={{
                        display: 'flex',
                        justifyContent: 'start', 
                        textAlign: 'left'
                    }}>{message}</p>
                    </Col>
                        

                </Col>
                
            </Row>
        </Container>
        );
    }
}

export default AnnouncementBubble