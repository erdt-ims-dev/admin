import React, { Component } from 'react'
import { ListGroup } from 'react-bootstrap'
import './style.css'
import Breadcrumb from '../generic/breadcrumb';
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: null
        };
      }
    render() {
        return (
            <div className='dashboardContainer'>
              <Breadcrumb
              header={"Welcome to ERDT Information Management System"}
              subheader={"Heres the current statistic"}/>
              <div className='cardContainer'>

              </div>
            </div>

        )
    }
}

export default Dashboard