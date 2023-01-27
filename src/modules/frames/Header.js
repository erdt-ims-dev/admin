import React, { Component } from 'react'
import { Navbar, Container, Breadcrumb } from 'react-bootstrap'
import image from '../../assets/img/Logowhite.png'
import './style.css'
const link = [
  {
    title: 'Guides',
    route: '',
  },
  {
    title: 'Charges',
    route: '',
  },
  {
    title: 'Locations',
    route: '',
  },
  {
    title: 'Services',
    route: '',
  },
  {
    title: 'Be our Partner',
    route: '',
  },
  {
    title: 'Promos',
    route: '',
  },
  {
    title: 'Stories',
    route: '',
  },]
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
              <div className='headerLogo'>
                <img src={image} style={{
                width: 100,
                height: 100
                }}/>
                
              </div>
              <div className='blank'></div>
              <div className='headerLinks'>
                {
                  link.map((item, index) => {
                   return(
                    <div>
                      <p style={{
                        cursor: 'pointer',
                        margin: '10px'
                      }}>{item.title}</p>
                    </div>
                   ) 
                  }
                )}
              </div>
            </div>
        )
    }
}

export default Header