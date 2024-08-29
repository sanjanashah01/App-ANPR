import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Authentication
import profile from "./auth/profile/reducer";
const rootReducer = combineReducers({
  Layout,
  profile,
});

export default rootReducer;
