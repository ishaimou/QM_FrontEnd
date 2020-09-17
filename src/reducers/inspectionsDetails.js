import {
  LOADINSPECTION,
  ISLOADING,
  CLEARERROR,
  LOADINGFAILED
} from "../actions/types";

const initialState = {
  inspection: null,
  isLoading: false,
  errorMsg: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADINSPECTION:
      return {
        ...state,
        inspection: action.payload,
        isLoading: false
      };
    case ISLOADING:
      return {
        ...state,
        isLoading: true
      };
    case CLEARERROR:
      return {
        ...state,
        isLoading: false,
        errorMsg: ""
      };
    case LOADINGFAILED:
      return {
        ...state,
        isLoading: false,
        errorMsg: action.payload
      };
    default:
      return { ...state };
  }
}
