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
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ cell: { row } }) => (
              <div className='flex'>
                <span className='link' onClick={() => this.handleView(row.original)}>View</span>
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
    getList(){
      API.request('scholar_request/retrieveMultipleByParameter', {
        col: 'status',
        value: 'endorsed'
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
        <Breadcrumbs header="Endorsements" />
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