import React, { Component } from 'react'
import 'modules/applications/applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faEye, faUpload } from '@fortawesome/free-solid-svg-icons'
import { Button, Modal } from 'react-bootstrap';
import API from 'services/Api'
import { connect } from 'react-redux';
import { toast } from 'react-toastify'; // Import toast from react-toastify


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

class approveModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
          
        };
      }
    componentDidMount() {
        
    }
    
    componentDidUpdate(prevProps) {
        
    }

    handleApprove(){
      const {setData} = this.props
      // console.log("setdata", setData)
      API.request('scholar_request/approveApplicant', {
        id: setData.id
      }, response => {
         if (response && response.data) {
          this.props.onHide()
           this.props.refreshList()
           toast.success("Applicant Endorsed."); 

         } else {
          toast.error("Something went wrong. Please try again."); 
           console.log('error on retrieve');
         }
      }, error => {
        toast.error("Something went wrong. Check your connection and try again."); 
         console.log(error);
      });
    }
    render() {
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
        Approve Application?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body >
        Are you sure you want to approve applicant?
      </Modal.Body>
      <Modal.Footer style={{
        backgroundColor: '#f1f5fb'
      }}>
        <Button variant='secondary' onClick={this.props.onHide}>Close</Button>
        <Button onClick={()=>{this.handleApprove()}}>Approve</Button>
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
      setIsLoadingV2: (status) => {
        dispatch({ type: 'SET_IS_LOADING_V2', payload: { status } });
      }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(approveModal);
