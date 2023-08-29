import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VideoRenderType } from '@type/video';

interface VideoListState{
  value: VideoRenderType[],
}

const initialState: VideoListState = {
  value: [],
};

export const videoListSlice = createSlice({
  name: 'videoList',
  initialState,
  reducers: {
    addVideo: (state,action:PayloadAction<VideoRenderType>) => {
      state.value.push(action.payload);
    },
    delVideo: (state,action:PayloadAction<string>) => {
      for(let i=0; i<state.value.length; i++){
        if(state.value[i].id === action.payload){
          state.value.splice(i,1);
        }
      }
    },
  },
});

export const { addVideo,delVideo } = videoListSlice.actions;
export default videoListSlice.reducer;