import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IsVideoPlayingState{
  value: boolean
}

const initialState: IsVideoPlayingState = {
  value: false,
};

const isVideoPlayingSlice = createSlice({
  name: 'isVideoPlaying',
  initialState,
  reducers: {
    changeIsPlaying: (state) => {
      //console.log('enter changeIsPlaying');
      //console.log(`initial:${state.value}`);
      state.value = !state.value;
      //console.log(`then:${state.value}`);
    },
    setIsPlaying: (state,action:PayloadAction<boolean>) => {
      //console.log('enter setIsPlaying');
      state.value = action.payload;
    },
  },
});

export const { changeIsPlaying, setIsPlaying } = isVideoPlayingSlice.actions;
export default isVideoPlayingSlice.reducer;
