import React, { Component } from 'react'
import 'modules/applications/applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import API from 'services/Api'
import { connect } from 'react-redux'


class DeleteModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
          
        };
      }
    componentDidMount() {
        
    }
    
    componentDidUpdate(prevProps) {
        
    }

    onDeactivate(){
      const {setData} = this.props
      // Trigger loading state to true before the API call
      this.props.setIsLoadingV2(true);
      API.request('admin_system_message/delete', {
          id: setData.id
      }, response => {
        this.props.setIsLoadingV2(false);
        if (response && response.data) {
          this.props.onHide()
          this.props.refreshList()
          this.setState()
        }else{
          console.log('error on retrieve')
        }
      }, error => {
        this.props.setIsLoadingV2(false);
        console.log(error)
      })
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
        Unpublish Announcement
        </Modal.Title>
      </Modal.Header>
      <Modal.Body >
        Are you sure you want to unpublish announcement?
      </Modal.Body>
      <Modal.Footer style={{
        backgroundColor: '#f1f5fb'
      }}>
        <Button variant='secondary' onClick={()=>{this.props.onHide()}}>Close</Button>
        <Button onClick={()=>{this.onDeactivate()}}>Unpublish</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(DeleteModal);