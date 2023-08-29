import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VideoRenderType } from '@type/video';

interface videoItemState{
  value: VideoRenderType
}

const initialState: videoItemState = {
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
    setVideoItem: (state: videoItemState,action: PayloadAction<VideoRenderType>) => {
      state.value = action.payload;
    },
  },
});

export const { setVideoItem } = videoItemSlice.actions;
export default videoItemSlice.reducer;