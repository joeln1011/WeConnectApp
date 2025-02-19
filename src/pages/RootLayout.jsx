import { Outlet } from "react-router-dom";
import { Suspense } from "react";
// Supports weights 100-900
import "@fontsource-variable/public-sans";
import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeSnackbar } from "@redux/slices/snackbarSlice";

const RootPlayout = () => {
  const dispatch = useDispatch();
  const { open, type, message } = useSelector((state) => {
    return state.snackbar;
  });

  return (
    <div>
      <Suspense fallback={<p>Loading</p>}>
        <Outlet />
      </Suspense>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={dispatch(closeSnackbar)}
      >
        <Alert severity={type} variant="filled" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RootPlayout;
