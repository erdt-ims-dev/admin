import React, { Component } from "react";
import { Navbar, Container, Breadcrumb } from "react-bootstrap";
import erdt from "../../assets/img/erdt-logo-black.png";
import {
  Sidebar,
  InputItem,
  DropdownItem,
  Icon,
  Item,
  Logo,
  LogoText,
} from "react-sidebar-ui";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faListCheck,
  faGear,
  faRightFromBracket,
  faPerson,
  faPersonWalkingArrowRight,
  faBullhorn,
  faFileInvoice,
  faGripHorizontal,
} from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "react-router-dom";

// Modify 'item' as needed
const item = [
  {
    name: "Dashboard",
    route: "/dashboard",
    icon: faGripHorizontal,
  },
  {
    name: "Applicant Management",
    route: "/applications",
    icon: faListCheck,
  },
  {
    name: "Scholar Management",
    route: "/scholars",
    icon: faPerson,
  },
  {
    name: "Leave Requests",
    route: "/#",
    icon: faPersonWalkingArrowRight,
  },
  {
    name: "System Announcements",
    route: "/announcements",
    icon: faBullhorn,
  },
  {
    name: "Account Management",
    route: "/#",
    icon: faFileInvoice,
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

 onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
 }
  render() {
    const { sidebarOpen } = this.state;
    const { history, show } = this.props;
    return (
      <div>
        <Sidebar
          classes="sidebarStyles"
          bgColor="white"
          isCollapsed={show}
        >
          {/* <Logo
            image={erdt}
            imageName='react logo'
            style={{
              height: 'auto',
              width: '50%'
            }}
            /> */}
          <LogoText>eSMP</LogoText>
          {item.map((item, index) => {
            return (
              <Item
                bgColor="white"
                classes="sidebarItem"
                // I used this.props.navigate here <Sidebar/> is being called by App.js directly. You can call this.props.navigate as is
                onClick={() => history.push(item.route)}
                key={index}
              >
                <Icon
                  style={{
                    "margin-left": "10%",
                  }}
                >
                  <FontAwesomeIcon icon={item.icon} />
                </Icon>
                <p
                  style={{
                    "margin-left": "15%",
                  }}
                  classes="sidebarText sidebarMargin"
                >
                  {item.name}
                </p>
              </Item>
            );
          })}
          {/* <InputItem type='text' placeholder={'Search...'}/> */}
        </Sidebar>
      </div>
    );
  }
}

export default withRouter(SidebarFrame);
