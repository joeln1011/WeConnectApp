import { configureStore } from "@reduxjs/toolkit";
import { rootApi } from "@services/rootApi";
import authReducer from "@redux/slices/authSlice";
import snackbarReducer from "@redux/slices/snackbarSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    snackbar: snackbarReducer,
    [rootApi.reducerPath]: rootApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(rootApi.middleware);
  },
});
