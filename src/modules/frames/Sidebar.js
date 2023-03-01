import React, { Component } from 'react'
import { Navbar, Container, Breadcrumb } from 'react-bootstrap'
import erdt from '../../assets/img/erdtl.png'
import {Sidebar, InputItem, DropdownItem, Icon, Item, Logo, LogoText} from 'react-sidebar-ui'

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
                <Sidebar bgColor='light' isCollapsed={false}>
                    <Logo
                    image={erdt}
                    imageName='react logo'/>
                    <LogoText>Sidebar Test</LogoText>
                    {/* <DropdownItem
                    values={['First', 'Second', 'Third']}
                    bgColor={'light'}
                    >
                    Dashboard
                    </DropdownItem> */}
                    <Item 
                    bgColor='light' 
                    classes='sidebarItem'
                    >
                    <Icon><i className="fas fa-home"/></Icon>
                    Dashboard
                    </Item>

                    <Item 
                    bgColor='light' 
                    classes='sidebarItem'
                    // onClick={this.props.history.push('/endoresedapplicant')}
                    >
                    <Icon><i className="fas fa-home"/></Icon>
                    Applications
                    </Item>

                    <Item bgColor='light' classes='sidebarItem'>
                    <Icon><i className="fas fa-info"/></Icon>
                    Student List
                    </Item>

                    <Item bgColor='light' classes='sidebarItem'>
                    <Icon><i className="fas fa-sitemap"/></Icon>
                    Account Settings
                    </Item>

                    <Item bgColor='light' classes='sidebarItem'>
                    <Icon><i className="far fa-address-book"/></Icon>
                    Logout
                    </Item>

                    <Item bgColor='light'>
                    
                    </Item>
                    {/* <InputItem type='text' placeholder={'Search...'}/> */}
                </Sidebar>
            </div>
        )
    }
}

export default SidebarFrame