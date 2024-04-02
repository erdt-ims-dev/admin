import "./App.css";
import RouterList from "./routes";

import Header from "./modules/frames/Header";
import Footer from "./modules/frames/Footer";
import Sidebar from "./modules/frames/Sidebar";

import { connect, useSelector } from 'react-redux';
import { withRouter } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import React, { useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Login from "./modules/auth/login"
import Register from "./modules/auth/register"

function App(props) {
  const history = useHistory();
  const location = useLocation()

  const user = useSelector(state => state.user)
  const isLoggedIn = useSelector(state=> state.isLoggedIn)

  const [openSidebar, setOpenSidebar] = useState(false);
  const navigate = (route) => {
    if (route === '/logout') {
      const { logout } = props;
      logout();
    } else {
      history.push(route);
    }
 };
  const handleOpenSidebar = () => {
    console.log('fire');
    setOpenSidebar(!openSidebar);
 };

  let renderComponent;
  if (location.pathname === '/register') {
    renderComponent = <Register navigate={navigate} />;
  } else if (location.pathname === '/login') {
    renderComponent = <Login navigate={navigate} />;
  }else{
    renderComponent = <Login navigate={navigate} />;
  }
  
  return (
    <div className="App">
      <React.Fragment>
        {isLoggedIn ? (
          <span>
            <Header handleOpenSidebar={handleOpenSidebar}  {...props} />
            <div className="mainContainer">
              <div className={"sidebarContainer" + (openSidebar ? "" : " hidden")}>
                <Sidebar show={openSidebar} {...props} navigate={navigate} />
              </div>

              <div className="pageContainer">
                <RouterList />
              </div>
            </div>
            <Footer />
          </span>
        ) : (
          <span>
            {renderComponent}
            <Footer />
          </span> 
        )}
        
      </React.Fragment>
    </div>
  );
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch({ type: 'LOGOUT' }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
