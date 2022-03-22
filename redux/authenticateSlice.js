import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "@env";
import { axiosInstance } from "../common/requests";

//  Check for async store user
export const getUserState = createAsyncThunk("authUser/getUserState", async () => {
  let currentUser = await AsyncStorage.getItem("authUser");
  currentUser = JSON.parse(currentUser);
  let isNewUser = await AsyncStorage.getItem("isNewUser");
  isNewUser = isNewUser == "existing_user" ? false : true;

  let authToken = await AsyncStorage.getItem("authToken");
  authToken = JSON.parse(authToken);
  return { isNewUser, currentUser, authToken };
});

export const signIn = createAsyncThunk("authUser/signIn", async credentials => {
  try {
    let signInRequest = credentials.token
      ? await axiosInstance.post("/authenticate/loginToken", credentials)
      : await axiosInstance.post("/authenticate/login", credentials);

    if (signInRequest?.data.success) {
      await AsyncStorage.setItem(
        "authToken",
        JSON.stringify({ token: signInRequest.data.token })
      );

      await AsyncStorage.setItem("authUser", JSON.stringify(signInRequest.data.user));
      await AsyncStorage.setItem("isNewUser", "existing_user");

      return signInRequest.data.user;
    } else {
      return null;
    }
  } catch (e) {
    if (e.response) {
      //  server returned an error message
      throw new Error(e.response.data);
    }

    if (e.code) {
      throw new Error("Could not communicate with the server at: " + API_URL);
    }

    throw new Error("Could not process request");
  }
});

export const signOut = createAsyncThunk("authUser/signOut", async preserveToken => {
  await AsyncStorage.removeItem("authUser");

  if (!preserveToken) {
    await AsyncStorage.removeItem("authToken");
  }
});

export const authenticateSlice = createSlice({
  name: "authenticate",
  initialState: {
    authUser: null,
    authToken: "",
    loading: false,
    isNewUser: null,
    error: null,
  },
  reducers: {},

  extraReducers: {
    [signIn.fulfilled]: (state, action) => {
      state.authUser = action.payload;
      state.loading = false;
    },
    [getUserState.fulfilled]: (state, { payload }) => {
      state.authUser = payload.currentUser;
      state.authToken = payload.authToken;
      state.isNewUser = payload.isNewUser;
      state.loading = false;
    },

    [signIn.rejected]: (state, action) => {
      state.loading = "idle";
      state.error = action.error;
    },
    [signOut.fulfilled]: state => {
      state.authUser = null;
      state.loading = false;
    },

    [signOut.rejected]: (state, action) => {
      state.loading = "idle";
      state.error = action.error;
    },
  },
});

// each case under reducers becomes an action
// export const { signIn, signOut } = authenticateSlice.actions;

export default authenticateSlice.reducer;
