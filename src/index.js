import React from "react";
import ReactDOM from "react-dom/client";
import { createStore } from 'redux';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import rootReducer from './reduxhandler';
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { Provider } from 'react-redux'
// import store from './reduxhandler/index'

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = createStore(persistedReducer);
let persistor = persistStore(store)

function WrappedApp(){
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}

root.render(<WrappedApp />);

