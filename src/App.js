import './App.css';
import React from 'react';
import RouterList from './routes'
import Header from './modules/frames/Header';
import Footer from './modules/frames/Footer';
import Sidebar from './modules/frames/Sidebar';
import {withRouter} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <React.Fragment>
        <div>
          <Header />
        </div>
        <div>
          <div>
            {/* <Sidebar/> */}
          </div>
          <div>
            <RouterList />
          </div>
        </div>
        <Footer />
      </React.Fragment>
    </div>
  );
}

export default withRouter(App);