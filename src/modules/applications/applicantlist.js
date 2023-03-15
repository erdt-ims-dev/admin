import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faEye } from '@fortawesome/free-regular-svg-icons'
import './applications.css'


const accounts = [
    {}
]
class Accountlist extends Component {
    render() {
        return (
            <div>
                <div>
                    <div className='pagename'><h1>LIST OF APPLICANTS</h1></div>
                    <div className='pagebutton'><button>+ Add new applicants</button></div>
                </div>
                <div>
                    <div className='applicanttable'>
                        <table style={{width: "100%"}}>
                            <tr>
                                <th>Name</th>
                                <th>Program</th>
                                <th>Actions</th>
                            </tr>
                            <tr>
                                <td>Alison Smith</td>
                                <td>MS-ME</td>
                                <td><FontAwesomeIcon icon={faThumbsUp}/><FontAwesomeIcon icon={faEye}/></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Accountlist