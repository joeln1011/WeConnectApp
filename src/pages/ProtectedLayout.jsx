import Header from "@components/Header";
import Loading from "@components/Loading";
import SocketProvider from "@context/SocketProvider";
import { saveUserInfo } from "@redux/slices/authSlice";
import { useGetAuthUserQuery } from "@services/rootApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  const response = useGetAuthUserQuery();
  const dispatch = useDispatch();
  // endpoint name + params
  console.log({ response });

  useEffect(() => {
    if (response.isSuccess) {
      dispatch(saveUserInfo(response.data));
    }
  }, [response.isSuccess, response.data, dispatch]);

  if (response.isLoading) {
    return <Loading />;
  }

  return (
    <SocketProvider>
      <div>
        <Header />
        <div className="bg-dark-200">
          <Outlet />
        </div>
      </div>
    </SocketProvider>
  );
};
export default ProtectedLayout;
