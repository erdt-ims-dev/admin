import './App.css';
import RouterList from './routes'
import Header from './modules/frames/Header';
import Footer from './modules/frames/Footer';
import Sidebar from './modules/frames/Sidebar';
import {withRouter} from 'react-router-dom';
import { createBrowserHistory } from "history";
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthProvider and useAuth


function App(props) {
  // const {isLoggedIn, login, logout} = useAuth();
  const [login, setLogin] = useState(true);
  // This basically creates a history stack. The stack is '/'
  let history = createBrowserHistory();

  // This listens to any changes on the page, onClick() will update the page, triggering the useEffect()
  useEffect(() => {
    const unlisten = history.listen(({ action, location }) => {
      console.log(
        `The current URL is ${location.pathname}${location.search}${location.hash}`
      );
      console.log(`The last navigation action was ${action}`);
      // Reload page when there's any changes
      window.location.reload(); 
    });

    return () => {
      unlisten(); // Clean up the listener when the component unmounts
    };
  }, []);

  // Checks the route if /logout
  const navigate = (route) => {
    if (route == '/logout') {
      const { logout } = props;
      logout()
    } else {
      // Stack, '/' + 'route' = '/route' or ie. '/dashboard'
      history.push(route)
    }
  }
  return (
    <div className="App">
      {/* <AuthProvider> */}
        <React.Fragment>
            <Header {...props}/>
            <div className='mainContainer'>
              {
                login && ( 
                  <div className='sidebarContainer'>
                    <Sidebar {...props}
                    navigate={navigate}
                  />
                    </div>
                )
              }
      
              <div className='pageContainer'>
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