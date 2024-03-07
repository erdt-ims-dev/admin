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
const applicants = [
    {name: "Allison Smith", course: "MS-ME", gmail: "jackjones@gmail.com"},
    {name: "Lorenzo Scott", course: "MS-CE", gmail: "georgejones@gmail.com"},
    {name: "Edward Rose", course: "MS-ME", gmail: "georgejones@gmail.com"},
];


class Applications extends Component {
    constructor(props) {
      super(props);
      this.state = {
        columns: [
          {
            Header: 'Name',
            accessor: 'name',
          },
          {
            Header: 'Program of Study',
            accessor: 'pos',
          },
          {
            Header: 'Actions',
            accessor: 'actions',
          },
        ],
        data: [
          { name: 'John', age: 25, status: 'Active' },
          { name: 'Jane', age: 30, status: 'Inactive' },
        ],
      };
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