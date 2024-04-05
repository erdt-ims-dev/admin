const sessionTimeoutMiddleware = store => next => action => {
    const currentTime = new Date().getTime();
    const state = store.getState();
    const loginTime = state.loginTime;
    const timeout = 30 * 60 * 1000; // 30 minutes in milliseconds
   
    if (loginTime && currentTime - loginTime > timeout) {
       // If the session has expired, dispatch a logout action
       store.dispatch({ type: 'LOGOUT' });
    } else {
       // If the session is still active, reset the login time
       // This ensures the session remains active as long as the user is active
       store.dispatch({ type: 'RESET_LOGIN_TIME', payload: currentTime });
    }
   
    // Continue with the next middleware or the reducer
    next(action);
   };
   
   export default sessionTimeoutMiddleware;