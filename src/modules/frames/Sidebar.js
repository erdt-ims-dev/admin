import React, { Component } from 'react'
import { Navbar, Container, Breadcrumb } from 'react-bootstrap'
import erdt from '../../assets/img/erdtl.png'
import {Sidebar, InputItem, DropdownItem, Icon, Item, Logo, LogoText} from 'react-sidebar-ui'
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faListCheck, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

// Modify 'item' as needed
const item = [
    {
        name: "Dashboard",
        route: "/dashboard",
        icon: faHouse
    },
    {
        name: "Applications",
        route: "/applications",
        icon: faListCheck
    },
    {
        name: "Student List",
        route: "/list",
        icon: faListCheck
    },
    {
        name: "Settings",
        route: "/settings",
        icon: faGear
    },
    {
        name: "Logout",
        route: "/logout",
        icon: faRightFromBracket
    },
]
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
                <Sidebar classes='sidebarStyles' bgColor='white' isCollapsed={sidebarOpen}>
                    {/* <Logo
                    image={erdt}
                    imageName='react logo'/> */}
                    {/* <LogoText>Sidebar Test</LogoText> */}
                    {
                        item.map((item, index)=>{
                            return(
                                <Item 
                                bgColor='white' 
                                classes='sidebarItem'
                                // I used this.props.navigate here <Sidebar/> is being called by App.js directly. You can call this.props.navigate as is
                                onClick={()=> this.props.navigate(item.route)}
                                key={index}
                                >
                                <Icon style={{
                                    "margin-left" : "10%"
                                }} >
                                    <FontAwesomeIcon icon={item.icon}/>
                                </Icon>
                                <p style={{
                                    "margin-left": "15%"
                                }} classes='sidebarText sidebarMargin'>{item.name}</p>
                                
                                </Item>
                            )
                        })
                    }
                    {/* <InputItem type='text' placeholder={'Search...'}/> */}
                </Sidebar>
            </div>
        )
    }
}

export default SidebarFrame