// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import octopusReducer from "../pages/Game/slices/octopusSlice";
import featureReducer from "../pages/Game/slices/featureSlice";

const store = configureStore({
  reducer: {
    octopus: octopusReducer,
    feature: featureReducer,

    // 다른 리듀서가 있다면 여기에 추가하세요.
  },
});

export default store;
