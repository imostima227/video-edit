import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface SelectedTabState{
  value: string,
}

const initialState: SelectedTabState = {
  value: '我的资源',
};

const selectedTabSlice = createSlice({
  name: 'selectedTab',
  initialState,
  reducers: {
    setSelectedTab: (state: SelectedTabState, action: PayloadAction<string>) => {
      state.value = action.payload;
    }
  }
});

export const { setSelectedTab } = selectedTabSlice.actions;
export default selectedTabSlice.reducer;