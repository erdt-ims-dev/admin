import React, { Component } from 'react'
import { ListGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


import './style.css'

class Breadcrumbs extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: null
        };
      }
    componentDidMount(){
        this.retreive()
    }
    retreive(){
        let param = {
            
        }
    }
    render() {
        return (
            <div className='cardContainer'>
                <h1>
                    {
                        this.props.title
                    }
                </h1>
            </div>
        )
    }
}

export default Breadcrumbs