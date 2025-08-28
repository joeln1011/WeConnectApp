import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  message: null,
  type: "success",
};

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState: initialState,
  reducers: {
    openSnackbar: (state, action) => {
      state.open = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },

    closeSnackbar: () => {
      return initialState;
    },
  },
});

export const { openSnackbar, closeSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
