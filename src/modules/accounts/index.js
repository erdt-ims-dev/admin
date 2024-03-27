import React, { Component } from 'react'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faEye, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

import { Box } from "@mui/material";
import Breadcrumbs from "../generic/breadcrumb";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import  TableComponent  from 'modules/generic/table/index';
import ViewModal from './viewModal/index'
import EditModal from './editModal/index'
import DeleteModal from './deleteModal/index'
import API from 'services/Api'


class Accounts extends Component {
    constructor(props) {
      super(props);
      this.state = {
        account_list: [],
        showView: false,
        showDelete: false,
        showEdit: false,
        columns: [
          {
            Header: 'Email',
            accessor: 'email',
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
          {
            Header: 'Account Type',
            accessor: 'account_type',
          },
          {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ cell: { row } }) => (
              <div className='flex'>
                {/* <span className='link' onClick={() => this.handleView(row.original)}>View</span> */}
                <span className='link'onClick={() => this.handleEdit(row.original)}>Edit</span>
                <span className='link'onClick={() => this.handleEndorse(row.original)}>Deactivate</span>
              </div>
            ),
          },
          ],
          data: [],
          setData: null
          };
      };
      // Modal Handling
    handleView(rowData){
      this.setState({
        showView: !this.state.showView,
        setData: rowData
      },() => {
        console.log("setData", this.state.setData);
     })
    }
    closeView(){
      this.setState({
        showView: !this.state.showView,
        setData: null
      },() => {
     })
    }
    handleEdit(rowData){
      this.setState({
        showEdit: !this.state.showEdit,
        setData: rowData
      },() => {
        console.log("setData", this.state.setData);
     })
    }
    closeEdit(){
      this.setState({
        showEdit: !this.state.showEdit,
        setData: null
      },() => {
     })
    }
    handleEndorse(rowData){
      this.setState({
        showDelete: !this.state.showDelete,
        setData: rowData
      },() => {
        console.log("setData", this.state.setData);
     })
    }
    closeEndorse(){
      this.setState({
        showEndorse: !this.state.showEndorse,
        setData: null
      },() => {
     })
    }
    // State
    componentDidMount(){
      this.getList()
    }
    getList(){
        API.request('user/retrieveAll', {
          
        }, response => {
          if (response && response.data) {
            this.setState({
                account_list: response.data
            })
          }else{
            console.log('error on retrieve')
          }
        }, error => {
          console.log(error)
        })
      }
    
    render() {
      const { columns, account_list, showEdit, showDelete, showView, setData } = this.state;
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
        <Breadcrumbs header="Account List" />
         {/* <Button onClick={()=>{ history.push('/#')}}>
           Add New Account
         </Button> */}
      </Box>

      <div className="table-container">
        <TableComponent columns={columns} data={account_list} onRowClick={(row) => console.log(row.original.program)}/>
        
      </div>
      <ViewModal
      setData={setData}
      show={showView}
      onHide={()=>{this.closeView()}}
      />
      <DeleteModal
      setData={setData}
      show={showDelete}
      onHide={()=>{this.closeEndorse()}}
      />
      <EditModal
      setData={setData}
      show={showEdit}
      onHide={()=>{this.closeEdit()}}
      />
    </div>
        )
    }
}

export default Accounts