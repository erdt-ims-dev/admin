import React, { Component } from 'react'
import { Navbar, Container, Breadcrumb } from 'react-bootstrap'
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"
import banner  from 'assets/img/usc-login.jpeg'
export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: null
        };
      }
    render() {
        return (
            <div>
                <Carousel showArrows={true} 
                // onChange={onChange} 
                // onClickItem={onClickItem} 
                // onClickThumb={onClickThumb}
                >
                <div>
                    <img src={banner} />
                </div>
                </Carousel>
            </div>
        )
    }
}

export default Home