import React, { Component } from 'react'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faEye, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

import { Box } from "@mui/material";
import Breadcrumbs from "modules/generic/breadcrumb";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import  TableComponent  from 'modules/generic/table/index';
import ViewModal from 'modules/applications/viewModal/index'

import API from 'services/Api'


class Endorsements extends Component {
    constructor(props) {
      super(props);
      this.state = {
        applicant_list: [],
        showView: false,
        showEndorse: false,
        showEdit: false,
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
            Header: 'View Profile',
            accessor: 'profile',
            Cell: ({ cell: { row } }) => (
              <div className='flex'>
                <span className='link' onClick={() => this.handleView(row.original)}>View</span>
              </div>
            ),
          },
          {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ cell: { row } }) => (
              <div className='flex'>
                <span className='link' onClick={() => this.handleApprove(row.original)}>Approve</span>
                <span className='link' onClick={() => this.handleReject(row.original)}>Reject</span>
              </div>
            ),
          },
          ],
          data: [],
          list: [],
          setData: null
          };
      };
      // Methods
      handleApprove(data){
        // console.log("data", data)
        API.request('scholar_request/approveApplicant', {
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
    
    // State
    componentDidMount(){
      this.getList()
    }
    getList() {
      API.request('scholar_request/retrieveEndorsedTableAndDetail', {
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
      const { columns, data, showEdit, showEndorse, showView, setData } = this.state;
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
        <Breadcrumbs header="Endorsements" subheader="Here Are All The Endorsed Applicants"/>
      </Box>

      <div className="table-container">
        <TableComponent columns={columns} data={data} onRowClick={(row) => console.log(row.original.program)}/>
        
      </div>
      <ViewModal
      setData={setData}
      show={showView}
      onHide={()=>{this.closeView()}}
      />
    </div>
        )
    }
}

export default Endorsements