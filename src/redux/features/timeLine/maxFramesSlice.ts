import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MaxFramesState {
  value: number
}

const initialState = {
  value: 0,
};

const maxFramesSlice = createSlice({
  name: 'maxFrames',
  initialState,
  reducers: {
    setMaxFrames: (state: MaxFramesState,action: PayloadAction<number>) => {
      state.value = action.payload;
    }
  }
});

export const { setMaxFrames } = maxFramesSlice.actions;
export default maxFramesSlice.reducer;