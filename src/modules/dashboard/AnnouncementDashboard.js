import React, { Component } from 'react'
import './style.css'
import Breadcrumb from 'modules/generic/breadcrumb';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { BarChart } from '@mui/x-charts/BarChart';
import API from 'services/Api'
import placeholder from 'assets/img/placeholder.jpeg'

import { isAfter, subMonths } from 'date-fns';
import AnnouncementBubble from './AnnouncementBubble';

class AnnouncementDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: null,
          messages: null
        };
      }
    componentDidMount() {
      this.getAnnouncements()
    }
    getAnnouncements(){
      API.request('admin_system_message/retrieveViaDashboard', {
      }, response => {
        if (response && response.data) {
            console.log(response.data)
         this.setState({
            messages: response.data
         })
        }else{
          
        }
      }, error => {
        console.log(error)
      })
    }
    
    render() {
      const {messages} = this.state
        return (
            <div className=''>
              <Breadcrumb
              header={"Welcome to your Dashboard"}
              subheader={"Announcements are posted below"}/>
              <Container>
              {
                messages &&
                messages.map((item) => (
                    <AnnouncementBubble
                    key={item.message.id} // Use the id from the nested message object
                    profilePic={item.profilePicture}
                    title={item.message.message_title}
                    message={item.message.message_body}
                    time={new Date(item.message.created_at).toLocaleString()} // Convert createdAt to readable format
                    />
                ))
                }
                            
              </Container>
             
              
            </div>

        )
    }
}

export default AnnouncementDashboard