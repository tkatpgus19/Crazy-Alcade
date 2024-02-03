// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import octopusReducer from "../pages/Game/slices/octopusSlice";

const store = configureStore({
  reducer: {
    octopus: octopusReducer,
    // 다른 리듀서가 있다면 여기에 추가하세요.
  },
});

export default store;
