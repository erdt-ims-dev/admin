import React from 'react'
import './style.css'

function Sidebar() {
  return (
    <div>
        <div className='bg-white sidebar'>
        <div>
            <i className='bi bi-house my-1'></i>
            <span>Dashboard</span>
        </div>
        </div>
        <hr className='text-dark'/>
        <div className='list-group list-group-flush'>
            <a className='list-group-item list-group-item-action my-1'>
                <i className='bi bi-person-fill fs-5 me-2'></i>
                <span>List of Applicants</span>
            </a>
            <a className='list-group-item list-group-item-action my-1'>
                <i className='bi bi-calendar fs-5 me-2'></i>
                <span>Calendar</span>
            </a>
            <a className='list-group-item list-group-item-action my-1'>
                <i className='bi bi-list-task fs-5 me-2'></i>
                <span>Enrolled Students</span>
            </a>
            <a className='list-group-item list-group-item-action my-1'>
                <i className='bi bi-box-arrow-right fs-5 me-2'></i>
                <span>Logout</span>
            </a>

        </div>
    </div>
  )
}

export default Sidebar