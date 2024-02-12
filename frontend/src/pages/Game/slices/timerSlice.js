import { createSlice } from "@reduxjs/toolkit";

export const timerSlice = createSlice({
  name: "timer",
  initialState: {
    timeCompleted: false, // 시간 완료 여부
  },
  reducers: {
    resetTimer: (state) => {
      state.timeCompleted = true; // 타이머 리셋 시 timeCompleted도 초기화
    },
  },
});

// 액션 생성자 내보내기
export const { resetTimer } = timerSlice.actions;

export default timerSlice.reducer;
