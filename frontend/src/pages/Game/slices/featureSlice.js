// src/features/octopus/octopusSlice.js 또는 새 slice 파일
import { createSlice } from "@reduxjs/toolkit";

export const featureSlice = createSlice({
  name: "feature",
  initialState: {
    chickenWalking: false,
  },
  reducers: {
    toggleChickenWalking: (state) => {
      state.chickenWalking = !state.chickenWalking;
    },
  },
});

export const { toggleChickenWalking } = featureSlice.actions;

export default featureSlice.reducer;
