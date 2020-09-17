import axios from "axios";
import {
  LOGIN_EXPIRED,
  USER_LOADED,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT,
  CLEARERROR,
  LOADING,
  REGISTERED
} from "./types";
import { api } from "./config";

const jwt = require("jsonwebtoken");

export const loadUser = () => dispatch => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };

  if (token) {
    const exp = jwt.decode(token).exp;
    if (Date.now() >= exp * 1000) {
      dispatch({ type: LOGIN_EXPIRED });
    } else {
      config.headers["Authorization"] = `Bearer ${token}`;
      dispatch({ type: USER_LOADED, payload: token });
    }
  } else {
    dispatch({ type: LOGIN_FAILED });
  }
};

export const login = (email, password) => dispatch => {
  dispatch({ type: LOADING });
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  // Request Body
  const body = JSON.stringify({ email, password });
  axios
    .post(api + "auth/", body, config)
    .then(res => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
    })
    .catch(e => {
      if (e.response)
        dispatch({ type: LOGIN_FAILED, payload: e.response.data.detail });
      else dispatch({ type: LOGIN_FAILED, payload: "Something Went Wrong" });
    });
};

export const register = form => dispatch => {
  dispatch({ type: LOADING });
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  let body = {
    email: form["email"],
    first_name: form["first_name"],
    last_name: form["last_name"],
    password: form["password"],
    profile: {
      photo: null,
      cin: form["cin"],
      tel: form["tel"],
      company_name: form["Company"]
    }
  };
  axios
    .post(api + "create/", body, config)
    .then(() => {
      dispatch({ type: REGISTERED });
    })
    .catch(e => {
      if (e.response.data)
        dispatch({ type: LOGIN_FAILED, payload: e.response.data.email });
    });
};

export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
};

export const clearError = () => dispatch => {
  dispatch({ type: CLEARERROR });
};
