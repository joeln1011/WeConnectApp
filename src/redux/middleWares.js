import { rootApi } from "@services/rootApi";
import { logOut } from "./slices/authSlice";
import { persistor } from "./store";

export const logOutMiddleware = (store) => {
  return (next) => {
    return (action) => {
      if (action.type === logOut.type) {
        store.dispatch(rootApi.util.resetApiState());
        persistor.purge();
      }

      return next(action);
    };
  };
};
