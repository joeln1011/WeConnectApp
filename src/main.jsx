import ReactDOM from "react-dom/client";
import "./index.css";
import theme from "@configs/muiConfig";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { persistor, store } from "@redux/store";
import { PersistGate } from "redux-persist/integration/react";
import Dialog from "@components/Dialog";
import Loading from "@components/Loading";
import router from "./routes";
import VideoCallProvider from "@context/VideoCallProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={<Loading />} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <VideoCallProvider>
          <RouterProvider router={router} />
          <Dialog />
        </VideoCallProvider>
      </ThemeProvider>
    </PersistGate>
  </Provider>,
);
