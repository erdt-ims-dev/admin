import React, { Component } from 'react'
import { ListGroup } from 'react-bootstrap'
import './style.css'

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: null
        };
      }
    render() {
        return (
            <div>
              <h1>Dashboard</h1>
            </div>

        )
    }
}

export default Dashboard