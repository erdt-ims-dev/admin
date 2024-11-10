import React, { Component } from 'react'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faEye, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

import { Box } from "@mui/material";
import Breadcrumbs from "modules/generic/breadcrumb";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import  TableComponent  from 'modules/generic/tableV3/variation2';
import ViewModal from 'modules/applications/viewModal/index'
import RejectModal from 'modules/endorsements/rejectModal/index'
import ApproveModal from 'modules/endorsements/approveModal/index'

import API from 'services/Api'
import { toast } from 'react-toastify'; // Import toast from react-toastify
import { connect } from 'react-redux'; // Import connect from react-redux


class Endorsements extends Component {
    constructor(props) {
      super(props);
      this.state = {
        applicant_list: [],
        showView: false,
        showApprove: false,
        showReject: false,
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
                <span className='link' onClick={() => this.handleView(row.original)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.8898 19.0493L15.8588 15.0182C15.7869 14.9463 15.6932 14.9088 15.5932 14.9088H15.2713C16.3431 13.7495 16.9994 12.2027 16.9994 10.4997C16.9994 6.90923 14.0901 4 10.4997 4C6.90923 4 4 6.90923 4 10.4997C4 14.0901 6.90923 16.9994 10.4997 16.9994C12.2027 16.9994 13.7495 16.3431 14.9088 15.2744V15.5932C14.9088 15.6932 14.9495 15.7869 15.0182 15.8588L19.0493 19.8898C19.1961 20.0367 19.4336 20.0367 19.5805 19.8898L19.8898 19.5805C20.0367 19.4336 20.0367 19.1961 19.8898 19.0493ZM10.4997 15.9994C7.45921 15.9994 4.99995 13.5402 4.99995 10.4997C4.99995 7.45921 7.45921 4.99995 10.4997 4.99995C13.5402 4.99995 15.9994 7.45921 15.9994 10.4997C15.9994 13.5402 13.5402 15.9994 10.4997 15.9994Z" fill="#404041"/>
                  </svg>
                  <label class="link-label">View</label>
                </span>
                <span className='link' onClick={() => this.handleApprove(row.original)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.5068 6.85481L9.45265 14.6991L6.49327 11.8168C6.34979 11.6771 6.11715 11.6771 5.97363 11.8168L5.10761 12.6603C4.96413 12.8 4.96413 13.0266 5.10761 13.1664L9.19281 17.1452C9.33629 17.2849 9.56894 17.2849 9.71245 17.1452L18.8924 8.20437C19.0359 8.06463 19.0359 7.83805 18.8924 7.69827L18.0264 6.85481C17.8829 6.71506 17.6502 6.71506 17.5068 6.85481Z" fill="#10b798"/>
                  </svg>
                  <label class="link-label">Approve</label>
                </span>
                <span className='link' onClick={() => this.handleReject(row.original)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.4874 11.9998L16.8537 8.63358C17.0484 8.4389 17.0484 8.12296 16.8537 7.92796L16.0715 7.14577C15.8768 6.95108 15.5608 6.95108 15.3658 7.14577L11.9998 10.5123L8.63354 7.14608C8.43885 6.9514 8.12291 6.9514 7.92791 7.14608L7.14602 7.92796C6.95133 8.12265 6.95133 8.43858 7.14602 8.63358L10.5123 11.9998L7.14602 15.3661C6.95133 15.5608 6.95133 15.8767 7.14602 16.0717L7.92822 16.8539C8.12291 17.0486 8.43885 17.0486 8.63385 16.8539L11.9998 13.4873L15.3661 16.8536C15.5608 17.0483 15.8768 17.0483 16.0718 16.8536L16.854 16.0714C17.0487 15.8767 17.0487 15.5608 16.854 15.3658L13.4874 11.9998Z" fill="red"/>
                  </svg>
                  <label class="link-label">Reject</label>
                </span>
              </div>
            ),
          },
          ],
          data: [],
          list: [],
          setData: null,
          tableLoader: true,
          currentPage: 0, // Track current page
          pageCount: 0, // Track total number of pages
          itemsPerPage: 10, // Items per page
          totalEntries: 0,
          };
      };
      // Methods
      
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
    //
    handleApprove(rowData){
      this.setState({
        showApprove: !this.state.showApprove,
        setData: rowData
      },() => {
     })
    }
    closeApprove(){
      this.setState({
        showApprove: !this.state.showApprove,
        setData: null
      },() => {
     })
    }
    handleReject(rowData){
      this.setState({
        showReject: !this.state.showReject,
        setData: rowData
      },() => {
     })
    }
    closeReject(){
      this.setState({
        showReject: !this.state.showReject,
        setData: null
      },() => {
     })
    }
    // State
    getList(callback){
    this.props.setIsLoadingV2(true);
    const { currentPage, itemsPerPage, } = this.state; // Get current page and items per page
    const offset = currentPage * itemsPerPage; // Calculate offset

      API.request('scholar_request/paginateEndorsed', {
        offset, 
        limit: itemsPerPage,
      }, response => {
          this.props.setIsLoadingV2(false);

          if (response && response.data) {
          
              // const details = [];
              // const list = [];
  
              // response.data.forEach(element => {
              //     details.push(element.details);
              //     list.push(element.list);
              // });
  
              // this.setState({
              //     data: details,
              //     list: list
              // }, () => {
              //     // Call the callback function after setting the state
              //     if (typeof callback === 'function') {
              //         callback();
              //     }
              // });
              const { items, total } = response.data;

              this.setState({
                  data: items.map(item => item.details),
                  list: items.map(item => item.list),
                  pageCount: Math.ceil(total / itemsPerPage),
                  totalEntries: total
              }, () => {
                  if (typeof callback === 'function') {
                      callback();
                  }
              });
          } else {
              console.log('error on retrieve');
              this.props.setIsLoadingV2(false);
              // Optionally, call the callback function with an error or a specific value
              if (typeof callback === 'function') {
                  callback(false);
              }
          }
      }, error => {
          console.log(error);
          this.props.setIsLoadingV2(false);

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
      const { columns, data, tableLoader, showView, showApprove, showReject, setData } = this.state;
      return (
      <div className="">
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Breadcrumbs header="Endorsements" subheader="Here Are All The Endorsed Applicants"/>
      </Box> */}
     
      <div class="contentHeader">
        <div class="contentLabel">
          <h4>Endorsements</h4>
          <p>Here Are All The Endorsed Applicants</p>
        </div>
        {/* <div class="contentButton">
          <button>+ Add New</button>
        </div> */}
      </div>


      <div className="table-container">
        <TableComponent columns={columns} data={data} isLoading={tableLoader}/>
        
      </div>
      <ViewModal
      setData={setData}
      show={showView}
      onHide={()=>{this.closeView()}}
      />
      <ApproveModal
      setData={setData}
      show={showApprove}
      refreshList={()=>{this.getList()}}
      onHide={()=>{this.closeApprove()}}
      />
      <RejectModal
      setData={setData}
      show={showReject}
      refreshList={()=>{this.getList()}}
      onHide={()=>{this.closeReject()}}
      />
    </div>
        )
    }
}
const mapStateToProps = (state) => ({ state });
    
    const mapDispatchToProps = (dispatch) => ({
      setIsLoadingV2: (status) => dispatch({ type: 'SET_IS_LOADING_V2', payload: { status } }),
    });
    
    export default connect(mapStateToProps, mapDispatchToProps)(Endorsements);
// export default Endorsements