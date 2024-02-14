// features/settings/settingsSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    isMicrophoneOn: true,
    isCameraOn: true,
    isAudioOn: true,
  },
  reducers: {
    toggleMicrophone: (state) => {
      state.isMicrophoneOn = !state.isMicrophoneOn;
    },
    toggleCamera: (state) => {
      state.isCameraOn = !state.isCameraOn;
    },
    toggleAudio: (state) => {
      state.isAudioOn = !state.isAudioOn;
    },
  },
});

export const { toggleMicrophone, toggleCamera, toggleAudio } =
  settingsSlice.actions;

export default settingsSlice.reducer;
