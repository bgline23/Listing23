import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "@env";
import { axiosInstance, interceptError } from "../common/requests";

//  register user thunk
export const registerUser = createAsyncThunk(
  "userRequest/registerUser",
  interceptError(async userInfo => {
    const newUser = await axiosInstance.post("/user/register", userInfo);
    return newUser.data;
  })
);

//  request state slice
export const userRequestSlice = createSlice({
  name: "userRequest",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: {
    [registerUser.pending]: (state, action) => {
      state.loading = true;
    },
    [registerUser.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [registerUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
  },
});

export default userRequestSlice.reducer;
