import React, { Component } from 'react'
import { Navbar, Container, Breadcrumb } from 'react-bootstrap'
import erdt from '../../assets/img/erdtl.png'
import './style.css'


export class SidebarFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: null,
          sidebarOpen: true
        };
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
      }
      onSetSidebarOpen(open) {
        this.setState({ sidebarOpen: open });
      }
    render() {
        const {sidebarOpen} = this.state;
        return (
            <div>
                {/* here */}
            </div>
        )
    }
}

export default SidebarFrame