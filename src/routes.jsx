import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";

import ProtectedLayout from "@pages/ProtectedLayout";
import MessagePage from "@pages/MessagePage";
import SearchUsersPage from "@pages/SearchUserPage";

import RootLayout from "@pages/RootLayout";
import AuthLayout from "@pages/auth/AuthLayout";

const HomePage = lazy(() => import("@pages/HomePage"));
const UserProfilePage = lazy(() => import("@pages/UserProfile/UserProfile"));
import RegisterPage from "@pages/auth/RegisterPage";
import LoginPage from "@pages/auth/LoginPage";
import OTPVerifyPage from "@pages/auth/OTPVerifyPage";
import About from "@pages/UserProfile/About";
import FriendLists from "@pages/UserProfile/FriendLists";
import AccountSettings from "@pages/AccountSettings";
import ChatDetail from "@components/Messages/ChatDetail";
import GroupPage from "@pages/GroupPage";
import GroupExplore from "@components/Groups/GroupExplore";
import MyGroups from "@components/Groups/MyGroups";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/messages",
            element: <MessagePage />,
            children: [
              {
                path: ":userId",
                element: <ChatDetail />,
              },
            ],
          },
          {
            path: "/search/users",
            element: <SearchUsersPage />,
          },
          {
            path: "/users/:userId",
            element: <UserProfilePage />,
            children: [
              {
                index: true,
                element: <Navigate to="about" replace />,
              },
              {
                path: "about", // /users/userId/about
                element: <About />,
              },
              {
                path: "friends",
                element: <FriendLists />,
              },
            ],
          },
          {
            path: "/settings",
            children: [
              {
                path: "account",
                element: <AccountSettings />,
              },
            ],
          },
          {
            path: "/groups",
            element: <GroupPage />,
            children: [
              {
                index: true,
                element: <Navigate to="explore" replace />,
              },
              {
                path: "explore",
                element: <GroupExplore />,
              },
              {
                path: "my-groups",
                element: <MyGroups />,
              },
            ],
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/register",
            element: <RegisterPage />,
          },
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/verify-otp",
            element: <OTPVerifyPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
