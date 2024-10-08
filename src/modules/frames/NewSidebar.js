import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faRightFromBracket, 
  faGripHorizontal, 
  faUser 
} from "@fortawesome/free-solid-svg-icons";

import "./style.css";

// Define sidebar items
const items = [
  {
    name: "Dashboard",
    route: "/dashboard",
    icon: faGripHorizontal,
  },
  {
    name: "Setup Profile",
    route: "/setup",
    icon: faUser,
  },
  {
    name: "Logout",
    route: "/logout",
    icon: faRightFromBracket,
  },
];

class SidebarFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: props.openSidebar || null,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.openSidebar !== prevProps.openSidebar) {
      this.setState({ sidebarOpen: this.props.openSidebar });
    }
  }

  handleLogout = () => {
    // Perform logout logic here
    this.props.logout();
  };

  render() {
    const { sidebarOpen } = this.state;
    const { history, show } = this.props;

    return (
      <div>
        <Sidebar 
          collapsed={show} 
          collapsedWidth="0" 
          rootStyles={{
            textAlign: "left",
            minHeight: "75vh",
          }}
        >
          <Menu closeOnClick>
            {items.map((item, index) => (
              <MenuItem 
                key={index} 
                onClick={item.name === 'Logout' ? this.handleLogout : () => history.push(item.route)} 
                icon={<FontAwesomeIcon icon={item.icon} color="grey" />}
              >
                {item.name}
              </MenuItem>
            ))}
          </Menu>
        </Sidebar>
      </div>
    );
  }
}

export default withRouter(SidebarFrame);
