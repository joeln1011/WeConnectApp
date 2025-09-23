import { Outlet } from "react-router-dom";
import { Suspense } from "react";
// Supports weights 100-900
import "@fontsource-variable/public-sans";
import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeSnackbar } from "@redux/slices/snackbarSlice";
import Loading from "@components/Loading";
import Dialog from "@components/Dialog";

const RootLayout = () => {
  const dispatch = useDispatch();

  const { open, type, message } = useSelector((state) => {
    console.log("RootLayout", state);
    return state.snackbar;
  });

  return (
    <div className="text-dark-100">
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => dispatch(closeSnackbar())}
      >
        <Alert severity={type} variant="filled" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
      <Dialog />
    </div>
  );
};
export default RootLayout;
