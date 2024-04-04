import Helper from 'common/Helper';
import {createStore} from 'redux'
const types = {
  LOGOUT: 'LOGOUT',
  LOGIN: 'LOGIN',
  UPDATE_USER: 'UPDATE_USER',
  SET_IS_LOADING: 'SET_IS_LOADING',
};

export const actions = {
  login: (user, token) => {
    return {type: types.LOGIN, user, token};
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
  isLoggedIn: false,
  isLoading: false,
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
      localStorage.setItem(`${Helper.APP_NAME}token`, token)
      return{
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoggedIn: true
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
    default:
      return state;
  }
};

const store = createStore(reducer);
export default store;
