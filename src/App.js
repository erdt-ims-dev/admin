import "./App.css";
import RouterList from "./routes";

import { connect } from 'react-redux';
import Header from "./modules/frames/Header";
import Footer from "./modules/frames/Footer";
import Sidebar from "./modules/frames/Sidebar";
import { withRouter } from "react-router-dom";
import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthProvider and useAuth

function App(props) {
  const {state, dispatch} = useAuth();
  const [login, setLogin] = useState(true);

  return (
    <div className="App">
      <AuthProvider>
      <React.Fragment>
        <Header {...props} />
        <div className="mainContainer">
          {login && (
            <div className="sidebarContainer">
              <Sidebar {...props} />
            </div>
          )}

          <div className="pageContainer">
            <RouterList />
          </div>
        </div>
        <Footer />
      </React.Fragment>
      </AuthProvider>
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
