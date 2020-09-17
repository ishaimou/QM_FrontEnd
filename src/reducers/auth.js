import {
  USER_LOADED,
  LOGIN_EXPIRED,
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTERED,
  LOADING,
  CLEARERROR
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isRegistered: false,
  isLoading: false,
  errorMsg: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN_EXPIRED:
    case LOGOUT:
    case LOGIN_FAILED:
      localStorage.removeItem("token");
      return {
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isRegistered: false,
        errorMsg: action.payload
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload,
        isLoading: false,
        isRegistered: false,
        errorMsg: null
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.access);
      return {
        ...state,
        ...action.payload,
        token: action.payload.access,
        isAuthenticated: true,
        isLoading: false,
        isRegistered: false,
        errorMsg: null
      };
    case REGISTERED:
      return {
        ...state,
        isRegistered: true,
        isLoading: false
      };
    case LOADING:
      return {
        ...state,
        isLoading: true
      };
    case CLEARERROR:
      return {
        ...state,
        isLoading: false,
        errorMsg: null
      };
    default:
      return state;
  }
}
