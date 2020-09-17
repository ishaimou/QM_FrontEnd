import { combineReducers } from "redux";
import auth from "./auth";
import inspections from "./inspections";
import inspectionDetails from "./inspectionsDetails";

export default combineReducers({
  auth,
  inspections,
  inspectionDetails
});
