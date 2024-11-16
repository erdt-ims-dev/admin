import React, { Component } from 'react'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faEye, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

import { Box } from "@mui/material";
import Breadcrumbs from "modules/generic/breadcrumb";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import  TableComponent  from 'modules/generic/tableV3/variation3';
import ViewModal from 'modules/application_status/modals/viewModal'
import TrackModal from 'modules/application_status/modals/trackingModal'
import EditModal from 'modules/application_status/modals/editModal'
import { connect } from 'react-redux';

import API from 'services/Api'

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of year
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
class Status extends Component {
    constructor(props) {
      super(props);
      this.state = {
        applicant_list: [],
        showView: false,
        showTrack: false,
        showEdit: false,
        columns: [
          {
            Header: 'Application Date',
            accessor: 'created_at',
            Cell: ({ value }) => formatDate(value),
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
          {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ cell: { row } }) => (
              // <div className='flex'>
              //   <span className='link' onClick={() => this.handleView(row.original)}>View</span>
              // </div>
              // <span className='link' onClick={() => this.handleView(row.original)}>
              //     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              //       <path d="M19.8898 19.0493L15.8588 15.0182C15.7869 14.9463 15.6932 14.9088 15.5932 14.9088H15.2713C16.3431 13.7495 16.9994 12.2027 16.9994 10.4997C16.9994 6.90923 14.0901 4 10.4997 4C6.90923 4 4 6.90923 4 10.4997C4 14.0901 6.90923 16.9994 10.4997 16.9994C12.2027 16.9994 13.7495 16.3431 14.9088 15.2744V15.5932C14.9088 15.6932 14.9495 15.7869 15.0182 15.8588L19.0493 19.8898C19.1961 20.0367 19.4336 20.0367 19.5805 19.8898L19.8898 19.5805C20.0367 19.4336 20.0367 19.1961 19.8898 19.0493ZM10.4997 15.9994C7.45921 15.9994 4.99995 13.5402 4.99995 10.4997C4.99995 7.45921 7.45921 4.99995 10.4997 4.99995C13.5402 4.99995 15.9994 7.45921 15.9994 10.4997C15.9994 13.5402 13.5402 15.9994 10.4997 15.9994Z" fill="#404041"/>
              //     </svg>
              //     View Files
              //     <label class="link-label">View</label>
              //   </span>
              <div className='flex'>
                <span className='link' onClick={() =>  this.handleView(row.original)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M19.8898 19.0493L15.8588 15.0182C15.7869 14.9463 15.6932 14.9088 15.5932 14.9088H15.2713C16.3431 13.7495 16.9994 12.2027 16.9994 10.4997C16.9994 6.90923 14.0901 4 10.4997 4C6.90923 4 4 6.90923 4 10.4997C4 14.0901 6.90923 16.9994 10.4997 16.9994C12.2027 16.9994 13.7495 16.3431 14.9088 15.2744V15.5932C14.9088 15.6932 14.9495 15.7869 15.0182 15.8588L19.0493 19.8898C19.1961 20.0367 19.4336 20.0367 19.5805 19.8898L19.8898 19.5805C20.0367 19.4336 20.0367 19.1961 19.8898 19.0493ZM10.4997 15.9994C7.45921 15.9994 4.99995 13.5402 4.99995 10.4997C4.99995 7.45921 7.45921 4.99995 10.4997 4.99995C13.5402 4.99995 15.9994 7.45921 15.9994 10.4997C15.9994 13.5402 13.5402 15.9994 10.4997 15.9994Z" fill="#404041"/>
                     </svg>
                  <label class="link-label">View</label>
                </span>
                <span className='link' onClick={() => this.openEdit(row.original)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5721 14.7789L16.5722 13.779C16.7284 13.6228 17.0003 13.7322 17.0003 13.9571V18.5002C17.0003 19.3282 16.3284 20 15.5003 20H4.50003C3.67189 20 3 19.3282 3 18.5002V7.50183C3 6.67383 3.67189 6.00205 4.50003 6.00205H13.0471C13.269 6.00205 13.3815 6.27076 13.2252 6.43011L12.2252 7.42997C12.1783 7.47683 12.1158 7.50183 12.0471 7.50183H4.50003V18.5002H15.5003V14.9539C15.5003 14.8882 15.5253 14.8258 15.5721 14.7789ZM20.466 8.47356L12.2596 16.6786L9.43451 16.9911C8.61575 17.0817 7.91886 16.3912 8.00948 15.5663L8.32199 12.7417L16.5284 4.53664C17.2441 3.82112 18.4003 3.82112 19.1128 4.53664L20.4629 5.88644C21.1785 6.60196 21.1785 7.76117 20.466 8.47356ZM17.3784 9.43905L15.5628 7.62369L9.7564 13.4322L9.52827 15.4725L11.5689 15.2444L17.3784 9.43905ZM19.4035 6.94879L18.0535 5.59898C17.9253 5.47088 17.7159 5.47088 17.5909 5.59898L16.6253 6.56447L18.441 8.37983L19.4066 7.41434C19.5316 7.28311 19.5316 7.07689 19.4035 6.94879Z" fill="#404041"/>
                  </svg>
                  <label class="link-label">Edit</label>
                </span>
                <span className='link' onClick={() => this.handleTrack(row.original)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M16.25 10.8328H12.5V9.99943H14.1667C15.276 9.99943 15.8385 8.65308 15.0495 7.86662L10.8828 3.69995C10.3932 3.21037 9.60417 3.21297 9.11458 3.69995L4.94792 7.86662C4.16406 8.65047 4.72135 9.99943 5.83333 9.99943H7.5V10.8328H3.75C3.0599 10.8328 2.5 11.3927 2.5 12.0828V15.4161C2.5 16.1062 3.0599 16.6661 3.75 16.6661H16.25C16.9401 16.6661 17.5 16.1062 17.5 15.4161V12.0828C17.5 11.3927 16.9401 10.8328 16.25 10.8328ZM5.83333 8.74943L10 4.58276L14.1667 8.74943H11.25V12.9161H8.75V8.74943H5.83333ZM16.25 15.4161H3.75V12.0828H7.5V12.9161C7.5 13.6062 8.0599 14.1661 8.75 14.1661H11.25C11.9401 14.1661 12.5 13.6062 12.5 12.9161V12.0828H16.25V15.4161ZM15.2083 13.7494C15.2083 14.0958 14.9297 14.3744 14.5833 14.3744C14.237 14.3744 13.9583 14.0958 13.9583 13.7494C13.9583 13.4031 14.237 13.1244 14.5833 13.1244C14.9297 13.1244 15.2083 13.4031 15.2083 13.7494Z" fill="#404041"/>
                   </svg>
                  <label class="link-label">Track</label>
                </span>
              </div>
            ),
          },
          // {
          //   Header: 'Tracking',
          //   accessor: 'actions',
          //   Cell: ({ cell: { row } }) => (
          //     // <div className='flex'>
          //     //   <span className='link' onClick={() => this.handleTrack(row.original)}>Track</span>

          //     // </div>
          //     <span className='link' onClick={() => this.handleTrack(row.original)}>
          //         <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          //         <path d="M16.25 10.8328H12.5V9.99943H14.1667C15.276 9.99943 15.8385 8.65308 15.0495 7.86662L10.8828 3.69995C10.3932 3.21037 9.60417 3.21297 9.11458 3.69995L4.94792 7.86662C4.16406 8.65047 4.72135 9.99943 5.83333 9.99943H7.5V10.8328H3.75C3.0599 10.8328 2.5 11.3927 2.5 12.0828V15.4161C2.5 16.1062 3.0599 16.6661 3.75 16.6661H16.25C16.9401 16.6661 17.5 16.1062 17.5 15.4161V12.0828C17.5 11.3927 16.9401 10.8328 16.25 10.8328ZM5.83333 8.74943L10 4.58276L14.1667 8.74943H11.25V12.9161H8.75V8.74943H5.83333ZM16.25 15.4161H3.75V12.0828H7.5V12.9161C7.5 13.6062 8.0599 14.1661 8.75 14.1661H11.25C11.9401 14.1661 12.5 13.6062 12.5 12.9161V12.0828H16.25V15.4161ZM15.2083 13.7494C15.2083 14.0958 14.9297 14.3744 14.5833 14.3744C14.237 14.3744 13.9583 14.0958 13.9583 13.7494C13.9583 13.4031 14.237 13.1244 14.5833 13.1244C14.9297 13.1244 15.2083 13.4031 15.2083 13.7494Z" fill="#404041"/>
          //         </svg>
          //         Track Application
          //         <label class="link-label">Track</label>
          //       </span>
          //   ),
          // },
          ],
          data: [],
          list: [],
          setData: null,
          tableLoader: true,
          // id: null,
          };
      };
      // Methods
      
      // Modal Handling
      openEdit(rowData){
        this.setState({
          showEdit: !this.state.showEdit,
          setData: rowData
        },() => {
       })
      }
      closeEdit(){
        this.setState({
          showEdit: !this.state.showEdit,
          setData: null
        },() => {
       })
      }
    handleView(rowData){
      this.setState({
        showView: !this.state.showView,
        setData: rowData
      },() => {
     })
    }
    closeView(){
      this.setState({
        showView: !this.state.showView,
        setData: null
      },() => {
     })
    }
    //
    handleTrack(rowData){
      this.setState({
        showTrack: !this.state.showTrack,
        setData: rowData
      },() => {
     })
    }
    closeTrack(){
      this.setState({
        showTrack: !this.state.showTrack,
        setData: null
      },() => {
     })
    }
    
    // State
    getList(callback){
      const id = this.props.details.id;
      if (!id) {
        console.log("ID is not available yet");
        return;
    }
      API.request('scholar_request/retrieveUserApplications', {
        id: id
      }, response => {
          if (response && response.data) {
              const details = [];
              response.data.forEach(element => {
                  details.push(element);
              });
  
              this.setState({
                  data: details,
                  tableLoader: false,
              }, () => {
                  // Call the callback function after setting the state
                  if (typeof callback === 'function') {
                      callback();
                  }
              });
          } else {
              console.log('error on retrieve');
              this.setState({
                tableLoader: false
              })
              // Optionally, call the callback function with an error or a specific value
              if (typeof callback === 'function') {
                  callback(false);
              }
          }
      }, error => {
          console.log(error);
          // Optionally, call the callback function with an error or a specific value
          if (typeof callback === 'function') {
              callback(false);
          }
      });
  }
  
  componentDidMount() {
    if (this.props.details && this.props.details.id) {
        this.getList();
    }
}
componentDidUpdate(prevProps) {
  if (prevProps.details.id !== this.props.details.id && this.props.details.id) {
      this.getList();
  }
}
    render() {
      const { columns, data, tableLoader, showView, showTrack, showEdit  } = this.state;
      return (
      <div className="container">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Breadcrumbs header="List of Applications" subheader="Here Are All The Applications You Submitted"/>
      </Box>

      <div className="table-container">
        <TableComponent columns={columns} data={data} isLoading={tableLoader}/>
        
      </div>
      <ViewModal
      show={showView}
      onHide={()=>{this.closeView()}}
      />
      <TrackModal
      setData={this.state.setData}
      show={showTrack}
      refreshList={()=>{this.getList()}}
      onHide={()=>{this.closeTrack()}}
      />
      <EditModal
      setData={this.state.setData}
      show={showEdit}
      refreshList={()=>{this.getList()}}
      onHide={()=>{this.closeEdit()}}
      />
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(Status);
  