import React, { Component } from 'react'
import { Navbar, Container, Breadcrumb } from 'react-bootstrap'
import erdt from '../../assets/img/erdtl.png'
import {Sidebar, InputItem, DropdownItem, Icon, Item, Logo, LogoText} from 'react-sidebar-ui'
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faListCheck, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
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
                    
                    <Item 
                    bgColor='light' 
                    classes='sidebarItem'
                    >
                    <Icon>
                        <FontAwesomeIcon icon={faHouse}/>
                    </Icon>
                    Dashboard
                    </Item>

                    <Item 
                    bgColor='light' 
                    classes='sidebarItem'
                    // onClick={this.props.history.push('/endoresedapplicant')}
                    >
                    <Icon>
                        <FontAwesomeIcon icon={faHouse}/>
                    </Icon>
                    Applications
                    </Item>
                    {/* <DropdownItem
                    values={['Existing Applications', 'Record List', 'Scholar List']}
                    bgColor={'light'}
                    classes='sidebarItem'
                    >
                    <div>
                    <Icon>
                        <FontAwesomeIcon icon={faHouse}/>
                    </Icon>
                    </div>
                    <div>
                    Applications
                    </div>
                    </DropdownItem> */}

                    <Item bgColor='light' classes='sidebarItem'>
                    <Icon>
                        <FontAwesomeIcon icon={faListCheck}/>
                    </Icon>
                        Student List
                    </Item>

                    <Item bgColor='light' classes='sidebarItem'>
                    <Icon>
                        <FontAwesomeIcon icon={faGear}/>
                    </Icon>
                        Account Settings
                    </Item>

                    <Item bgColor='light' classes='sidebarItem'>
                    <Icon>
                        <FontAwesomeIcon icon={faRightFromBracket}/>
                    </Icon>
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