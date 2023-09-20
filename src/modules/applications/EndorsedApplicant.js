import React, { Component } from 'react'
import './applications.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCheck, faEye, faX, faComment } from '@fortawesome/free-solid-svg-icons'

const applicants = [
    {name: "Allison Smith", course: "MS-ME", gmail: "jackjones@gmail.com"},
    {name: "Lorenzo Scott", course: "MS-CE", gmail: "georgejones@gmail.com"},
    {name: "Edward Rose", course: "MS-ME", gmail: "georgejones@gmail.com"},
];


class Endorsedapplicant extends Component {

    render() {
        return (
            <div>
                <div className="headerStyle"><h2>ENDORSED APPLICANT</h2></div>
                
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

export default Endorsedapplicant