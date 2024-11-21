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
          type: '',
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
  generateReport = async (data) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
  
    page.drawText('Report Summary', { x: 50, y: 350, size: 20, color: rgb(0, 0.53, 0.71) });
    page.drawText(`Status: ${this.state.status}`, { x: 50, y: 300, size: 12 });
    page.drawText(`Year: ${this.state.year}`, { x: 50, y: 280, size: 12 });
    page.drawText(`Semester: ${this.state.semester}`, { x: 50, y: 260, size: 12 });
  
    const yStart = 220;
    const rowHeight = 20;
    let yPosition = yStart;
  
    // Check if the status is 'on going' and create the appropriate table
    if (this.state.status === 'on going' && data.scholars) {
      page.drawText('Ongoing Scholars', { x: 50, y: yPosition, size: 14, color: rgb(0, 0.53, 0.71) });
      yPosition -= rowHeight;
      
      // Draw table headers
      page.drawText('Name', { x: 50, y: yPosition, size: 10 });
      page.drawText('Email', { x: 200, y: yPosition, size: 10 });
      page.drawText('Program', { x: 350, y: yPosition, size: 10 });
      yPosition -= rowHeight;
  
      // Draw the scholar data rows
      data.scholars.forEach((scholar) => {
        page.drawText(scholar.name, { x: 50, y: yPosition, size: 10 });
        page.drawText(scholar.email, { x: 200, y: yPosition, size: 10 });
        page.drawText(scholar.program, { x: 350, y: yPosition, size: 10 });
        yPosition -= rowHeight;
      });
    } else if (this.state.status === 'on leave' && data.leaves) {
      // Check if the status is 'on leave' and create the leave data table
      page.drawText('Leave Applications', { x: 50, y: yPosition, size: 14, color: rgb(0, 0.53, 0.71) });
      yPosition -= rowHeight;
  
      // Draw table headers
      page.drawText('Name', { x: 50, y: yPosition, size: 10 });
      page.drawText('Leave Duration', { x: 200, y: yPosition, size: 10 });
      page.drawText('Leave Status', { x: 350, y: yPosition, size: 10 });
      yPosition -= rowHeight;
  
      // Draw the leave application data rows
      data.leaves.forEach((leave) => {
        page.drawText(leave.user_name, { x: 50, y: yPosition, size: 10 });
        page.drawText(`${leave.leave_duration.semester} ${leave.leave_duration.year}`, { x: 200, y: yPosition, size: 10 });
        page.drawText(leave.leave_status, { x: 350, y: yPosition, size: 10 });
        yPosition -= rowHeight;
      });
    }
  
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'Report.pdf');
  };
  
  

  // Clear all fields
  clearFields = () => {
    this.setState({ status: '', year: '', semester: '' });
  };
    
    
    // State
    fetchReportData = () => {
        const { status, year, semester } = this.state;
      
        if (!status || !year || !semester) {
          toast.info("Please fill all fields before generating the report.");
          return;
        }
      
        // API Request
        this.props.setIsLoadingV2(true); // Trigger loading state if applicable
        API.request('user/generateReport', 
          {
            status, 
            year, 
            semester,
          },
          response => {
            if (response) {
              toast.success("Report data fetched successfully");
              // callback(response.data); // Pass the fetched data to the callback
              this.generateReport(response);
            } else {
              toast.error("Error fetching report data.");
              // callback(null); // Handle the error gracefully
            }
            this.props.setIsLoadingV2(false);
          },
          (error) => {
            toast.error("Error during API call:", error);
            this.props.setIsLoadingV2(false);
            // callback(null); // Handle the error gracefully
          }
        );
      }
      
  
  componentDidMount(){
      
  }
    
    render() {
        const { status, year, semester, type } = this.state;
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
            
      </Box>

      <div className="table-container" style={{ backgroundColor: 'transparent', outline: '1px solid #ececec' }}>
      <div className="form-container" style={{ alignContent: 'center' }}>
          <Form>
            <Form.Group controlId="status" style={{ textAlign: 'left' }}>
              <Form.Label>Scholars that are:</Form.Label>
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => this.handleInputChange('status', e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="on going">On Going</option>
                <option value="on leave">On Leave</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="year" className="mt-3" style={{ textAlign: 'left' }}>
              <Form.Label>Of the Year</Form.Label>
              <Form.Control
                as="select"
                value={year}
                onChange={(e) => this.handleInputChange('year', e.target.value)}
              >
                <option value="">Select Year</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="all">All Records</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="semester" className="mt-3" style={{ textAlign: 'left' }}>
              <Form.Label>Of the Semester</Form.Label>
              <Form.Control
                as="select"
                value={semester}
                onChange={(e) => this.handleInputChange('semester', e.target.value)}
              >
                <option value="">Select Semester</option>
                <option value="1st semester">1st Semester</option>
                <option value="2nd semester">2nd Semester</option>
                <option value="summer">Summer</option>
                <option value="all">All Semesters</option>
              </Form.Control>
            </Form.Group>

            <div className="mt-4">
              <Button variant="success" onClick={this.fetchReportData}>
                Generate Report
              </Button>
              <Button variant="secondary" className="ms-2" onClick={this.clearFields}>
                Clear Fields
              </Button>
              {/* <Button variant="primary" onClick={this.fetchReportData}>
                Generate Report
              </Button> */}
              
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
