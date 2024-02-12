// store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  memberId: null,
  accessToken: "",
  isNew: false,
  isConnected: false,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { memberId, accessToken, isNew, isConnected } = action.payload;
      state.memberId = memberId;
      state.accessToken = accessToken;
      state.isNew = isNew;
      state.isConnected = isConnected;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.memberId = null;
      state.accessToken = "";
      state.isNew = false;
      state.isConnected = false;
      state.isLoggedIn = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
