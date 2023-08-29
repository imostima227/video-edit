import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IsEmptyState {
  value: boolean
}

const initialState = {
  value: true,
};

const isEmptySlice = createSlice({
  name: 'isEmpty',
  initialState,
  reducers: {
    setIsEmpty: (state: IsEmptyState,action: PayloadAction<boolean>) => {
      state.value = action.payload;
    }
  }
});

export const { setIsEmpty } = isEmptySlice.actions;
export default isEmptySlice.reducer;