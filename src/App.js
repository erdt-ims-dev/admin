import './App.css';
import React from 'react';
import RouterList from './routes'
import Header from './modules/frames/Header';
import Footer from './modules/frames/Footer';
import Sidebar from './modules/frames/Sidebar';
import {withRouter} from 'react-router-dom';
import { useHistory } from "react-router-dom";

function App(props) {
  const history = useHistory();
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
            <div>
            <Sidebar {...props}/>
            </div>
            <div>
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