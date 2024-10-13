import Helper from 'common/Helper';
import { createStore, applyMiddleware } from 'redux';
import sessionTimeoutMiddleware from 'middleware/index'; 

const types = {
  LOGOUT: 'LOGOUT',
  LOGIN: 'LOGIN',
  SET_DETAILS: 'SET_DETAILS',
  UPDATE_USER: 'UPDATE_USER',
  SET_IS_LOADING: 'SET_IS_LOADING',
  SET_IS_LOADING_V2: 'SET_IS_LOADING_V2',
  UPDATE_USER_STATUS: 'UPDATE_USER_STATUS', // Added new type
  RESET_LOGIN_TIME: 'RESET_LOGIN_TIME' // Add RESET_LOGIN_TIME type
};

export const actions = {
  login: (user, token) => {
    return { type: types.LOGIN, user, token };
  },
  setDetails: (details) => {
    return { type: types.SET_DETAILS, details };
  },
  logout() {
    return { type: types.LOGOUT };
  },
  updateUser(user) {
    return { type: types.UPDATE_USER, user };
  },
  updateUserStatus(status) {
    return {
      type: types.UPDATE_USER_STATUS, payload: status // Updating just status string
    };
  },
  setIsLoading(isLoading) {
    return { type: types.SET_IS_LOADING, isLoading };
  },
  setIsLoadingC2(isLoadingV2) {
    return { type: types.SET_IS_LOADING, isLoadingV2 };
  },
  resetLoginTime(currentTime) {
    return { type: types.RESET_LOGIN_TIME, payload: currentTime }; // Define RESET_LOGIN_TIME action
  }
};

const initialState = {
  token: null,
  user: null,
  details: null,
  isLoggedIn: false,
  isLoading: false,
  loginTime: null,
  isLoadingV2: false
};

const reducer = (state = initialState, action) => {
  const { user, token, isLoading } = action;
  switch (action.type) {
    case types.LOGOUT:
      localStorage.removeItem(`${Helper.APP_NAME}token`);
      return Object.assign({}, initialState);
      
    case types.LOGIN:
      localStorage.setItem(`${Helper.APP_NAME}token`, action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoggedIn: true,
        loginTime: new Date().getTime(),
      };

    case types.RESET_LOGIN_TIME:
      return {
        ...state,
        loginTime: action.payload, // Update loginTime with the new timestamp
      };
      
    case types.SET_DETAILS:
      return {
        ...state,
        details: action.payload.details,
      };

    case types.UPDATE_USER:
      return {
        ...state,
        user: action.payload.user
      };

    case types.UPDATE_USER_STATUS:
      return {
        ...state,
        user: {
          ...state.user,
          status: action.payload // Update status string directly
        }
      };

    case types.SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };

    case types.SET_IS_LOADING_V2:
      return {
        ...state,
        isLoadingV2: action.payload.isLoadingV2
      };

    default:
      return state;
  }
};

// export default createStore(reducer, applyMiddleware(sessionTimeoutMiddleware));
export default reducer;
