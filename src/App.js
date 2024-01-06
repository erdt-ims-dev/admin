import "./App.css";
import RouterList from "./routes";
import Header from "./modules/frames/Header";
import Footer from "./modules/frames/Footer";
import Sidebar from "./modules/frames/Sidebar";
import { withRouter } from "react-router-dom";
import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthProvider and useAuth

function App(props) {
  // const {isLoggedIn, login, logout} = useAuth();
  const [login, setLogin] = useState(false);

  return (
    <div className="App">
      {/* <AuthProvider> */}
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
      {/* </AuthProvider> */}
    </div>
  );
}

export default withRouter(App);
