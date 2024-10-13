const sessionTimeoutMiddleware = store => next => action => {
   const state = store.getState();
   const { loginTime, isLoggedIn } = state;

   console.log('Middleware triggered', action.type);

   if (!isLoggedIn) {
       return next(action);
   }

   const currentTime = new Date().getTime();
   const timeout = 1 * 60 * 1000; // 1 minute for testing

   if (loginTime && currentTime - loginTime > timeout) {
       console.log('Session timeout reached, logging out.');
       store.dispatch({ type: 'LOGOUT' });
   } else if (action.type === 'USER_ACTIVITY') {
       console.log('User activity detected, resetting login time.');
       store.dispatch({ type: 'RESET_LOGIN_TIME', payload: currentTime });
   }

   return next(action);
};
