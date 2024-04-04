import React, { Component } from 'react'
import { Container, ListGroup } from 'react-bootstrap'
import ERDT from '../../assets/img/erdtl.png'
import USCLogo from '../../assets/img/usc.png'
import DCISM from '../../assets/img/dcism.png'
import './style.css'
import { ListItem, List, ListItemButton, ListItemText } from '@mui/material';
export class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: null
        };
      }
    render() {
        return (
            <Container className='footerContainer'>
              {/* <div className='footerContent'> */}
              <div className='uscLogo'>
              <img src={USCLogo} />
              </div>
              <div className='deptLogo'>
                <img src={DCISM}/>
              </div>
              <div className='details'>
              <List>
                <ListItem disablePadding>
                    <ListItemText primary="Contact" style={{
                      color: 'white'
                    }}/>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemText primary="FAQs" style={{
                      color: 'white'
                    }}/>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemText primary="Documentation" style={{
                      color: 'white'
                    }}/>
                </ListItem>
              </List>
              </div>
              <div className='disclaimer'>
                <p>ERDT-IMS @ 2023-2024. All Rights Reserved</p>
              </div>
              {/* </div> */}
              
            </Container>
        )
    }
}

export default Footer