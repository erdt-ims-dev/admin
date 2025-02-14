import React, { Component } from 'react'
import './style.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
      }
    render() {
        const {props}= this.props.state
        return (
           <div>
            <Modal
            {...props}
            size="lg"git
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                Modal heading
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Centered Modal</h4>
                <p>
                Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                consectetur ac, vestibulum at eros.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.props.onHide}>Close</Button>
            </Modal.Footer>
            </Modal>
           </div>
        )
    }
}

export default Details