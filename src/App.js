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
import Colors from 'common/Colors'
import Login from "./modules/auth/login"
import Register from "./modules/auth/register"
import Spinner from 'modules/generic/spinner'
function App(props) {
  const history = useHistory();
  const location = useLocation()



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
  const {user, token, details, isLoading, isLoggedIn} = props.state
  return (
    <div>
    {
      (user && token && !isLoading)&&(
      <div className="App">
        <React.Fragment>
          
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
          
          
          
        </React.Fragment>
      </div>
      )
    }
    {
        isLoading && (
          <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.white
          }}>
            <Spinner />
          </div>
        )
      }
      {
        (user === null && token === null && !isLoading) && (
          <div style={{
            minHeight: '100vh',
            overflowY: 'hidden',
            backgroundImage: "none",
            backgroundSize: '100% auto'
          }}
            className="login-body"
          >
            <RouterList />
          </div>
        )
      }
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
