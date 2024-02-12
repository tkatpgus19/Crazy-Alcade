// slices/animationControlSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const animationControlSlice = createSlice({
  name: "animationControl",
  initialState: {
    isShieldActive: false,
  },
  reducers: {
    toggleShield: (state) => {
      state.isShieldActive = !state.isShieldActive;
    },
    resetShield: (state) => {
      state.isShieldActive = false;
    },
  },
});

export const { toggleShield, resetShield } = animationControlSlice.actions;

export default animationControlSlice.reducer;
