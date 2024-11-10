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
import { format } from 'date-fns';
import 'modules/application_status/modals/tracking.css'


class Tracker extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: null,
          comments: '' 
        };
      }
      componentDidMount() {
        const { setData } = this.props;
        if (setData && setData!== null) {
            this.getComment();
        }
    }
    
    componentDidUpdate(prevProps) {
        // Check if setData has changed and now contains non-null values
        if (!prevProps.setData || prevProps.setData === null || this.props.setData!== prevProps.setData) {
            this.getComment();
        }
    }
    toggleFilesSectionVisibility() {
        this.setState(prevState => ({
            isCollapsed:!prevState.isCollapsed,
        }));
    };
    getComment(){
        const { setData } = this.props;
    
        // Ensure setData is not null before proceeding
        if (!setData) {
            return; // Exit the function early if setData is null
        }
        this.props.setIsLoadingV2(true);
        API.request('comments/retrieveWithAccountDetails', {
            id: this.props.details.id,
        }, response => {
            // Trigger loading state to false after the API call is completed
            this.props.setIsLoadingV2(false);
            if (response && response.data) {
                this.setState({
                    comments: response.data.message
                })
            } else {
                console.log('error on retrieve');
            }
        }, error => {
            this.props.setIsLoadingV2(false);
            console.log(error);
        });
    }
    handleHide(){
        this.setState({
            isCollapsed: true
        })
        this.props.onHide()
    }
    render() {
        const { details, data, comments  } = this.state;
        const { setData } = this.props;

        // Assuming `data` contains the application details including `status`
        const formattedDate = setData? format(new Date(setData.created_at), 'yyyy-MM-dd') : '';

        let staffStatusText = '';
        let coordinatorStatusText = '';
        if (setData && setData.status === 'endorsed') {
            staffStatusText = <span style={{ color: 'green' }}>Endorsed</span>;
            coordinatorStatusText = <span> Pending</span>; // Coordinator hasn't approved yet
        } else if (setData && setData.status === 'approved') {
            staffStatusText = <span>Endorsed</span>; // Staff has endorsed
            coordinatorStatusText = <span style={{ color: 'green' }}>Approved</span>;
        } else {
            staffStatusText = <span> Pending</span>;
            coordinatorStatusText = <span> Pending</span>;
        }

        return (
            <div>
                <Modal
                    show={this.props.show}
                    onHide={() => { this.handleHide(); }}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header style={{ backgroundColor: '#f1f5fb' }}>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Track Application
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: '#f1f5fb', maxHeight: '75vh', overflowX: 'hidden', overflowY: 'auto' }}>
                        <Container>
                        <Row className="Row">
                        <Row className="Row">
                            <span>
                                Date submitted: <span style={{ fontWeight: 'bold' }}>{formattedDate}</span>
                            </span>
                        </Row>
                            <Row className='Row'>
                                <Col>
                                {/* <span>Staff Approval: {staffStatusText}</span> */}
                                <span>
                                    Staff Approval: <span style={{ fontWeight: 'bold' }}>{staffStatusText}</span>
                                </span>
                                </Col>
                                <Col>
                                <div className="comment-container">
                                    <p>{`Remarks: ${comments ? comments : "None"}`}</p>
                                </div>
                                </Col>
                            </Row>
                            <Row className='Row'>
                            {/* <span>Coordinator Approval: {coordinatorStatusText}</span> */}
                            <span>
                                Coordinator Approval: <span style={{ fontWeight: 'bold' }}>{coordinatorStatusText}</span>
                            </span>  
                            </Row>
                                
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer style={{ backgroundColor: '#f1f5fb' }}>
                        <Button variant='secondary' onClick={() => { this.handleHide(); }}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
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
