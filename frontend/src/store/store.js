// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import octopusReducer from "../pages/Game/slices/octopusSlice";
import featureReducer from "../pages/Game/slices/featureSlice";
import codeReducer from "../pages/Game/slices/codeSlice";
import executionResultReducer from "../pages/Game/slices/executionResultSlice";
import loadingReducer from "../pages/Game/slices/loadingSlice"; // 로딩 slice 임포트

const store = configureStore({
  reducer: {
    octopus: octopusReducer,
    feature: featureReducer,
    code: codeReducer,
    executionResult: executionResultReducer,
    loading: loadingReducer, // 스토어에 로딩 reducer 추가

    // 다른 리듀서가 있다면 여기에 추가하세요.
  },
});

export default store;
