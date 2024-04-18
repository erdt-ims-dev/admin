import React, { Component } from 'react'
import './style.css'
import Breadcrumb from 'modules/generic/breadcrumb';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { BarChart } from '@mui/x-charts/BarChart';
import API from 'services/Api'

import { isAfter, subMonths } from 'date-fns';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: null,
          applicant_count: 0, // how many applied this sem
          endorsed_count: 0,
          total_scholars: 0,
          pending_applications: 0,
          total_applicants: 0, // how many applications overall
          total_approved: 0
        };
      }
    componentDidMount() {
      this.getStatistics()
    }
    getStatistics(){
      API.request('user/retrieveStatistics', {
      }, response => {
        if (response && response.data) {
         this.setState({
          applicant_count: response.data.applicant_count,
          pending_applications: response.data.pending_count,
          endorsed_count: response.data.endorsed_count,
          total_scholars: response.data.scholar_count,
          total_applicants: response.data.total_applications,
          total_approved: response.data.total_approved
         })
        }else{
          this.setState({
            applicant_count: 0
           })
        }
      }, error => {
        console.log(error)
      })
    }
    
    render() {
      const {applicant_count, endorsed_count, total_scholars, total_applicants, pending_applications, total_approved} = this.state
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
          title: "Total Approved Applications",
          count: total_approved
        },
      ]
        return (
            <div className=''>
              <Breadcrumb
              header={"Welcome to your Dashboard"}
              subheader={"Heres the current statistics"}/>
              {/* Start Graph */}
              <Container>
              <BarChart
                series={[
                  { data: [applicant_count, endorsed_count, total_scholars, pending_applications, pending_applications, total_approved] },
                  
                ]}
                height={290}
                xAxis={[{ data: ['Total Applicants', 'Total Endorsed Applicants', 'Total Scholars', 'Pending Applications', 'Total Applicants', 'Total Approved Applications'], scaleType: 'band' }]}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
              />
              </Container>
             {/* End Graph */}
              {/* Start Cards */}
              <Container className='cardContainer'>
                {
                  data.map((item, index)=>{
                    return(
                      <Card style={{ width: '18rem' }} key={index}>
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
              </Container>
              {/* End Cards */}
              
            </div>

        )
    }
}

export default Dashboard