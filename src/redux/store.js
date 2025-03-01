import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "@redux/slices/authSlice";
import snackbarReducer from "@redux/slices/snackbarSlice";
import settingsReducer from "@redux/slices/settingsSlice";
import dialogReducer from "@redux/slices/dialogSlice";
import { rootApi } from "@services/rootApi";
import storage from "redux-persist/lib/storage"; // localStorage
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistStore,
} from "redux-persist";
import { logOutMiddleware } from "./middleWares";
import { setupListeners } from "@reduxjs/toolkit/query";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: [
    rootApi.reducerPath,
    // dialogReducer.reducerPath,
    // settingsReducer.reducerPath,
    "dialog",
    "settings",
  ],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    auth: authReducer,
    snackbar: snackbarReducer,
    settings: settingsReducer,
    dialog: dialogReducer,
    [rootApi.reducerPath]: rootApi.reducer,
  }),
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logOutMiddleware, rootApi.middleware);
  },
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
