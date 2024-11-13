import React, { Component } from 'react'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faEye, faThumbsUp, faSearch  } from '@fortawesome/free-solid-svg-icons'

import { Box } from "@mui/material";
import Breadcrumbs from "../generic/breadcrumb";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import  TableComponent  from 'modules/generic/tableV3/index';
import ViewModal from './viewModal/index'
import EditModal from './editModal/index'
import DeleteModal from './deleteModal/index'
import API from 'services/Api'
import ReactPaginate from 'react-paginate';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify'; // Toast notification
class Accounts extends Component {
    constructor(props) {
      super(props);
      this.state = {
        account_list: [],
        showView: false,
        showDelete: false,
        showEdit: false,
        searchQuery: '',
        columns: [
          {
            Header: 'Email',
            accessor: 'email',
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
          {
            Header: 'Account Type',
            accessor: 'account_type',
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
                <span className='link' onClick={() => this.handleEdit(row.original)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5721 14.7789L16.5722 13.779C16.7284 13.6228 17.0003 13.7322 17.0003 13.9571V18.5002C17.0003 19.3282 16.3284 20 15.5003 20H4.50003C3.67189 20 3 19.3282 3 18.5002V7.50183C3 6.67383 3.67189 6.00205 4.50003 6.00205H13.0471C13.269 6.00205 13.3815 6.27076 13.2252 6.43011L12.2252 7.42997C12.1783 7.47683 12.1158 7.50183 12.0471 7.50183H4.50003V18.5002H15.5003V14.9539C15.5003 14.8882 15.5253 14.8258 15.5721 14.7789ZM20.466 8.47356L12.2596 16.6786L9.43451 16.9911C8.61575 17.0817 7.91886 16.3912 8.00948 15.5663L8.32199 12.7417L16.5284 4.53664C17.2441 3.82112 18.4003 3.82112 19.1128 4.53664L20.4629 5.88644C21.1785 6.60196 21.1785 7.76117 20.466 8.47356ZM17.3784 9.43905L15.5628 7.62369L9.7564 13.4322L9.52827 15.4725L11.5689 15.2444L17.3784 9.43905ZM19.4035 6.94879L18.0535 5.59898C17.9253 5.47088 17.7159 5.47088 17.5909 5.59898L16.6253 6.56447L18.441 8.37983L19.4066 7.41434C19.5316 7.28311 19.5316 7.07689 19.4035 6.94879Z" fill="#404041"/>
                  </svg>
                  <label class="link-label">Edit</label>
                </span>
                <span className='link' onClick={() => this.handleDeactivate(row.original)}>
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
          setData: null,
          tableLoader: true,
          currentPage: 0, // Track current page
          pageCount: 0, // Track total number of pages
          itemsPerPage: 10, // Items per page
          totalEntries: 0,
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

    handleDeactivate(rowData){
      this.setState({
        showDelete: !this.state.showDelete,
        setData: rowData
      },() => {
     })
    }
    onDeactivate(){
      const {setData} = this.state
      this.props.setIsLoadingV2(true)
      API.request('user/delete', {
          id: setData.id
      }, response => {
        if (response && response.data) {
          toast.success("Account Deactivated")
          this.closeDelete()
          this.getList()
        }else{
          toast.error("There was an error on deletion. Please try again")
          // console.log('error on retrieve')
        }
        this.props.setIsLoadingV2(false)
      }, error => {
        toast.error("An error occurred. Please try again.")
        this.props.setIsLoadingV2(false)
        // console.log(error)
      })
    }
    closeDelete(){
      this.setState({
        showDelete: !this.state.showDelete,
        setData: null
      },() => {
     })
    }
    // State
    getList(callback){
      this.props.setIsLoadingV2(true);
      const { currentPage, itemsPerPage, searchQuery } = this.state; // Get current page and items per page
      const offset = currentPage * itemsPerPage; // Calculate offset

      // console.log("page", currentPage, itemsPerPage, searchQuery, offset)
      API.request('user/paginate', {
        offset, 
        limit: itemsPerPage,
        search: searchQuery
      }, response => {
        this.props.setIsLoadingV2(false);
          if (response && response.data) {
            // console.log('Total Entries:', response.data.total); // Debug log

              this.setState({
                  account_list: response.data.accounts,
                  pageCount: Math.ceil(response.data.total / itemsPerPage),
                  tableLoader: false,
                  totalEntries: response.data.total, // Set total entries

              }, () => {
                // console.log("Updated account list:", this.state.account_list);
                  // Call the callback function after setting the state
                  if (typeof callback === 'function') {
                      callback();
                  }
              });
          } else {
              // console.log('error on retrieve');
              // Optionally, call the callback function with an error or a specific value
              if (typeof callback === 'function') {
                  callback(false);
              }
          }
      }, error => {
          // console.log(error);
          this.props.setIsLoadingV2(false);
          // Optionally, call the callback function with an error or a specific value
          if (typeof callback === 'function') {
              callback(false);
          }
      });
  }
  handlePageClick = (data) => {
    const selectedPage = data.selected; // Get the selected page index
    this.setState({ currentPage: selectedPage, tableLoader: true }, () => {
        this.getList(); // Fetch data for the selected page
    });
};

  // Method to handle the search
  handleSearch = () => {
    this.getList();
  };
  componentDidMount(){
      this.getList(() => {
          // This function will be called after getList successfully retrieves data
          this.setState({
              tableLoader: false,
          });
      });
  }
    
    render() {
      const { searchQuery, totalEntries, itemsPerPage, columns, account_list, showEdit, showDelete, showView, setData, tableLoader, pageCount } = this.state;
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
        <Breadcrumbs header="Account List" subheader="All Existing Accounts are Listed Here"/>
         {/* <Button onClick={()=>{ history.push('/#')}}>
           Add New Account
         </Button> */}

                    
      </Box>
      <Box>
      <InputGroup className="mb-3 mt-3">
          <FormControl
              placeholder="Search Account"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => this.setState({ searchQuery: e.target.value })}
          />
          <Button variant="outline-secondary" onClick={this.handleSearch}>
              <FontAwesomeIcon icon={faSearch} />
          </Button>
      </InputGroup>
      </Box>
          {/* with scroll */}
          {/* <div className="table-container" style={{ overflowY: 'auto', maxHeight: '600px' }}> */}
         
          <div className="table-container" style={{background: 'none'}}> 

            <TableComponent columns={columns} data={account_list} isLoading={tableLoader}/>
            {totalEntries > itemsPerPage && ( // Conditionally render pagination
                        <ReactPaginate
                            previousLabel={'Previous'}
                            nextLabel={'Next'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            activeClassName={'active'}
                        />
                    )}

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
    </div>
        )
    }
}

const mapStateToProps = (state) => ({ state });

const mapDispatchToProps = (dispatch) => ({
  setIsLoading: (status) => dispatch({ type: 'SET_IS_LOADING', payload: { status } }),
  setIsLoadingV2: (status) => dispatch({ type: 'SET_IS_LOADING_V2', payload: { status } }),
  userActivity: () => dispatch({ type: 'USER_ACTIVITY' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Accounts));