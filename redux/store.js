import { configureStore } from "@reduxjs/toolkit";
import authenticateReducer from "./authenticateSlice";
import preferenceReducer from "./preferenceSlice";

export default configureStore({
  reducer: {
    authenticate: authenticateReducer,
    preferences: preferenceReducer,
  },
});
