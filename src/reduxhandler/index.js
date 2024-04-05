import Helper from 'common/Helper';
import {createStore, applyMiddleware} from 'redux'
import sessionTimeoutMiddleware from 'middleware/index'; // Adjust the path as necessary

const types = {
  LOGOUT: 'LOGOUT',
  LOGIN: 'LOGIN',
  SET_DETAILS: 'SET_DETAILS',
  UPDATE_USER: 'UPDATE_USER',
  SET_IS_LOADING: 'SET_IS_LOADING',
};

export const actions = {
  login: (user, token) => {
    return {type: types.LOGIN, user, token};
  },
  setDetails: (details) => {
    return {type: types.SET_DETAILS, details};
  },
  logout() {
    return {type: types.LOGOUT};
  },
  updateUser(user) {
    return {type: types.UPDATE_USER, user};
  },
  setIsLoading(isLoading) {
    return { type: types.SET_IS_LOADING, isLoading };
  },

};

const initialState = {
  token: null,
  user: null,
  details: null,
  isLoggedIn: false,
  isLoading: false,
  loginTime: null,
};

const reducer = (state = initialState, action) => {
  const { user, token, isLoading } = action;
  switch (action.type) {
    case 'LOGOUT':
      console.log('INITIALIZING LOGOUT');
      localStorage.removeItem(`${Helper.APP_NAME}token`);
      return{
        ...state,
        user: null,
        isLoggedIn: false
      }
    case 'LOGIN':
      console.log('INITIALIZING LOGIN');
      localStorage.setItem(`${Helper.APP_NAME}token`, token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoggedIn: true,
        loginTime: new Date().getTime(), // Store the current time
      };
    case 'SET_DETAILS':
    console.log('SETTING DETAILS');
    return{
      ...state,
      details: action.payload.details,
    }
    case 'UPDATE_USER':
      return {
        ...state,
        user,
      };
    case 'SET_IS_LOADING':
      return {
        ...state,
        isLoading: isLoading
      }
    case 'RESET_LOGIN_TIME':
      return {
        ...state,
        loginTime: action.payload,
     };
    default:
      return state;
  }
};

const store = createStore(reducer, applyMiddleware(sessionTimeoutMiddleware));
export default store;
