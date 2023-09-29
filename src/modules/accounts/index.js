import React, { Component } from 'react'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Breadcrumb from '../generic/breadcrumb';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCheck, faEye, faX, faComment } from '@fortawesome/free-solid-svg-icons'

const applicants = [
    {name: "Allison Smith", course: "MS-ME", datesubmitted: "2-23-2023"},
    {name: "Lorenzo Scott", course: "MS-CE", datesubmitted: "11-12-2023"},
    {name: "Edward Rose", course: "MS-ME", datesubmitted: "11-12-2023"},
    {name: "Kylie Bradley", course: "MS-CE", datesubmitted: "11-12-2023"},
];


class AccountList extends Component {

    render() {
        return (
            <div>
                {/* <div className="headerStyle"><h2>List of Accounts</h2></div> */}
                <Breadcrumb
                    header={"List of Accounts"}
                    subheader={"Here are all the Accounts"}/>
                
                <div className='applicanttitle' >
                    <p>Name</p>
                    <p>Course</p>
                    <p>Date Submitted</p>
                    <p >Action</p>
                </div>
                <div className='applicantData'>
                {
                    applicants.map((applicant, idx) => (
                       
                            <div key={idx}>
                                <p>{applicant.name}</p>
                                <p>{applicant.course}</p>
                                <p>{applicant.datesubmitted}</p>
                                <p> 
                                    <FontAwesomeIcon icon={faCheck} size="sm" style={{color: "#2ead43", margin:"0px 5px", cursor: "pointer"}} />
                                    <FontAwesomeIcon icon={faEye} size="sm" style={{color: "#66a5e2", margin:"0px 5px", cursor: "pointer"}}/>
                                    <FontAwesomeIcon icon={faX} size="sm" style={{color: "#ff0808", margin:"0px 5px", cursor: "pointer"}}/>
                                    <FontAwesomeIcon icon={faComment} size="sm" style={{color: "#71abe4", margin:"0px 5px", cursor: "pointer"}}/>
                                </p>
                            </div> 
                        
                    ))
                }  
                </div> 
            </div>
        )
    }
}

export default AccountList