// authSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  memberId: null,
  accessToken: null,
  isNew: false,
  isConnected: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const { memberId, accessToken, isNew, isConnected } = action.payload;
      state.memberId = memberId;
      state.accessToken = accessToken;
      state.isNew = isNew;
      state.isConnected = isConnected;
    },
    // 다른 액션들을 추가할 수 있습니다.
  },
});

export const { loginSuccess } = authSlice.actions;

export default authSlice.reducer;
