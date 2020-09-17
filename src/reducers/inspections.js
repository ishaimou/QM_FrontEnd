import {
  LOADINSPECTIONS,
  ISLOADING,
  CLEARERROR,
  CREATION_SUCCESS,
  CREATION_FAILED
} from "../actions/types";

const initialState = {
  inspections: null,
  count: null,
  isLoading: false,
  errorMsg: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADINSPECTIONS:
      return {
        ...state,
        inspections: action.payload.inspections,
        count: action.payload.count,
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
        errorMsg: null
      };
    case CREATION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        errorMsg: null
      };
    case CREATION_FAILED:
      return {
        ...state,
        isLoading: false,
        errorMsg: action.payload
      };
    default:
      return { ...state };
  }
}
