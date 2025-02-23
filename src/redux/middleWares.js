import { logOut } from "./slices/authSlice";
import { persistor } from "./store";

export const logOutMiddleware = () => {
  return (next) => {
    return (action) => {
      if (action.type === logOut.type) {
        persistor.purge();
      }

      return next(action);
    };
  };
};
