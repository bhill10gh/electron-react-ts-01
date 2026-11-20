import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  message: string;
  videoUrl: string;
  audioUrl: string;
}

const initialState: AppState = {
  message: "",
  videoUrl: "",
  audioUrl: "",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },

    clearMessage: (state) => {
      state.message = "";
    },

    setVideoUrl: (state, action: PayloadAction<string>) => {
      state.videoUrl = action.payload;
    },

    setAudioUrl: (state, action: PayloadAction<string>) => {
      state.audioUrl = action.payload;
    },

    clearVideoUrl: (state) => {
      state.videoUrl = "";
    },

    clearAudioUrl: (state) => {
      state.audioUrl = "";
    },
  },
});

export const {
  setMessage,
  clearMessage,
  setVideoUrl,
  setAudioUrl,
  clearVideoUrl,
  clearAudioUrl,
} = appSlice.actions;

export default appSlice.reducer;
