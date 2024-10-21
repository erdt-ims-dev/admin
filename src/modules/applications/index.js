import React, { Component } from 'react'
import './applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faEye, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux';

import { Box } from "@mui/material";
import Breadcrumbs from "../generic/breadcrumb";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import  TableComponent  from 'modules/generic/tableV3/index';
import ViewModal from './viewModal/index'
import EditModal from './editModal/index'
import EndorseModal from './endorseModal/index'
import RemarksModal from './remarksModal/index'
import RejectModal from './rejectModal/index'

import API from 'services/Api'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

class Applications extends Component {
    constructor(props) {
      super(props);
      this.state = {
        applicant_list: [],
        showView: false,
        showEndorse: false,
        showEdit: false,
        showRemarks: false,
        showReject: false,
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
                {/* <span className='link' onClick={() => this.openView(row.original)}>View</span> */}
                <span className='link' onClick={() => this.openEdit(row.original)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5721 14.7789L16.5722 13.779C16.7284 13.6228 17.0003 13.7322 17.0003 13.9571V18.5002C17.0003 19.3282 16.3284 20 15.5003 20H4.50003C3.67189 20 3 19.3282 3 18.5002V7.50183C3 6.67383 3.67189 6.00205 4.50003 6.00205H13.0471C13.269 6.00205 13.3815 6.27076 13.2252 6.43011L12.2252 7.42997C12.1783 7.47683 12.1158 7.50183 12.0471 7.50183H4.50003V18.5002H15.5003V14.9539C15.5003 14.8882 15.5253 14.8258 15.5721 14.7789ZM20.466 8.47356L12.2596 16.6786L9.43451 16.9911C8.61575 17.0817 7.91886 16.3912 8.00948 15.5663L8.32199 12.7417L16.5284 4.53664C17.2441 3.82112 18.4003 3.82112 19.1128 4.53664L20.4629 5.88644C21.1785 6.60196 21.1785 7.76117 20.466 8.47356ZM17.3784 9.43905L15.5628 7.62369L9.7564 13.4322L9.52827 15.4725L11.5689 15.2444L17.3784 9.43905ZM19.4035 6.94879L18.0535 5.59898C17.9253 5.47088 17.7159 5.47088 17.5909 5.59898L16.6253 6.56447L18.441 8.37983L19.4066 7.41434C19.5316 7.28311 19.5316 7.07689 19.4035 6.94879Z" fill="#404041"/>
                  </svg>
                  <label class="link-label">Edit</label>
                </span>
                <span className='link' onClick={() => this.openEndorse(row.original)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.5068 6.85481L9.45265 14.6991L6.49327 11.8168C6.34979 11.6771 6.11715 11.6771 5.97363 11.8168L5.10761 12.6603C4.96413 12.8 4.96413 13.0266 5.10761 13.1664L9.19281 17.1452C9.33629 17.2849 9.56894 17.2849 9.71245 17.1452L18.8924 8.20437C19.0359 8.06463 19.0359 7.83805 18.8924 7.69827L18.0264 6.85481C17.8829 6.71506 17.6502 6.71506 17.5068 6.85481Z" fill="#10b798"/>
                  </svg>
                  <label class="link-label">Endorse</label>
                </span>
                <span className='link' onClick={() => this.openReject(row.original)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.4874 11.9998L16.8537 8.63358C17.0484 8.4389 17.0484 8.12296 16.8537 7.92796L16.0715 7.14577C15.8768 6.95108 15.5608 6.95108 15.3658 7.14577L11.9998 10.5123L8.63354 7.14608C8.43885 6.9514 8.12291 6.9514 7.92791 7.14608L7.14602 7.92796C6.95133 8.12265 6.95133 8.43858 7.14602 8.63358L10.5123 11.9998L7.14602 15.3661C6.95133 15.5608 6.95133 15.8767 7.14602 16.0717L7.92822 16.8539C8.12291 17.0486 8.43885 17.0486 8.63385 16.8539L11.9998 13.4873L15.3661 16.8536C15.5608 17.0483 15.8768 17.0483 16.0718 16.8536L16.854 16.0714C17.0487 15.8767 17.0487 15.5608 16.854 15.3658L13.4874 11.9998Z" fill="red"/>
                  </svg>
                  <label class="link-label">Reject</label>
                </span>
                <span className='link' onClick={() => this.openRemarks(row.original)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.8044 17.7811C20.7887 17.7686 20.0983 17.0251 19.6203 16.066C20.4795 15.2194 20.9949 14.1572 20.9949 12.9981C20.9949 10.4989 18.605 8.43386 15.4903 8.06521C14.5093 6.26574 12.1944 5.00049 9.4983 5.00049C5.90873 5.00049 3.00021 7.23733 3.00021 9.99902C3.00021 11.1549 3.51568 12.2171 4.37481 13.0669C3.89682 14.026 3.20952 14.7695 3.19703 14.782C3.00021 14.9913 2.94398 15.2975 3.05957 15.563C3.17203 15.8286 3.43446 16.0004 3.72187 16.0004C5.39326 16.0004 6.74286 15.3693 7.63323 14.7882C7.91752 14.8538 8.20806 14.9038 8.50797 14.9382C9.49205 16.7345 11.8039 17.9998 14.5 17.9998C15.1498 17.9998 15.7746 17.9248 16.3682 17.7874C17.2585 18.3653 18.605 18.9995 20.2795 18.9995C20.5669 18.9995 20.8262 18.8277 20.9418 18.5621C21.0543 18.2966 21.0012 17.9904 20.8044 17.7811ZM7.85504 13.8104L7.44266 13.7167L7.08651 13.9479C6.45857 14.3571 5.50885 14.8289 4.34669 14.9632C4.62161 14.6102 4.97775 14.1009 5.26829 13.5136L5.5932 12.8638L5.07773 12.3546C4.58412 11.8703 3.99992 11.0675 3.99992 9.99902C3.99992 7.79342 6.46794 6.00019 9.4983 6.00019C12.5287 6.00019 14.9967 7.79342 14.9967 9.99902C14.9967 12.2046 12.5287 13.9978 9.4983 13.9978C8.94534 13.9978 8.39238 13.9354 7.85504 13.8104ZM16.9086 16.947L16.5525 16.7158L16.1401 16.8126C15.6028 16.9376 15.0498 17.0001 14.4968 17.0001C12.4631 17.0001 10.6855 16.191 9.73573 14.9913C13.2128 14.8913 15.9964 12.6982 15.9964 9.99902C15.9964 9.70223 15.9558 9.41482 15.8933 9.13365C18.2489 9.58664 19.9952 11.1456 19.9952 12.9981C19.9952 14.0666 19.411 14.8695 18.9174 15.3537L18.4019 15.8629L18.7237 16.5096C19.0174 17.1001 19.3735 17.6093 19.6453 17.9592C18.4863 17.828 17.5366 17.3531 16.9086 16.947Z" fill="#404041"/>
                  </svg>
                  <label class="link-label">Remarks</label>
                </span>
              </div>
            ),
          },
          ],
          data: [], // will contain the finalized value to be displayed in the Table Component
          setData: null, // will contain which row has been selected and details associated with it
          list: null, // will contain the current Applicant List pulled from DB
          tableLoader: true  
        };
      };
      // Modal Handling
    //   openView(rowData){
    //     console.log('Opening ViewModal');

    //   this.setState({
    //     showView: !this.state.showView,
    //     setData: rowData
    //   },() => {
    //  })
    // }
    // closeView(){
    //   this.setState({
    //     showView: !this.state.showView,
    //     setData: null
    //   },() => {
    //  })
    // }
    openEdit(rowData){
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
    openEndorse(rowData){
      this.setState({
        showEndorse: !this.state.showEndorse,
        setData: rowData
      },() => {
     })
    }
    closeEndorse(){
      this.setState({
        showEndorse: !this.state.showEndorse,
        setData: null
      },() => {
     })
    }
    openReject(rowData){
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
    openRemarks(rowData){
      this.setState({
        showRemarks: !this.state.showRemarks,
        setData: rowData
      },() => {
     })
    }
    closeRemarks(){
      this.setState({
        showRemarks: !this.state.showRemarks,
        // setData: null
      },() => {
     })
    }
    // Form handling
    
    
    
    // State
    getList(callback){
      API.request('scholar_request/retrievePendingTableAndDetail', {}, response => {
          if (response && response.data) {
              const details = [];
              const list = [];
  
              response.data.forEach(element => {
                  details.push(element.details);
                  list.push(element.list);
              });
  
              this.setState({
                  data: details,
                  list: list
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
      const { columns, data, showEdit, showEndorse, showReject, showView, showRemarks, setData, tableLoader } = this.state;
      const {history} = this.props;
      return (
      <div className="">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Breadcrumbs header="Applications" subheader="All Application Requests Are Listed Here"/>
        
        {/* <Button style={{
          fontSize: '14px',
        }} onClick={()=>{ history.push('/new_application')}}>
          Add New Applicant
            </Button> */}
            
            
        <div class="contentButton">
          <button onClick={()=>{ history.push('/new_application')}}>+ Add New</button>
        </div>
      </Box>

      <div className="table-container">
        <TableComponent columns={columns} data={data} isLoading={tableLoader}/>
        
      </div>
      {/* <ViewModal
      setData={setData}
      show={showView}
      onHide={()=>{this.closeView()}}
      /> */}
      <EndorseModal
      setData={setData}
      show={showEndorse}
      onHide={()=>{this.closeEndorse()}}
      refreshList={()=>{this.getList()}}
      />
      <EditModal
      setData={setData}
      show={showEdit}
      refreshList={()=>{this.getList()}}
      onHide={()=>{this.closeEdit()}}
      />
      <RejectModal
      setData={setData}
      show={showReject}
      refreshList={()=>{this.getList()}}
      onHide={()=>{this.closeReject()}}
      />
      <RemarksModal
      setData={setData}
      show={showRemarks}
      refreshList={()=>{this.getList()}}
      onHide={()=>{this.closeRemarks()}}
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
      setIsLoadingV2: (status) => {
        dispatch({ type: 'SET_IS_LOADING_V2', payload: { status } });
      }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Applications);
