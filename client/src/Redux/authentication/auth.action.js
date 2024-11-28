// auth.actions.js
import { AUTH_LOG_IN_SUCCESS, AUTH_LOG_IN_ERROR, AUTH_LOG_OUT } from './auth.types';
import axios from 'axios';
import Cookies from 'js-cookie';
import { success, error } from '../../Utils/notification';

// Action to log in
export const loginAPI = (data, navigate) => async (dispatch) => {
  try {
    const response = await axios.post("http://localhost:8070/user/login", data);

    if (response.data.status === "Failed") {
      error(response.data.message);  // If login fails, show an error message
    } else {
      const { token, user } = response.data.message;

      // Store necessary data in cookies
      Cookies.set('jwttoken', token, { expires: 1 });
      Cookies.set('userid', user._id, { expires: 1 });
      Cookies.set('usergender', user.gender, { expires: 1 });

      // Dispatch the login success action
      dispatch({
        type: AUTH_LOG_IN_SUCCESS,
        payload: {
          token,
          userName: user.name,
          userId: user._id,
          userGender: user.gender,
        },
      });

      success("Sign In successfully");
      navigate("/");
    }
  } catch (err) {
    // Log the error to understand what went wrong
    console.error("Login API Error:", err.response || err);
    dispatch({ type: AUTH_LOG_IN_ERROR });

    // Show error notification
    error("There was an error logging in. Please try again later.");
  }
};

// Action to log out
export const logoutAPI = () => (dispatch) => {
  // Remove cookies on logout
  Cookies.remove('jwttoken');
  Cookies.remove('userid');
  Cookies.remove('usergender');

  dispatch({
    type: AUTH_LOG_OUT,
  });

  success("Logged out successfully");
};
