import { createSlice } from "@reduxjs/toolkit";

export const waterBalloonSlice = createSlice({
  name: "waterBalloon",
  initialState: {
    isAnimating: false,
  },
  reducers: {
    toggleWaterBalloonAnimation: (state) => {
      state.isAnimating = !state.isAnimating;
    },
    resetWaterBalloonAnimation: (state) => {
      state.isAnimating = false;
    },
  },
});

export const { toggleWaterBalloonAnimation, resetWaterBalloonAnimation } =
  waterBalloonSlice.actions;

export default waterBalloonSlice.reducer;
