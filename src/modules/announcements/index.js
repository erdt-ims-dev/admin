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
import TableComponent from 'modules/generic/table/index';
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
                {/* <span className='link'onClick={() => this.handleEdit(row.original)}>Edit</span> */}
                <span className='link'onClick={() => this.handleDeactivate(row.original)}>Deactivate</span>
              </div>
            ),
          },
          ],
          data: [],
          setData: null
          };
      };
      // Modal Handling

      // View
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
    // Edit
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
    // Delete
    handleDeactivate(rowData){
      this.setState({
        showDelete: !this.state.showDelete,
        setData: rowData
      },() => {
        console.log("setData", this.state.setData);
     })
    }
    onDeactivate(){
      const {setData} = this.state
      API.request('admin_system_message/delete', {
          id: setData.id
      }, response => {
        if (response && response.data) {
          this.closeDelete()
          this.getList()
        }else{
          console.log('error on retrieve')
        }
      }, error => {
        console.log(error)
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
      handleSubmitAnnouncement = (announcement) => {
        const loggedInUser = this.props.user
        console.log(":announcement:", announcement)
        // const announcementString = JSON.stringify(announcement);
        API.request('admin_system_message/create', {
          message_by: loggedInUser.email,
          message_title: announcement.title,
          message_body: announcement.message
        }, response => {
          if (response && response.data) {
            // this.closeCreate()
            this.getList()
          }else{
            console.log('error on retrieve')
          }
        }, error => {
          console.log(error)
        })
        this.closeCreate();
     };
    // State
    componentDidMount(){
      this.getList()
    }
    getList(){
        API.request('admin_system_message/retrieveAll', {
          
        }, response => {
          if (response && response.data) {
            this.setState({
                announcement_list: response.data
            })
          }else{
            console.log('error on retrieve')
          }
        }, error => {
          console.log(error)
        })
      }
    
    render() {
      const { columns, announcement_list, showEdit, showDelete, showView, setData, showCreate } = this.state;
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
        <TableComponent columns={columns} data={announcement_list} onRowClick={(row) => console.log(row.original.title)}/>
        
      </div>
      <ViewModal
      setData={setData}
      show={showView}
      onHide={()=>{this.closeView()}}
      />
      <DeleteModal
      setData={setData}
      show={showDelete}
      onHide={()=>{this.closeDelete()}}
      onDeactivate={()=>{this.onDeactivate()}}
      />
      <EditModal
      setData={setData}
      show={showEdit}
      refresh={()=>{this.getList()}}
      onHide={()=>{this.closeEdit()}}
      />
      <CreateModal
        show={showCreate}
        handleClose={()=>{this.closeCreate()}}
        handleSubmit={this.handleSubmitAnnouncement}
      />
    </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    };
};

export default connect(mapStateToProps)(Announcements);
