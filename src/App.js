import "./App.css";
import RouterList from "./routes";

import Header from "./modules/frames/Header";
import Footer from "./modules/frames/Footer";
import Sidebar from "./modules/frames/Sidebar";

import { connect, useSelector } from 'react-redux';
import { withRouter } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import React, { useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function App(props) {
  const history = useHistory()

  const user = useSelector(state => state.user)
  const [isLoggedIn, setIsLoggedIn ] = useState(false)
  const [openSidebar, setOpenSidebar ] = useState(false)
  const navigate = (route) => {
    if(route == '/logout'){
      const{ logout } = props;
      logout()
    }else{
      history.push(route)
    }
  }
  const handleOpenSidebar = () => {
    console.log('fire')
    setOpenSidebar(!openSidebar);
    
 };
  
  return (
    <div className="App">
      <React.Fragment>
        <Header handleOpenSidebar={handleOpenSidebar}  {...props} />
        <div className="mainContainer">
          {
            <div className={"sidebarContainer" + openSidebar ? "sidebarContainer": "hidden"}>
              <Sidebar show={openSidebar} {...props} />
            </div>
          }

          <div className="pageContainer">
            {user}
            <RouterList />
          </div>
        </div>
        <Footer />
      </React.Fragment>
    </div>
  );
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('reduxhandler');
  return {
    login: (user, token) => dispatch(actions.login(user, token)),
    logout: () => dispatch(actions.logout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
