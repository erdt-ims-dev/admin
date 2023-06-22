import React, { Component } from 'react'
import { Navbar, Container, Breadcrumb } from 'react-bootstrap'
import erdt from '../../assets/img/erdtl.png'
import {Sidebar, InputItem, DropdownItem, Icon, Item, Logo, LogoText} from 'react-sidebar-ui'
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faListCheck, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
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
          sidebarOpen: false
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
                    {/* <Logo
                    image={erdt}
                    imageName='react logo'/> */}
                    {/* <LogoText>Sidebar Test</LogoText> */}
                    {
                        item.map((item, index)=>{
                            return(
                                <Item 
                                bgColor='light' 
                                classes='sidebarItem'
                                >
                                <Icon >
                                    <FontAwesomeIcon icon={item.icon}/>
                                </Icon>
                                <p classes='sidebarText'>{item.name}</p>
                                
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