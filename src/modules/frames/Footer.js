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
                {/* Logo Container */}
                <div className='logo-container'>
                  <img className='footer-logo' src={Bindr} alt="Bindr Logo" />
                </div>
                
                {/* Links Container */}
                <div className='details'>
                  <List>
                    <ListItem disablePadding>
                      <a href='http://home.bindr.site' className='redirectLinkFooter'>Homepage</a>
                    </ListItem>
                    <ListItem disablePadding>
                      <a href='#' className='redirectLinkFooter'>About Us</a>
                    </ListItem>
                    <ListItem disablePadding>
                      <a href='#' className='redirectLinkFooter'>Contact Us</a>
                    </ListItem>
                    <ListItem disablePadding>
                      <a href='https://docs.google.com/document/d/1be0U2HPELZoKW8pRHKb_HjOSI5zjl_MWgQTwRFfwL30/edit' className='redirectLinkFooter'>Documentation</a>
                    </ListItem>
                  </List>
                </div>
              </div>

              {/* Disclaimer */}
              <div className='disclaimer'>
                <p>BINDR @ 2023-2024. All Rights Reserved</p>
              </div>
            </div>
        )
    }
}

export default Footer;
