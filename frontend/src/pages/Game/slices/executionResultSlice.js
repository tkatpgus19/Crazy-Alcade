// features/executionResult/executionResultSlice.js

import { createSlice } from "@reduxjs/toolkit";

export const executionResultSlice = createSlice({
  name: "executionResult",
  initialState: {
    output: null, // 코드 실행 결과
    isResultExpanded: false, // 초기값은 true 또는 false로 설정
  },
  reducers: {
    setExecutionResult: (state, action) => {
      state.output = action.payload;
      state.isResultExpanded = true; // 코드 실행 결과가 있을 때 항상 확장
    },
    toggleResultExpanded: (state) => {
      state.isResultExpanded = !state.isResultExpanded;
    },
  },
});

export const { setExecutionResult, toggleResultExpanded } =
  executionResultSlice.actions;

export default executionResultSlice.reducer;
