import React, { Component } from 'react'
import './styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faEye, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux';

import { Box } from "@mui/material";
import Breadcrumbs from "../generic/breadcrumb";
import { Button, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";


import API from 'services/Api'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify'; // Toast notification
import ReactPaginate from 'react-paginate';

import { PDFDocument, rgb } from 'pdf-lib';
import saveAs from 'file-saver';

class Reports extends Component {
    constructor(props) {
      super(props);
      this.state = {
          status: '',
          year: '',
          semester: ''
        };
      };
  
      
    // Form handling
    // Handle input changes
  handleInputChange = (field, value) => {
    this.setState({ [field]: value });
  };

  // Generate report using pdf-lib
  generateReport = async () => {
    const { status, year, semester } = this.state;

    if (!status || !year || !semester) {
      alert("Please fill all fields before generating the report.");
      return;
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    page.drawText('Report Summary', { x: 50, y: 350, size: 20, color: rgb(0, 0.53, 0.71) });
    page.drawText(`Status: ${status}`, { x: 50, y: 300, size: 12 });
    page.drawText(`Year: ${year}`, { x: 50, y: 280, size: 12 });
    page.drawText(`Semester: ${semester}`, { x: 50, y: 260, size: 12 });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'Report.pdf');
  };

  // Clear all fields
  clearFields = () => {
    this.setState({ status: '', year: '', semester: '' });
  };
    
    
    // State
    fetchReportData(callback) {
        const { status, year, semester } = this.state;
      
        if (!status || !year || !semester) {
          alert("Please fill all fields before generating the report.");
          return;
        }
      
        // API Request
        this.props.setIsLoadingV2(true); // Trigger loading state if applicable
        API.request(
          'report/generate', // Your API endpoint
          {
            status, 
            year, 
            semester,
          },
          (response) => {
            if (response && response.data) {
              console.log("Report data fetched successfully:", response.data);
              callback(response.data); // Pass the fetched data to the callback
            } else {
              console.error("Error fetching report data.");
              callback(null); // Handle the error gracefully
            }
            this.props.setIsLoadingV2(false);
          },
          (error) => {
            console.error("Error during API call:", error);
            this.props.setIsLoadingV2(false);
            callback(null); // Handle the error gracefully
          }
        );
      }
      
  
  componentDidMount(){
      
  }
    
    render() {
        const { status, year, semester } = this.state;
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
        <Breadcrumbs header="Generate Report" subheader="Generate a report here"/>
            
            
        {/* <div class="contentButton">
          <button onClick={()=>{ history.push('/new_application')}}>+ Add New Application</button>
        </div> */}
      </Box>

      <div className="table-container">
      <div className="form-container">
          <Form>
            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => this.handleInputChange('status', e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="applications">Applications</option>
                <option value="scholar">Scholar</option>
                <option value="leaves">Leaves</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="year" className="mt-3">
              <Form.Label>Year</Form.Label>
              <Form.Control
                as="select"
                value={year}
                onChange={(e) => this.handleInputChange('year', e.target.value)}
              >
                <option value="">Select Year</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="semester" className="mt-3">
              <Form.Label>Semester</Form.Label>
              <Form.Control
                as="select"
                value={semester}
                onChange={(e) => this.handleInputChange('semester', e.target.value)}
              >
                <option value="">Select Semester</option>
                <option value="1st semester">1st Semester</option>
                <option value="2nd semester">2nd Semester</option>
                <option value="summer">Summer</option>
              </Form.Control>
            </Form.Group>

            <div className="mt-4">
              <Button variant="primary" onClick={this.generateReport}>
                Generate Report
              </Button>
              <Button variant="secondary" className="ms-2" onClick={this.clearFields}>
                Clear Fields
              </Button>
            </div>
          </Form>
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
