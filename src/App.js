import "./App.css";
import RouterList from "./routes/index";
import CoordinatorRoutes from "./routes/coordinator_routes";
import StaffRouter from "./routes/staff_routes";
import ScholarRouter from "./routes/scholar_routes";
import ApplicantRouter from "./routes/applicant_routes";
import NewRouter from "./routes/new_routes";
import AuthRouter from "./routes/auth_routes";

import Header from "./modules/frames/Header";
import Footer from "./modules/frames/Footer";
import Sidebar from "./modules/frames/Sidebar";
import CoordinatorSidebar from "./modules/frames/CoordinatorSidebar";
import StaffSidebar from "./modules/frames/StaffSidebar";
import ScholarSidebar from "./modules/frames/ScholarSidebar";
import ApplicantSidebar from "./modules/frames/ApplicantSidebar";
import NewSidebar from "./modules/frames/NewSidebar";

import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import React, { useState } from "react";
import Colors from 'common/Colors'
import Login from "./modules/auth/login"
import Register from "./modules/auth/register"
import Spinner from 'modules/generic/spinner';
import SpinnerV2 from 'modules/generic/spinnerV2';
import { ToastContainer } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';  

function App(props) {
  const history = useHistory();
  const location = useLocation();
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
  } else {
    renderComponent = <Login navigate={navigate} />;
  }

  const { user, token, isLoading, isLoadingV2 } = props.state;

  return (
    <div>
      {/* Global ToastContainer */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
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
            <AuthRouter />
            <Footer />
          </div>
        )
      }

      {
        (user && user.account_type === 'admin' && token && !isLoading) && (
          <div className="App">
            <React.Fragment>
              <span>
                <Header handleOpenSidebar={handleOpenSidebar} {...props} />
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
        (user && user.account_type === 'coordinator' && token && !isLoading) && (
          <div className="App">
            <React.Fragment>
              <span>
                <Header handleOpenSidebar={handleOpenSidebar} {...props} />
                <div className="mainContainer">
                  <div className={"sidebarContainer" + (openSidebar ? "" : " hidden")}>
                    <CoordinatorSidebar show={openSidebar} {...props} navigate={navigate} />
                  </div>

                  <div className="pageContainer">
                    <CoordinatorRoutes />
                  </div>
                </div>
                <Footer />
              </span>
            </React.Fragment>
          </div>
        )
      }

      {
        (user && user.account_type === 'staff' && token && !isLoading) && (
          <div className="App">
            <React.Fragment>
              <span>
                <Header handleOpenSidebar={handleOpenSidebar} {...props} />
                <div className="mainContainer">
                  <div className={"sidebarContainer" + (openSidebar ? "" : " hidden")}>
                    <StaffSidebar show={openSidebar} {...props} navigate={navigate} />
                  </div>

                  <div className="pageContainer">
                    <StaffRouter />
                  </div>
                </div>
                <Footer />
              </span>
            </React.Fragment>
          </div>
        )
      }

      {
        (user && user.account_type === 'scholar' && token && !isLoading) && (
          <div className="App">
            <React.Fragment>
              <span>
                <Header handleOpenSidebar={handleOpenSidebar} {...props} />
                <div className="mainContainer">
                  <div className={"sidebarContainer" + (openSidebar ? "" : " hidden")}>
                    <ScholarSidebar show={openSidebar} {...props} navigate={navigate} />
                  </div>

                  <div className="pageContainer">
                    <ScholarRouter />
                  </div>
                </div>
                <Footer />
              </span>
            </React.Fragment>
          </div>
        )
      }

      {
        (user && user.account_type === 'applicant' && token && !isLoading) && (
          <div className="App">
            <React.Fragment>
              <span>
                <Header handleOpenSidebar={handleOpenSidebar} {...props} />
                <div className="mainContainer">
                  <div className={"sidebarContainer" + (openSidebar ? "" : " hidden")}>
                    <ApplicantSidebar show={openSidebar} {...props} navigate={navigate} />
                  </div>

                  <div className="pageContainer">
                    <ApplicantRouter />
                  </div>
                </div>
                <Footer />
              </span>
            </React.Fragment>
          </div>
        )
      }

      {
        (user && user.account_type === 'new' && token && !isLoading) && (
          <div className="App">
            <React.Fragment>
              <span>
                <Header handleOpenSidebar={handleOpenSidebar} {...props} />
                <div className="mainContainer">
                  <div className={"sidebarContainer" + (openSidebar ? "" : " hidden")}>
                    <NewSidebar show={openSidebar} {...props} navigate={navigate} />
                  </div>

                  <div className="pageContainer">
                    <NewRouter />
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
        isLoadingV2 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <SpinnerV2 />
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
    userActivity: () => dispatch({ type: 'USER_ACTIVITY' }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
