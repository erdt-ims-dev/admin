import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faEye } from '@fortawesome/free-regular-svg-icons'
import './applications.css'


const accounts = [
    {}
]
class Applicantlist extends Component {
    render() {
        return (
            <div>
                <div>
                    <div className='pagename'><h1>LIST OF APPLICANTS</h1></div>
                    <div className='pagebutton'><button>+ Add new applicants</button></div>
                </div>
                <div>
                    <table className='applicanttable'>
                        <tr>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Type</th>
                            <th></th>
                        </tr>
                        <tr>
                            <td>Alison Smith</td>
                            <td>1/1/2023</td>
                            <td>ACTIVE</td>
                            <td>STAFF</td>
                            <td><div>DELETE</div><div>EDIT</div></td>
                        </tr>
                    </table>
                </div>
            </div>
        )
    }
}

export default Applicantlist