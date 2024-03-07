import React, { Component } from 'react'
import './applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faEye, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

import { Box } from "@mui/material";
import Breadcrumbs from "../generic/breadcrumb";
import { Button, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const applicants = [
    {name: "Allison Smith", course: "MS-ME", gmail: "jackjones@gmail.com"},
    {name: "Lorenzo Scott", course: "MS-CE", gmail: "georgejones@gmail.com"},
    {name: "Edward Rose", course: "MS-ME", gmail: "georgejones@gmail.com"},
];


class Endorsedapplicant extends Component {

    render() {
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
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Program</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map(({ id, name, program }) => (
              <tr key={id}>
                <td>{name}</td>
                <td>{program}</td>
                <td>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                      justifyContent: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      className="icon"
                      icon={faThumbsUp}
                      size="sm"
                    />
                    <FontAwesomeIcon
                      className="icon"
                      icon={faEye}
                      size="sm"
                    />
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
        )
    }
}

export default Endorsedapplicant