import React, { Component } from 'react'
import 'modules/applications/applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
// centered on screen modal
class WarningModal extends Component {
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
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
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
        <Button variant='secondary' onClick={this.props.onHide}>Discard</Button>
        <Button variant='danger' onClick={()=>{this.props.onContinue()}}>Continue</Button>
      </Modal.Footer>
    </Modal>    
    </div> 
        )
    }
}

export default WarningModal