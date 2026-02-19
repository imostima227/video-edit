import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VideoRenderType } from '@type/video';

interface VideoItemState{
  value: VideoRenderType
}

const initialState: VideoItemState = {
  value: {
    id: '',
    name: '',
    videoUrl: '',
    coverUrl: '',
    duration: -1,
  },
};

export const videoItemSlice = createSlice({
  name: 'videoItem',
  initialState,
  reducers: {
    setVideoItem: (state: VideoItemState,action: PayloadAction<VideoRenderType>) => {
      state.value = action.payload;
    },
  },
});


export const { setVideoItem } = videoItemSlice.actions;
export default videoItemSlice.reducer;