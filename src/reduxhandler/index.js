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
  isLoading: false,
};

const reducer = (state = initialState, action) => {
  const { type, user, token, isLoading } = action;
  switch (type) {
    case types.LOGOUT:
      localStorage.removeItem(`${Helper.APP_NAME}token`);
      console.log('INITIALIZING LOGOUT');
      return initialState;
    case types.LOGIN:
      localStorage.setItem(`${Helper.APP_NAME}token`, token)
      console.log('INITIALIZING LOGIN');
      return {...state, user, token};
    case types.UPDATE_USER:
      return {
        ...state,
        user,
      };
    case types.SET_IS_LOADING:
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
