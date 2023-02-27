import React, { Component } from 'react'
import './applications.css'


// const applicants = [
//     {name: "Jack C. Jones", course: "MS EE", gmail: "jackjones@gmail.com"},
//     {name: "George C. Jones", course: "MS ECE", gmail: "georgejones@gmail.com"},
// ];

class Endorsedapplicant extends Component {

    render() {
        return (
            <div>
                <h2>VIEW ENDORSED APPLICANT</h2>
                <h3>1ST SEMESTER 2022 </h3>
                {/* {
                    applicants?.map((applicant, idx) => (
                        <div key={idx}>
                            <p>{applicant.name}</p>
                            <p>{applicant.course}</p>
                            <p>{applicant.gmail}</p>
                            
                        </div>
                    ))
                } */}
            </div>
        )
    }
}

export default Endorsedapplicant