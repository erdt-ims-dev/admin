import React, { Component } from 'react'
import Card from 'react-bootstrap/Card';
import './style.css'
import Breadcrumb from '../generic/breadcrumb';
import { faClock } from '@fortawesome/free-regular-svg-icons';
// temporary data, will be using API to retrieve future data
const header = [
  {
    title: "Name"
  },
  {
    title: "Program"
  },
  {
    title: "Date Submitted"
  },
  {
    title: "Actions"
  },
]
const actions = [
        {
            type: "Accept",
            icon: faClock
        },
        {
            type: "View",
            icon: "fasCloud"
        },
        {
            type: "Deny",
            icon: "fasCloud"
        }
        ,
        {
            type: "Remarks",
            icon: "fasCloud"
        }
    ]

const data = [
    {
      name: "Allison Smith",
      program: "MS-ME",
      date: "01-01-23",
    },
    {
        name: "Allison Smith",
        program: "MS-ME",
        date: "01-01-23",
    },
    {
        name: "Allison Smith",
        program: "MS-ME",
        date: "01-01-23",
    },
    {
        name: "Allison Smith",
        program: "MS-ME",
        date: "01-01-23",
    },
  ]
class Leaves extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: null
        };
      }
    render() {
        return (
            <div className='mainContainer'>
                <div className='breadcrumbContainer'>
                    <Breadcrumb
                    header={"Leave Requests"}
                    subheader={"Here are all the leave requests submitted"}/>

                <div className='tableContainer'>
                    <table className='table'>
                        <thead>
                            <tr>
                            {
                                header.map((item, index)=>{
                                    return(
                                    <th>{item.title}</th>
                                    )
                                })
                            }
                            </tr>
                        </thead>
                    <tbody>
                    
                    {
                        data.map((item, index)=>{
                            return(
                            <tr>
                                <td>{item.name}</td>
                                <td>{item.program}</td>
                                <td>{item.date}</td>
                                <td>
                                    {
                                        actions.map((e,n)=>{
                                            return(
                                                <div className='iconStyle'>
                                                    <i className={e.icon}></i>
                                                </div>
                                            )
                                        })
                                    }
                                </td>
                            </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
                </div>
                </div>
              
                
            </div>

        )
    }
}

export default Leaves