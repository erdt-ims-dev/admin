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
import  TableComponent  from 'modules/generic/table/index';
import ViewModal from './viewModal/index'
import EditModal from './editModal/index'
import EndorseModal from './endorseModal/index'
import RemarksModal from './remarksModal/index'
import API from 'services/Api'

class Applications extends Component {
    constructor(props) {
      super(props);
      this.state = {
        applicant_list: [],
        showView: false,
        showEndorse: false,
        showEdit: false,
        showRemarks: false,
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
                <span className='link' onClick={() => this.openView(row.original)}>View</span>
                <span className='link'onClick={() => this.openEdit(row.original)}>Edit</span>
                <span className='link'onClick={() => this.openEndorse(row.original)}>Endorse</span>
                <span className='link'onClick={() => this.openRemarks(row.original)}>Remarks</span>
              </div>
            ),
          },
          ],
          data: [], // will contain the finalized value to be displayed in the Table Component
          setData: null, // will contain which row has been selected and details associated with it
          list: null // will contain the current Applicant List pulled from DB
          };
      };
      // Modal Handling
      openView(rowData){
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
    openRemarks(rowData){
      this.setState({
        showRemarks: !this.state.showRemarks,
        setData: rowData
      },() => {
        console.log("reow", rowData)
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
    handleRemarkSubmit = (remarks) => {
      const { user, details } = this.props;
      let {setData} = this.state;
      API.request('comments/createViaApplication', {
        id: setData.id, // take account_detail_id, find it in BE
        message: remarks.message,
        comment_by: details.user_id  
      }, response => {
        if (response && response.data) {
          this.closeEndorse()
          
        }else{
          console.log('error on retrieve')
        }
      }, error => {
        console.log(error)
      })
    }
    
    handleEndorse(data) {
      API.request('scholar_request/updateToEndorsed', {
        id: data.id,
      }, response => {
        if (response && response.data) {
          this.closeEndorse()
          
        }else{
          console.log('error on retrieve')
        }
      }, error => {
        console.log(error)
      })
      
    }
    // State
    componentDidMount(){
      this.getList()
    }
    getList() {
      API.request('scholar_request/retrieveTableAndDetail', {
      }, response => {
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
           });
         } else {
           console.log('error on retrieve');
         }
      }, error => {
         console.log(error);
      });
     }
    
    render() {
      const { columns, data, showEdit, showEndorse, showView, showRemarks, setData } = this.state;
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
        <Button onClick={()=>{ history.push('/new_application')}}>
          Add New Applicant
        </Button>
      </Box>

      <div className="table-container">
        <TableComponent columns={columns} data={data} onRowClick={(row) => console.log(row.original.program)}/>
        
      </div>
      <ViewModal
      setData={setData}
      show={showView}
      onHide={()=>{this.closeView()}}
      />
      <EndorseModal
      setData={setData}
      show={showEndorse}
      onHide={()=>{this.closeEndorse()}}
      onEndorse={(data)=>{this.handleEndorse(data)}}
      />
      <EditModal
      setData={setData}
      show={showEdit}
      onHide={()=>{this.closeEdit()}}
      />
      <RemarksModal
      setData={setData}
      show={showRemarks}
      onHide={()=>{this.closeRemarks()}}
      handleRemarkSubmit={this.handleRemarkSubmit}
      />
    </div>
        )
    }
}
const mapStateToProps = (state) => ({
  user: state.user,
  details: state.details, // Adjust this path according to your Redux store's structure
 });

export default connect(mapStateToProps)(Applications);
