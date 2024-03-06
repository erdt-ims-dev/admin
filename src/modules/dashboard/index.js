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
          new_scholars: 0
        };
      }
    componentDidMount() {
      this.getApplicantCount()
      this.getScholarCount()
      this.getPendingApplications()
      this.getEndorsedApplications()
    }
    getApplicantCount(){
      API.request('user/retrieveByParameter', {
        col: 'account_type',
        value: 'applicant',
      }, response => {
        if (response && response.data) {
         this.setState({
          applicant_count: response.data.length
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
    getPendingApplications(){
      API.request('scholar_request/retrieveByParameter', {
        col: 'status',
        value: 'pending',
      }, response => {
        if (response && response.data) {
         this.setState({
          pending_applications: response.data.length
         })
        }else{
          this.setState({
            pending_applications: 0
           })
        }
      }, error => {
        console.log(error)
      })
    }
    getEndorsedApplications(){
      API.request('scholar_request/retrieveByParameter', {
        col: 'status',
        value: 'endorsed',
      }, response => {
        if (response && response.data) {
         this.setState({
          endorsed_count: response.data.length
         })
        }else{
          this.setState({
            endorsed_count: 0
           })
        }
      }, error => {
        console.log(error)
      })
    }
    getScholarCount(){
      API.request('user/retrieveByParameter', {
        col: 'account_type',
        value: 'scholar',
      }, response => {
        if (response && response.data) {
          // For now takes current date, replace with when a sem starts
          const fourMonthsAgo = subMonths(new Date(), 4);
          const filteredData = response.data.filter(item => {
          const createdAt = new Date(item.created_at);
          return isAfter(createdAt, fourMonthsAgo);
         })
         this.setState({
          total_scholars: response.data.length,
          new_scholars: filteredData.length  
         })
        }else{
          this.setState({
            total_scholars: 0
           })
        }
      }, error => {
        console.log(error)
      })
    }
    getTotalApplicant(){
      API.request('scholar_request/retrieveAll', {
        
      }, response => {
        if (response && response.data) {
         this.setState({
          total_applicants: response.data.length
         })
        }else{
          this.setState({
            total_applicants: 0
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
            <div className=''>
              <Breadcrumb
              header={"Welcome to your Dashboard"}
              subheader={"Heres the current statistics"}/>
              {/* Start Graph */}
              <Container>
              <BarChart
                series={[
                  { data: [applicant_count, endorsed_count, total_scholars, pending_applications, pending_applications, new_scholars] },
                  
                ]}
                height={290}
                xAxis={[{ data: ['Total Applicants', 'Total Endorsed Applicants', 'Total Scholars', 'Pending Applications', 'Total Applicants', 'New Scholars This Semester'], scaleType: 'band' }]}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
              />
              </Container>
             {/* End Graph */}
              {/* Start Cards */}
              <Container className='cardContainer'>
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
              </Container>
              {/* End Cards */}
              
            </div>

        )
    }
}

export default Dashboard