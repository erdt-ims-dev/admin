import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import erdt from "../../assets/img/erdt-logo-black.png";
// import {
//   Sidebar,
//   InputItem,
//   DropdownItem,
//   Icon,
//   Item,
//   Logo,
//   LogoText,
// } from "react-sidebar-ui";

import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { 
  faRightFromBracket, 
  faGripHorizontal, 
  faListCheck, 
  faPerson, 
  faPersonWalkingArrowRight,
  faBullhorn,
  faFileInvoice,
  faGear,
  faList,
  faClipboardCheck,
  faScroll
} from "@fortawesome/free-solid-svg-icons";

import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvira } from "@fortawesome/free-brands-svg-icons";

// Modify 'item' as needed
const item = [
  {
    name: "Dashboard",
    route: "/dashboard",
    icon: faGripHorizontal,
  },
  // Staff
  {
    name: "Validate Applications",
    icon: faList,
    route: "/applications",
  },
  // Coordinator
  {
    name: "Manage Approvals",
    icon: faList,
    route: "/applications",
  },
  // Lead
  {
    name: "Manage Endorsements",
    route: "/endorsements",
    icon: faClipboardCheck,
  },
  {
    name: "Manage Scholars",
    icon: faScroll,
    route: "/scholars",
  },
  {
    name: "Manage Leave Requests",
    route: "/leaves",
    icon: faEnvira,
  },
  {
    name: "Settings",
    route: "/settings",
    icon: faGear,
  },
  {
    name: "Logout",
    route: "/logout",
    icon: faRightFromBracket,
  },
];
export class SidebarFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      sidebarOpen: props.openSidebar || null
    };
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }
  componentDidUpdate(prevProps) {
    // Update state if openSidebar prop changes
    if (this.props.openSidebar !== prevProps.openSidebar) {
      this.setState({ sidebarOpen: this.props.openSidebar });
    }
 }
 handleLogout = () => {
  // Perform logout logic here
  this.props.logout();
 };
 onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
 }
  render() {
    const { sidebarOpen } = this.state;
    const { history, show } = this.props;
    return (
      <div className="">
        <Sidebar collapsed={show} collapsedWidth="0" 
        rootStyles={{
          textAlign: "left",
          minHeight: "75vh",
          backgroundColor: "#f1f5fb"
        }}>
        <Menu closeOnClick={true}>
            {item.map((item, index) => {
              if (item.type === 'dropdown') {
                return (
                    <SubMenu icon={<FontAwesomeIcon icon={item.icon} color="grey"/>} key={index} label={item.name}>
                      {item.list.map((element, idx) => (
                        <MenuItem  key={idx} onClick={()=>{history.push(element.route)}}>{element.title} </MenuItem>
                      ))}
                    </SubMenu>
                );
              } else {
                if (item.name === 'Logout') {
                  return (
                   <MenuItem onClick={this.handleLogout} icon={<FontAwesomeIcon icon={item.icon} color="grey"/>} key={index}>{item.name}</MenuItem>
                  );
                }else{
                return (
                    <MenuItem onClick={()=>{history.push(item.route)}} icon={<FontAwesomeIcon icon={item.icon} color="grey"/>} key={index}>{item.name}</MenuItem>
                );
              }
              }
            })}
        </Menu>
        </Sidebar>
      </div>
    );
  }
}

export default withRouter(SidebarFrame);
