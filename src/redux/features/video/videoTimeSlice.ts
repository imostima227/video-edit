import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VideoTimeState {
  value: number,
}

const initialState: VideoTimeState = {
  value: 0,
};

export const videoTimeSlice = createSlice({
  name: 'videoTime',
  initialState,
  reducers: {
    setVideoTime: (state: VideoTimeState, action: PayloadAction<number>) => {
      //console.log(action.payload);
      state.value = action.payload;
    },
    addVideoTime: (state: VideoTimeState) => {
      state.value = state.value + 1;
    },
    addVideoFrameTime: (state: VideoTimeState) => {
      state.value = state.value + 1/30;
    },
    delVideoFrameTime: (state: VideoTimeState) => {
      state.value = state.value - 1/30;
    },
  },
});


export const { setVideoTime,addVideoTime,addVideoFrameTime,delVideoFrameTime } = videoTimeSlice.actions;
export default videoTimeSlice.reducer;
