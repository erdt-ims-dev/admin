import React, { Component } from 'react'
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
                    <div className='pagesearch'><input type="search"></input></div>
                </div>
            </div>
        )
    }
}

export default Applicantlist