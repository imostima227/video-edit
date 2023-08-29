import { configureStore } from '@reduxjs/toolkit';
import videoItemReducer from './features/video/videoItemSlice';
import videoListReducer from './features/video/videoListSlice';
import isVideoPlayingReducer from './features/video/isVideoPlayingSlice';
import videoTimeSlice from './features/video/videoTimeSlice';
import frameWidthSlice from './features/timeLine/frameWidthSlice';
import selectedTabSlice from './features/sidebar/selectedTab';
import isEmptySlice from './features/timeLine/isEmptySlice';
import maxFramesSlice from './features/timeLine/maxFramesSlice';

const store = configureStore({
  reducer: {
    videoItem: videoItemReducer,
    videoList: videoListReducer,
    isVideoPlaying: isVideoPlayingReducer,
    videoTime: videoTimeSlice,
    frameWidth: frameWidthSlice,
    selectedTab: selectedTabSlice,
    isEmpty: isEmptySlice,
    maxFrames: maxFramesSlice,
  },
});

export default store;

//ts需要定义RootState和AppDispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;