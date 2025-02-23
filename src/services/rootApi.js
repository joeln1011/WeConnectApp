import { login, logOut } from "@redux/slices/authSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    console.log({ store: getState() });
    const token = getState().auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log("baseQueryWithForceLogout", { result });

  if (result?.error?.status === 401) {
    if (result?.error?.data?.message === "Token has expired.") {
      const refreshToken = api.getState().auth.refreshToken;

      if (refreshToken) {
        const refreshResult = await baseQuery(
          {
            url: "/refresh-token",
            body: { refreshToken },
            method: "POST",
          },
          api,
          extraOptions,
        );

        const newAccessToken = refreshResult?.data?.accessToken;

        if (newAccessToken) {
          api.dispatch(
            login({
              accessToken: newAccessToken,
              refreshToken,
            }),
          );

          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logOut());
          window.location.href = "/login";
        }
      }
    } else {
      window.location.href = "/login";
    }
  }

  return result;
};

export const rootApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["POST", "USERS"],
  endpoints: (builder) => {
    return {
      register: builder.mutation({
        query: ({ fullName, email, password }) => {
          return {
            url: "/signup",
            body: { fullName, email, password },
            method: "POST",
          };
        },
      }),
      login: builder.mutation({
        query: ({ email, password }) => {
          return {
            url: "/login",
            body: { email, password },
            method: "POST",
          };
        },
      }),
      verifyOTP: builder.mutation({
        query: ({ email, otp }) => {
          return {
            url: "/verify-otp",
            body: { email, otp },
            method: "POST",
          };
        },
      }),
      refreshToken: builder.mutation({
        query: (refreshToken) => {
          return {
            url: "/refresh-token",
            body: { refreshToken },
            method: "POST",
          };
        },
      }),
      getAuthUser: builder.query({
        query: () => "/auth-user",
      }),
      createPost: builder.mutation({
        query: (formData) => {
          return {
            url: "/posts",
            method: "POST",
            body: formData,
          };
        },
        invalidatesTags: ["POSTS"],
      }),
      getPosts: builder.query({
        query: ({ limit, offset } = {}) => {
          return {
            url: "/posts",
            // method: 'GET',
            params: { limit, offset },
          };
        },
        providesTags: [{ type: "POSTS" }],
      }),
      searchUsers: builder.query({
        query: ({ limit, offset, searchQuery } = {}) => {
          const encodeQuery = encodeURIComponent(searchQuery.trim());
          return {
            url: `/search/users/${encodeQuery}`,
            // method: 'GET',
            params: { limit, offset },
          };
        },
        providesTags: (result) =>
          result
            ? [
                ...result.users.map(({ _id }) => ({ type: "USERS", id: _id })),
                { type: "USERS", id: "LIST" },
              ]
            : [{ type: "USER", id: "LIST" }],
      }),
      sendFriendRequest: builder.mutation({
        query: (userId) => {
          return {
            url: "/friends/request",
            method: "POST",
            body: {
              friendId: userId,
            },
          };
        },
        invalidatesTags: (result, error, args) => [{ type: "USERS", id: args }],
      }),
      getPendingFriendRequests: builder.query({
        query: () => "/friends/pending",
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ _id }) => ({
                  type: "PENDING_FRIEND_REQUEST",
                  id: _id,
                })),
                { type: "PENDING_FRIEND_REQUEST", id: "LIST" },
              ]
            : [{ type: "PENDING_FRIEND_REQUEST", id: "LIST" }],
      }),
    };
  },
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOTPMutation,
  useGetAuthUserQuery,
  useCreatePostMutation,
  useRefreshTokenMutation,
  useGetPostsQuery,
  useSearchUsersQuery,
  useSendFriendRequestMutation,
  useGetPendingFriendRequestsQuery,
} = rootApi;
