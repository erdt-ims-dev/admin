// AuthContext.js
import React, { createContext, useContext, useReducer, useState } from 'react';

const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch(action.type){
        case 'LOGIN': return {user: action.payload}
        case 'LOGOUT': return {user: null}
        default: return state
    }   
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null
  });
  console.log('Auth State: ', state)

//   const login = () => {
//     setIsLoggedIn(true);
//   };

//   const logout = () => {
//     setIsLoggedIn(false);
//   };

//   const contextValue = {
//     isLoggedIn,
//     login,
//     logout,
//   };
    const contextValue = { state, dispatch };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const withAuth = (WrappedComponent) => {
  return class WithAuth extends React.Component {
    render() {
      return (
        <AuthContext.Consumer>
          {(authContext) => <WrappedComponent {...this.props} auth={authContext} />}
        </AuthContext.Consumer>
      );
    }
  };
};
