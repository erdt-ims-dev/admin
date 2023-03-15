import React, { Component } from 'react'
import { Card, ListGroup } from 'react-bootstrap'
import './style.css'
import Breadcrumb from '../generic/breadcrumb';
const data = [
  {
    title: "Total Applicants"
  },
  {
    title: "Total Endorsed Applicants"
  },
  {
    title: "Total Scholars"
  },
  {
    title: "Pending Applications"
  },
  {
    title: "Total Applicants"
  },
  {
    title: "New Scholars This Semester"
  },
]
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
              subheader={"Heres the current statistics"}/>
              <div className='cardContainer'>
                {
                  data.map((item, index)=>{
                    <Card
                    title={item.title}/>
                  })
                }
              </div>
            </div>

        )
    }
}

export default Dashboard