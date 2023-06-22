import './App.css';
import RouterList from './routes'
import Header from './modules/frames/Header';
import Footer from './modules/frames/Footer';
import Sidebar from './modules/frames/Sidebar';
import {withRouter} from 'react-router-dom';
import { createBrowserHistory } from "history";
import React, { useEffect } from 'react';


function App(props) {
  let history = createBrowserHistory();

  useEffect(() => {
    const unlisten = history.listen(({ action, location }) => {
      console.log(
        `The current URL is ${location.pathname}${location.search}${location.hash}`
      );
      console.log(`The last navigation action was ${action}`);
      window.location.reload(); 
    });

    return () => {
      unlisten(); // Clean up the listener when the component unmounts
    };
  }, []);

  const navigate = (route) => {
    if (route == '/logout') {
      const { logout } = props;
      logout()
    } else {
      history.push(route)
    }
  }
  return (
    <div className="App">
      <React.Fragment>
        <div>
          <Header {...props}/>
        </div>
        <div>
          <div className='mainContainer'>
            <div className='sidebarContainer'>
            <Sidebar {...props}
            navigate={navigate}
            />
            </div>
            <div className='pageContainer'>
            <RouterList />
            </div>
          </div>
        </div>
        <Footer />
      </React.Fragment>
    </div>
  );
}

export default withRouter(App);