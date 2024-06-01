import React, { Component } from 'react'
import 'modules/applications/applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faEye, faUpload } from '@fortawesome/free-solid-svg-icons'
import Breadcrumb from 'modules/generic/breadcrumb';
import InputField from 'modules/generic/input';
import InputFieldV4 from 'modules/generic/inputV4';
import InputFieldV3 from 'modules/generic/inputV3';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import placeholder from 'assets/img/placeholder.jpeg'
import { Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import API from 'services/Api'
import 'modules/application_status/style.css'




class Tracker extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: null
        };
      }
      componentDidMount() {
        this.setState({
            details: this.props.details
        })
        
    }
    
    componentDidUpdate(prevProps) {
       
    }
    toggleFilesSectionVisibility() {
        this.setState(prevState => ({
            isCollapsed:!prevState.isCollapsed,
        }));
    };
    
    handleHide(){
        this.setState({
            isCollapsed: true
        })
        this.props.onHide()
    }
    render() {
        const {details} = this.state
        console.log('set', details)
    return (
        <div >
            {/* <div className="headerStyle"><h2>LEAVE REQUESTS</h2></div> */}
    <Modal
      show={this.props.show}
      onHide={()=>{this.handleHide()}}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header style={{
        backgroundColor: '#f1f5fb'
      }}>
        <Modal.Title id="contained-modal-title-vcenter">
        View Uploaded Files
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{
        backgroundColor: '#f1f5fb',
        maxHeight: '75vh',
        overflowX: 'hidden',
        overflowY: 'auto'
      }}>
      <Container>
        
    
    </Container>
        
      </Modal.Body>
      <Modal.Footer style={{
        backgroundColor: '#f1f5fb'
      }}>
        <Button variant='secondary' onClick={()=>{this.handleHide()}}>Close</Button>
      </Modal.Footer>
    </Modal>
                    
                   
                    
                </div> 
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    details: state.details, 
   });
   const mapDispatchToProps = (dispatch) => {
    return {
        setIsLoadingV2: (details) => {
          dispatch({ type: 'SET_IS_LOADING_V2', payload: { details } });
        }
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Tracker);
