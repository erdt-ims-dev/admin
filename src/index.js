import React from "react";
import ReactDOM from "react-dom/client";

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";


import { Provider } from 'react-redux'
import store from './reduxhandler/index'

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

function WrappedApp(){
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  )
}

root.render(<WrappedApp />, document.getElementById('root'));

