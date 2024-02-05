import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../utils/counter/counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
