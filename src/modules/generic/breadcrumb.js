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
    render() {
        return (
            <div className='breadcrumbContainer'>
                <div className='breadcrumbHeader'>
                    <h3>
                        {
                            this.props.header
                        }
                    </h3>
                </div>
                <div className='breadcrumbSubheader'>
                    <p>
                        {
                            this.props.subheader
                        }
                    </p>
                </div>  
                
            </div>
        )
    }
}

export default Breadcrumbs