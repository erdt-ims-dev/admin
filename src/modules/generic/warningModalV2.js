import React, { Component } from 'react'
import 'modules/applications/applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import './style.css'
// centered on top screen modal, bright borders
class WarningModalV2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
          
        };
      }

    render() {
        const {message} = this.props
    return (
        <div className=''>
            {/* <div className="headerStyle"><h2>LEAVE REQUESTS</h2></div> */}
    <Modal
      show={this.props.show}
      onHide={this.props.onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
        className='custom-width-modal'
    >
      <Modal.Header style={{
        backgroundColor: '#f1f5fb'
      }}>
        <Modal.Title id="contained-modal-title-vcenter">
        Warning
        </Modal.Title>
      </Modal.Header>
      <Modal.Body >
        {message}
      </Modal.Body>
      <Modal.Footer style={{
        backgroundColor: '#f1f5fb'
      }}>
        <Button variant='secondary' onClick={this.props.onHide}>{this.props.button1}</Button>
        <Button onClick={()=>{this.props.onContinue()}}>{this.props.button2}</Button>
      </Modal.Footer>
    </Modal>    
    </div> 
        )
    }
}

export default WarningModalV2