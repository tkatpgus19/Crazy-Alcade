// slices/webIDESlice.js

import { createSlice } from "@reduxjs/toolkit";

export const webIDESlice = createSlice({
  name: "webIDE",
  initialState: {
    isFlipped: false, // 초기 상태 설정
  },
  reducers: {
    // isFlipped 상태를 토글하는 리듀서
    toggleWebIDEFlip: (state) => {
      state.isFlipped = !state.isFlipped;
      console.log("toggle!");
    },
    resetWebIDEFlip: (state) => {
      state.isFlipped = false;
      console.log("reset IDE!");
    },
  },
});

// 액션과 리듀서를 내보냅니다.
export const { toggleWebIDEFlip, resetWebIDEFlip } = webIDESlice.actions;

export default webIDESlice.reducer;
