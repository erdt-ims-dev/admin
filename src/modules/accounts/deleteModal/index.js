import React, { Component } from 'react'
import 'modules/applications/applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faEye, faUpload } from '@fortawesome/free-solid-svg-icons'
import Breadcrumb from 'modules/generic/breadcrumb';
import InputField from 'modules/generic/input';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import placeholder from 'assets/img/placeholder.jpeg'
import { Button, Modal } from 'react-bootstrap';
import API from 'services/Api'


const files = [
    {
        title: "Transcript of Record",
        disabled: false
    },
    {
        title: "Birth Certificate",
        disabled: false
    },
    {
        title: "Valid ID",
        disabled: false
    },
    {
        title: "Narrative Essay",
        disabled: false
    },
    {
        title: "Medical Certificate",
        disabled: false
    },
    {
        title: "NBI Clearance",
        disabled: false
    },
    {
        title: "Admission Notice",
        disabled: false
    },
    {
        title: "Program Study",
        disabled: false
    },
]

class DeleteModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
          
        };
      }
    componentDidMount() {
        
        // this.updateData();
    }
    
    componentDidUpdate(prevProps) {
        
    }

    updateData() {
        
       
    }
    render() {
        const {data, setEmail} = this.state
        const {setData} = this.props
    return (
        <div className=''>
            {/* <div className="headerStyle"><h2>LEAVE REQUESTS</h2></div> */}
    <Modal
      show={this.props.show}
      onHide={this.props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header style={{
        backgroundColor: '#f1f5fb'
      }}>
        <Modal.Title id="contained-modal-title-vcenter">
        General Information
        </Modal.Title>
      </Modal.Header>
      <Modal.Body >
        Are you sure you want to deactivate account? This cannot be reverted
      </Modal.Body>
      <Modal.Footer style={{
        backgroundColor: '#f1f5fb'
      }}>
        <Button variant='secondary' onClick={this.props.onHide}>Close</Button>
        <Button onClick={this.props.onDeactivate}>Deactivate</Button>
      </Modal.Footer>
    </Modal>
                    
                   
                    
                </div> 
        )
    }
}

export default DeleteModal