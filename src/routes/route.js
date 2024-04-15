import { Route, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helper from 'common/Helper';
import CommonApi from 'services/commonAPI'
import React, { useEffect } from "react";

function RouteWrapper({
    component: Component,
    isPrivate,
    ...rest
}){
    let token = localStorage.getItem(`${Helper.APP_NAME}token`)
    let { user } = rest.state;
    // console.log("here")
    // if(user == null && token){
    //     const { setIsLoading } = rest
    //     // setIsLoading(true)
    //     console.log("here2")
    //     CommonApi.getAuthenticatedUser(user => {
    //         console.log(user)
    //         setIsLoading(false)
    //         const { login, logout } = rest;
    //         if(user){
    //           login(user, token)
    //           user = user
    //         }else{
    //             logout()
    //         }
    //     }, error => {
    //         const { logout } = rest;
    //         setIsLoading(false)
    //         logout()
    //     })
    // }
    useEffect(() => {

        if (user == null && token) {
          const { setIsLoading } = rest
          CommonApi.getAuthenticatedUser(user => {
            setIsLoading(false)
            const { login, logout } = rest;
    
            if (user && !user.error) {
              login(user, token)
            } else {
              logout()
            }
          }, error => {
            const { logout } = rest
            setIsLoading(false)
            logout()
          })
        }
      }, [rest, token, user])

    // Route is private and the user is not logged in
    if(isPrivate && !user && !token){
        return <Redirect to="/" />
    }

    // Route is public and the user is logged in

    if(!isPrivate && user && token){
        return <Redirect to="/dashboard" />
    }

    return <Route {...rest} component={Component} />;
}

RouteWrapper.propTypes = {
    isPrivate:  PropTypes.bool,
    component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired
};

RouteWrapper.defaultProps = {
    isPrivate: false
};

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  return {
    login: (user) => dispatch({ type: 'LOGIN', payload: { user } }),
    setIsLoading: (flag) => dispatch({ type: 'SET_IS_LOADING', payload: { flag } }),
    logout: () => dispatch({ type: 'LOGOUT' }),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(RouteWrapper);