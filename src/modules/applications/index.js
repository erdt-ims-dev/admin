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
            Header: 'Name',
            accessor: 'name',
          },
          {
            Header: 'Program of Study',
            accessor: 'program',
          },
          {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ cell: { value } }) => (
              <div className='flex'>
                <span className='link' onClick={() => this.openView(value)}>View</span>
                <span className='link'onClick={() => this.handleEdit(value)}>Edit</span>
              </div>
            ),
          },
          ],
          data: [],
          };
      };
    handleView(){
      this.setState({
        modalShow: !this.state.modalShow
      })
    }
    openView(){
      console.log('open')
      this.setState({
        modalShow: true
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
          console.log('::', response.data)
          const formattedData = {
            name: response.data.last_name + " " + response.data.first_name, 
            program: response.data.program, 
          };
          this.setState(prevState => ({
            data: [...prevState.data, formattedData]
          }));
        } else {
          console.log('error on retrieve');
        }
      }, error => {
        console.log(error);
      });
    }
    
    render() {
      const { columns, data, modalShow } = this.state;
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
        <TableComponent columns={columns} data={data}/>
        
      </div>
      <ViewModal
      show={modalShow}
      onHide={()=>{this.handleView()}}
      />
    </div>
        )
    }
}

export default Applications