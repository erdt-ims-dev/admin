import React, { Component } from 'react'
import './applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faEye, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

import { Box } from "@mui/material";
import Breadcrumbs from "../generic/breadcrumb";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import  TableComponent  from './table/index';

import API from 'services/Api'
const applicants = [
    {name: "Allison Smith", course: "MS-ME", gmail: "jackjones@gmail.com"},
    {name: "Lorenzo Scott", course: "MS-CE", gmail: "georgejones@gmail.com"},
    {name: "Edward Rose", course: "MS-ME", gmail: "georgejones@gmail.com"},
];


class Applications extends Component {
    constructor(props) {
      super(props);
      this.state = {
        applicant_list: [],
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
                <span className='link' onClick={() => this.handleView(value)}>View</span>
                <span className='link'onClick={() => this.handleEdit(value)}>Edit</span>
              </div>
            ),
          },
          ],
          data: [],
          };
      };
    handleView(){
      console.log("view");
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
            program: response.data.program, // Adjusted to match the data structure
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
      const { columns, data } = this.state;
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
    </div>
        )
    }
}

export default Applications