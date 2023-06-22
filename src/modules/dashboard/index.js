import React, { Component } from 'react'
import Card from 'react-bootstrap/Card';
import './style.css'
import Breadcrumb from '../generic/breadcrumb';
// temporary data, will be using API to retrieve future data
const data = [
  {
    title: "Total Applicants",
    count: 123
  },
  {
    title: "Total Endorsed Applicants",
    count: 41
  },
  {
    title: "Total Scholars",
    count: 315
  },
  {
    title: "Pending Applications",
    count: 12
  },
  {
    title: "Total Applicants",
    count: 513
  },
  {
    title: "New Scholars This Semester",
    count: 23
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