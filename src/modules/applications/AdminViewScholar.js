import React, { Component } from 'react'
import './applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faEye, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

const applicants = [
    {name: "Allison Smith", course: "MS-ME", gmail: "jackjones@gmail.com"},
    {name: "Lorenzo Scott", course: "MS-CE", gmail: "georgejones@gmail.com"},
    {name: "Edward Rose", course: "MS-ME", gmail: "georgejones@gmail.com"},
];


class Endorsedapplicant extends Component {

    render() {
        return (
            <div>
                <div className="headerStyle">
                    <div style={{width:'50%'}}><h2>VIEW APPLICATION</h2></div>
                    <div style={{width:'50%'}}><h4>1st SEMESTER 2022</h4></div>
                </div>
                
                <div className='applicanttitle'>
                    <p>Name</p>
                    <p>Course</p>
                    <p>Action</p>
                </div>
                <div className='applicantData'>
                {
                    applicants.map((applicant, idx) => (
                       
                            <div key={idx}>
                                <p>{applicant.name}</p>
                                <p>{applicant.course}</p>
                                
                                <p> 
                                    <FontAwesomeIcon icon={faThumbsUp} style={{color: "#70f26e", margin:"0px 5px", cursor: "pointer"}} />
                                    <FontAwesomeIcon icon={faEye} size="sm" style={{color: "#66a5e2", margin:"0px 5px", cursor: "pointer"}}/>
                                </p>
                            </div> 
                        
                    ))
                }  
                </div> 
            </div>
        )
    }
}

export default Endorsedapplicant