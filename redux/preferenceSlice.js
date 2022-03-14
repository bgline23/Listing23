import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

//  Check for async store preferences

export const getDeviceLocation = createAsyncThunk(
  "preferences/getDeviceLocation",
  async () => {
    const deviceLocation = await AsyncStorage.getItem("deviceLocation");
    //  exists in async store
    if (deviceLocation) {
      return JSON.parse(deviceLocation);
    }

    //  is not set
    return null;
  }
);

export const setDeviceLocation = createAsyncThunk(
  "preferences/setDeviceLocation",
  async payload => {
    //  permission denied
    if (payload === false) {
      await AsyncStorage.setItem(
        "deviceLocation",
        JSON.stringify({ deviceLocation: false })
      );

      return { deviceLocation: false };
    }

    // first time permision grant
    if (typeof payload === "object") {
      await AsyncStorage.setItem("deviceLocation", JSON.stringify(payload));
      return payload;
    }

    // reenabled

    if (payload === true) {
      return payload;
    }

    return null;
  }
);

export const getFingerprint = createAsyncThunk("preferences/getFingerprint", async () => {
  const preferences = await AsyncStorage.getItem("fingerprint");
  return JSON.parse(preferences);
});

export const setFingerprint = createAsyncThunk(
  "preferences/setFingerprint",
  async payload => {
    await AsyncStorage.setItem("fingerprint", JSON.stringify(payload));
    return payload;
  }
);

export const preferenceSlice = createSlice({
  name: "preferences",
  initialState: {
    fingerprint: null,
    deviceLocation: null,
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: {
    [getFingerprint.fulfilled]: (state, action) => {
      state.fingerprint = action.payload;
      state.loading = false;
    },
    [setFingerprint.fulfilled]: (state, action) => {
      state.fingerprint = action.payload;
      state.loading = false;
    },
    [getDeviceLocation.fulfilled]: (state, action) => {
      state.deviceLocation = action.payload;
      state.loading = false;
    },

    [setDeviceLocation.fulfilled]: (state, action) => {
      state.deviceLocation = action.payload;
      state.loading = false;
    },
  },
});

// each case under reducers becomes an action
// export const { setPreferences } = preferenceSlice.actions;

export default preferenceSlice.reducer;
