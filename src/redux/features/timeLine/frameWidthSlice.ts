import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FrameWidthState{
  value: number,
}

const initialState: FrameWidthState = {
  value: 0.1,
};

const frameWidthSlice = createSlice({
  name: 'frameWidth',
  initialState,
  reducers: {
    setFrameWidth: (state: FrameWidthState, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { setFrameWidth } = frameWidthSlice.actions;
export default frameWidthSlice.reducer;