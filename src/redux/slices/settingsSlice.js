import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isShowDrawer: true,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState: initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.isShowDrawer = !state.isShowDrawer;
    },
  },
});

export const { toggleDrawer } = settingsSlice.actions;
export default settingsSlice.reducer;
