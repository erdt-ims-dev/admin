import React, { Component } from 'react'
import Card from 'react-bootstrap/Card';
import './style.css'
import Breadcrumb from 'modules/generic/breadcrumb';

import API from 'services/Api'
// temporary data, will be using API to retrieve future data

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: null,
          applicant_count: 0,
          endorsed_count: 0,
          total_scholars: 0,
          pending_applications: 0,
          total_applicants: 0,
          new_scholars: 0
        };
      }
    componentDidMount() {
      this.getApplicantCount()
    }
    getApplicantCount(){
      API.request('users/retrieveByParameter', {
        col: 'account_type',
        value: 'applicant',
      }, response => {
        if (response && response.data) {
         this.setState({
          applicant_count: response.data.count()
         })
        }
      }, error => {
        console.log(error)
      })
    }
    render() {
      const {applicant_count, endorsed_count, total_scholars, total_applicants, pending_applications, new_scholars} = this.state
      const data = [
        {
          title: "Total Applicants",
          count:  applicant_count
        },
        {
          title: "Total Endorsed Applicants",
          count: endorsed_count
        },
        {
          title: "Total Scholars",
          count: total_scholars
        },
        {
          title: "Pending Applications",
          count: pending_applications
        },
        {
          title: "Total Applicants",
          count: total_applicants
        },
        {
          title: "New Scholars This Semester",
          count: new_scholars
        },
      ]
        return (
            <div className='dashboardContainer'>
              <Breadcrumb
              header={"Welcome to ERDT Information Management System"}
              subheader={"Heres the current statistics"}/>
              <div className='cardContainer'>
                {
                  // See dynamic list rendering in react. .map() function in JS also documents this method
                  data.map((item, index)=>{
                    return(
                      <Card style={{ width: '18rem' }}>
                        <Card.Body>
                          <Card.Title>{item.count}</Card.Title>
                          <Card.Text>
                            {
                              item.title
                            }
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    )
                  })
                }
              
        </div>
            </div>

        )
    }
}

export default Dashboard