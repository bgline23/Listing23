import { configureStore } from "@reduxjs/toolkit";
import authenticateReducer from "./authenticateSlice";
import preferenceReducer from "./preferenceSlice";
import userRequestReducer from "./userRequest";

export default configureStore({
  reducer: {
    authenticate: authenticateReducer,
    preferences: preferenceReducer,
    userRequest: userRequestReducer,
  },
});
