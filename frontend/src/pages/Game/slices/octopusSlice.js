// src/features/octopus/octopusSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const octopusSlice = createSlice({
  name: "octopus",
  initialState: {
    isSprayingInk: false, // 문어가 잉크를 뿌리는 상태
  },
  reducers: {
    toggleInkSpraying: (state) => {
      state.isSprayingInk = !state.isSprayingInk;
      console.log(`잉크 상태 : ${state.isSprayingInk} `);
    },
    resetInkSpraying: (state) => {
      state.isSprayingInk = false;
    },
  },
});

export const { toggleInkSpraying, resetInkSpraying } = octopusSlice.actions;

export default octopusSlice.reducer;
