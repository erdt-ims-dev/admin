import React, { Component } from 'react';
import { connect } from 'react-redux'
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { Box } from "@mui/material";
import Breadcrumbs from "../generic/breadcrumb";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import TableComponent from 'modules/generic/tableV3/index';
import ViewModal from './viewModal/index';
import EditModal from './editModal/index';
import DeleteModal from './deleteModal/index';
import API from 'services/Api';
import CreateModal from './createModal/index';



class Announcements extends Component {
    constructor(props) {
      super(props);
      this.state = {
        announcement_list: [],
        showView: false,
        showDelete: false,
        showEdit: false,
        showCreate: false,
        columns: [
          {
            Header: 'Title',
            accessor: 'message_title',
          },
          {
            Header: 'Posted By',
            accessor: 'message_by',
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
          {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ cell: { row } }) => (
              <div className='flex'>
                <span className='link' onClick={() => this.handleView(row.original)}>View</span>
                <span className='link'onClick={() => this.handleEdit(row.original)}>Edit</span>
                <span className='link'onClick={() => this.handleDeactivate(row.original)}>Unpublish</span>
              </div>
            ),
          },
          ],
          data: [],
          setData: null,
          tableLoader: true
          };
      };
      // Modal Handling

      // View
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
    // Edit
    handleEdit(rowData){
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
    // Delete
    handleDeactivate(rowData){
      this.setState({
        showDelete: !this.state.showDelete,
        setData: rowData
      },() => {
     })
    }
    
    closeDelete(){
      this.setState({
        showDelete: !this.state.showDelete,
        setData: null
      },() => {
     })
    }
    // Create
    handleCreate(){
        this.setState({
          showCreate: !this.state.showCreate,
        },() => {
       })
      }
      closeCreate(){
        this.setState({
            showCreate: !this.state.showCreate,
        },() => {
       })
      }
      
     
    // State
    getList(callback){
      API.request('admin_system_message/retrieveAll', {
      }, response => {
          if (response && response.data) {
              this.setState({
                  announcement_list: response.data
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
      const { columns, announcement_list, showEdit, showDelete, showView, setData, showCreate, tableLoader } = this.state;
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
        <Breadcrumbs header="System Announcements" subheader="All Published System Announcements Are Listed Here"/>
         <Button onClick={()=>{ this.handleCreate()}}>
           Create New Announcement
         </Button>
      </Box>

      <div className="table-container">
        <TableComponent columns={columns} data={announcement_list} isLoading={tableLoader}/>
        
      </div>
      <ViewModal
      setData={setData}
      show={showView}
      onHide={()=>{this.closeView()}}
      />
      <DeleteModal
      setData={setData}
      show={showDelete}
      refreshList={()=>{this.getList()}}
      onHide={()=>{this.closeDelete()}}
      />
      <EditModal
      setData={setData}
      show={showEdit}
      refreshList={()=>{this.getList()}}
      onHide={()=>{this.closeEdit()}}
      />
      <CreateModal
        show={showCreate}
        onHide={()=>{this.closeCreate()}}
        refreshList={()=>{this.getList()}}
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
      setIsLoadingV2: (details) => {
        dispatch({ type: 'SET_IS_LOADING_V2', payload: { details } });
      }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Announcements);
