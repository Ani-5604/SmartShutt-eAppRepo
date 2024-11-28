// auth.reducer.js

import { AUTH_LOG_IN_SUCCESS, AUTH_LOG_IN_ERROR, AUTH_LOG_OUT } from './auth.types';
import Cookies from 'js-cookie';

export const authInitalState = {
  loading: false,
  data: {
    token: Cookies.get('jwttoken') || '',
    userId: Cookies.get('userid') || '',
    userName: '', // Initialize userName as empty string
    userGender: '', // Store the gender if needed
    isAuthenticated: false,
  },
  error: false,
};

export const authReducer = (state = authInitalState, { type, payload }) => {
  switch (type) {
    case AUTH_LOG_IN_SUCCESS: {
      // Log userName to see if it's correctly set
      console.log(payload.userName);  // Log the userName when the action is successful
      
      return {
        ...state,
        loading: false,
        data: {
          ...state.data,
          token: payload.token,
          userId: payload.userId,
          userName: payload.userName, // Store userName in the state
          userGender: payload.userGender, // Store userGender in the state
          isAuthenticated: true,
        },
      };
    }
    case AUTH_LOG_IN_ERROR: {
      return {
        ...state,
        loading: false,
        error: true,
      };
    }
    case AUTH_LOG_OUT: {
      return {
        ...state,
        data: {
          token: '',
          userId: '',
          userName: '', // Clear userName on logout
          userGender: '',
          isAuthenticated: false,
        },
      };
    }
    default: {
      return state;
    }
  }
};
