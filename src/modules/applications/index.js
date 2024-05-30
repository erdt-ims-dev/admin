import React, { Component } from 'react'
import './applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faEye, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux';

import { Box } from "@mui/material";
import Breadcrumbs from "../generic/breadcrumb";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import  TableComponent  from 'modules/generic/tableV3/index';
import ViewModal from './viewModal/index'
import EditModal from './editModal/index'
import EndorseModal from './endorseModal/index'
import RemarksModal from './remarksModal/index'
import RejectModal from './rejectModal/index'

import API from 'services/Api'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

class Applications extends Component {
    constructor(props) {
      super(props);
      this.state = {
        applicant_list: [],
        showView: false,
        showEndorse: false,
        showEdit: false,
        showRemarks: false,
        showReject: false,
        columns: [
          {
            Header: 'Last Name',
            accessor: 'last_name',
          },
          {
            Header: 'First Name',
            accessor: 'first_name',
          },
          {
            Header: 'Program of Study',
            accessor: 'program',
          },
          {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ cell: { row } }) => (
              <div className='flex'>
                {/* <span className='link' onClick={() => this.openView(row.original)}>View</span> */}
                <span className='link'onClick={() => this.openEdit(row.original)}>Edit</span>
                <span className='link'onClick={() => this.openEndorse(row.original)}>Endorse</span>
                <span className='link'onClick={() => this.openReject(row.original)}>Reject</span>
                <span className='link'onClick={() => this.openRemarks(row.original)}>Remarks</span>
              </div>
            ),
          },
          ],
          data: [], // will contain the finalized value to be displayed in the Table Component
          setData: null, // will contain which row has been selected and details associated with it
          list: null, // will contain the current Applicant List pulled from DB
          tableLoader: true  
        };
      };
      // Modal Handling
    //   openView(rowData){
    //     console.log('Opening ViewModal');

    //   this.setState({
    //     showView: !this.state.showView,
    //     setData: rowData
    //   },() => {
    //  })
    // }
    // closeView(){
    //   this.setState({
    //     showView: !this.state.showView,
    //     setData: null
    //   },() => {
    //  })
    // }
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
    openEndorse(rowData){
      this.setState({
        showEndorse: !this.state.showEndorse,
        setData: rowData
      },() => {
     })
    }
    closeEndorse(){
      this.setState({
        showEndorse: !this.state.showEndorse,
        setData: null
      },() => {
     })
    }
    openReject(rowData){
      this.setState({
        showReject: !this.state.showReject,
        setData: rowData
      },() => {
     })
    }
    closeReject(){
      this.setState({
        showReject: !this.state.showReject,
        setData: null
      },() => {
     })
    }
    openRemarks(rowData){
      this.setState({
        showRemarks: !this.state.showRemarks,
        setData: rowData
      },() => {
     })
    }
    closeRemarks(){
      this.setState({
        showRemarks: !this.state.showRemarks,
        // setData: null
      },() => {
     })
    }
    // Form handling
    
    
    
    // State
    getList(callback){
      API.request('scholar_request/retrievePendingTableAndDetail', {}, response => {
          if (response && response.data) {
              const details = [];
              const list = [];
  
              response.data.forEach(element => {
                  details.push(element.details);
                  list.push(element.list);
              });
  
              this.setState({
                  data: details,
                  list: list
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
      const { columns, data, showEdit, showEndorse, showReject, showView, showRemarks, setData, tableLoader } = this.state;
      const {history} = this.props;
      return (
      <div className="container">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Breadcrumbs header="Applications" subheader="All Application Requests Are Listed Here"/>
        <Button style={{
          fontSize: '14px',
        }} onClick={()=>{ history.push('/new_application')}}>
          Add New Applicant
        </Button>
      </Box>

      <div className="table-container">
        <TableComponent columns={columns} data={data} isLoading={tableLoader}/>
        
      </div>
      {/* <ViewModal
      setData={setData}
      show={showView}
      onHide={()=>{this.closeView()}}
      /> */}
      <EndorseModal
      setData={setData}
      show={showEndorse}
      onHide={()=>{this.closeEndorse()}}
      refreshList={()=>{this.getList()}}
      />
      <EditModal
      setData={setData}
      show={showEdit}
      refreshList={()=>{this.getList()}}
      onHide={()=>{this.closeEdit()}}
      />
      <RejectModal
      setData={setData}
      show={showReject}
      refreshList={()=>{this.getList()}}
      onHide={()=>{this.closeReject()}}
      />
      <RemarksModal
      setData={setData}
      show={showRemarks}
      refreshList={()=>{this.getList()}}
      onHide={()=>{this.closeRemarks()}}
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

export default connect(mapStateToProps, mapDispatchToProps)(Applications);
