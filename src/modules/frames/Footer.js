import React, { Component } from 'react'
import Bindr from 'assets/img/bindr-white-long-alpha.png'
import USCLogo from 'assets/img/usc.png'
import DCISM from 'assets/img/dcism.png'
import './style.css'
import { ListItem, List } from '@mui/material';

export class Footer extends Component {
    render() {
        return (
            <div className='footerContainer'>
              <div className='footerContent'>
              <div className='logo-container'>
                  <div className='logo-item'>
                      <img style={{
                        height: 100,
                        width: 200
                      }} src={USCLogo} alt="USC Logo" />
                  </div>
                  <div className='logo-item'>
                      <img style={{
                        height: 100,
                        width: 200
                      }} src={DCISM} alt="DCISM Logo" />
                  </div>
                  {/* <div className='logo-item'>
                      <img style={{
                        height: 100,
                        width: 250
                      }} src={Bindr} alt="DCISM Logo" />
                  </div> */}
              </div>
              {/* <div className='details'>
              <List className='footerLinks'>
              <ListItem>
                <a href='http://home.bindr.site' className=''>Homepage</a>

                </ListItem>
                {/*<ListItem >
                <a href='#' className='redirectLinkFooter'>About Us</a>
                </ListItem>
                <ListItem >
                  <a href='#' className='redirectLinkFooter'>Contact Us</a>
                </ListItem> 
                <ListItem>
                  <a href='https://docs.google.com/document/d/1be0U2HPELZoKW8pRHKb_HjOSI5zjl_MWgQTwRFfwL30/edit' className=''>Documentation</a>
                </ListItem>
                
              </List>
              </div> */}
              <div className='disclaimer'>
                <p>BINDR @ 2023-2024. All Rights Reserved</p>
              </div>
            </div>
            </div>
        )
    }
}

export default Footer;
