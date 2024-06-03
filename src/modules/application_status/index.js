import React, { Component } from 'react'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faEye, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

import { Box } from "@mui/material";
import Breadcrumbs from "modules/generic/breadcrumb";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import  TableComponent  from 'modules/generic/tableV3/variation2';
import ViewModal from 'modules/application_status/modals/viewModal'
import TrackModal from 'modules/application_status/modals/trackingModal'
import ApproveModal from 'modules/endorsements/approveModal/index'
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
            Header: 'View Files',
            accessor: 'files',
            Cell: ({ cell: { row } }) => (
              <div className='flex'>
                <span className='link' onClick={() => this.handleView(row.original)}>View</span>
              </div>
            ),
          },
          {
            Header: 'Tracking',
            accessor: 'actions',
            Cell: ({ cell: { row } }) => (
              <div className='flex'>
                <span className='link' onClick={() => this.handleTrack(row.original)}>Track</span>

              </div>
            ),
          },
          ],
          data: [],
          list: [],
          setData: null,
          tableLoader: true
          };
      };
      // Methods
      
      // Modal Handling
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
      API.request('scholar_request/retrieveUserApplications', {
        id: this.props.details.id
      }, response => {
          if (response && response.data) {
              const details = [];
              response.data.forEach(element => {
                  details.push(element);
              });
  
              this.setState({
                  data: details,
              }, () => {
                  // Call the callback function after setting the state
                  if (typeof callback === 'function') {
                      callback();
                  }
              });
          } else {
              console.log('error on retrieve');
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
  
  componentDidMount(){
      this.getList(() => {
          // This function will be called after getList successfully retrieves data
          this.setState({
              tableLoader: false,
          });
      });
  }
  
    render() {
      const { columns, data, tableLoader, showView, showTrack,  } = this.state;
      return (
      <div className="container">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Breadcrumbs header="List of Applications" subheader="Here Are All The Applications Submitted"/>
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
  