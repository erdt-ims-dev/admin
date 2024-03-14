import React, { Component } from 'react'
import './applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faEye, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

import { Box } from "@mui/material";
import Breadcrumbs from "../generic/breadcrumb";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import  TableComponent  from './table/index';
import ViewModal from './modal/index'
import API from 'services/Api'


class Applications extends Component {
    constructor(props) {
      super(props);
      this.state = {
        applicant_list: [],
        modalShow: false,
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
                <span className='link' onClick={() => this.handleView(row.original)}>View</span>
                <span className='link'onClick={() => this.handleEdit(row.original)}>Edit</span>
                <span className='link'onClick={() => this.handleEdit(row.original)}>Endorse</span>
              </div>
            ),
          },
          ],
          data: [],
          setData: null
          };
      };
    handleView(rowData){
      this.setState({
        modalShow: !this.state.modalShow,
        setData: rowData
      },() => {
        console.log("setData", this.state.setData);
     })
    }
    closeView(){
      this.setState({
        modalShow: !this.state.modalShow,
        setData: null
      },() => {
     })
    }
    handleEdit(){
      console.log('edit')
    }
    componentDidMount(){
      this.getList()
    }
    getList(){
      API.request('scholar_request/retrieveMultiple', {
        col: 'status',
        value: 'pending'
      }, response => {
        if (response && response.data) {
          response.data.forEach((element, index )=> {
            this.getDetails(element.account_details_id)
          });
        }else{
          console.log('error on retrieve')
        }
      }, error => {
        console.log(error)
      })
    }
    getDetails(detail_id){
      API.request('account_details/retrieveOne', {
        col: 'id',
        value: detail_id
      }, response => {
        if (response && response.data) {
          this.setState(prevState => ({
            data: [...prevState.data, response.data]
          }));
        } else {
          console.log('error on retrieve');
        }
      }, error => {
        console.log(error);
      });
    }
    handleRowClick(row){
      const {data} = this.state
      data.forEach((element, index) => {
        if(element.first_name == row.original.first_name){

        }
      });
    }
    render() {
      const { columns, data, modalShow, setData } = this.state;
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
        <Breadcrumbs header="Applications" />
        <Button onClick={()=>{ history.push('/new_application')}}>
          Add New Applicant
        </Button>
      </Box>

      <div className="table-container">
        <TableComponent columns={columns} data={data} onRowClick={(row) => console.log(row.original.program)}/>
        
      </div>
      <ViewModal
      setData={setData}
      show={modalShow}
      onHide={()=>{this.closeView()}}
      />
    </div>
        )
    }
}

export default Applications