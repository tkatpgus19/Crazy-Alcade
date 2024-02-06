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
  },
});

export const { toggleWaterBalloonAnimation } = waterBalloonSlice.actions;

export default waterBalloonSlice.reducer;
