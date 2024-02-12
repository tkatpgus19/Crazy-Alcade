// features/code/codeSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const codeSlice = createSlice({
  name: "code",
  initialState: {
    content: "",
    lang: "",
  },
  reducers: {
    setCode: (state, action) => {
      state.content = action.payload;
    },
    setLanguage: (state, action) => {
      state.lang = action.payload;
    },
  },
});

export const { setCode, setLanguage } = codeSlice.actions;

export default codeSlice.reducer;
