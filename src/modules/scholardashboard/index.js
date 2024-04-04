import React, { Component } from 'react'
import Card from 'react-bootstrap/Card';
import './style.css'
import Breadcrumb from 'modules/generic/breadcrumb';
// temporary data, will be using API to retrieve future data
const data = [
  {
    title: "Update your Portfolio",
    count: 123
  },
  {
    title: "Check your tasks",
    count: 41
  },
  {
    title: "Request for leave application",
    count: 315
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
              header={"Welcome to the Scholar Modal"}
              subheader={"How can we help"}/>
              <div className='cardContainer'>
                {
                  // See dynamic list rendering in react. .map() function in JS also documents this method
                  data.map((item, index)=>{
                    return(
                      <Card style={{ width: '18rem' }}>
                        <Card.Body>
                        <a href='#'>
                          <Card.Title>{item.title}</Card.Title>
                          </a>
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