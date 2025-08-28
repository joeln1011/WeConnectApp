import { rootApi } from "./rootApi";

export const friendApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
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
        invalidatesTags: (result, error, args) => [
          { type: "USERS", id: args },
          { type: "GET_USER_INFO_BY_ID", id: result._id },
        ],
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
      acceptFriendRequest: builder.mutation({
        query: (userId) => {
          return {
            url: "/friends/accept",
            method: "POST",
            body: {
              friendId: userId,
            },
          };
        },
        invalidatesTags: (result, error, args) => [
          { type: "USERS", id: args },
          { type: "PENDING_FRIEND_REQUEST", id: args },
        ],
      }),
      cancelFriendRequest: builder.mutation({
        query: (userId) => {
          return {
            url: "/friends/cancel",
            method: "POST",
            body: {
              friendId: userId,
            },
          };
        },
        invalidatesTags: (result, error, args) => [
          { type: "USERS", id: args },
          { type: "PENDING_FRIEND_REQUEST", id: args },
        ],
      }),

      getFriends: builder.query({
        query: () => "/friends",
        providesTags: (result) =>
          result?.friends
            ? [
                ...result.friends.map(({ _id }) => ({
                  type: "GET_FRIENDS",
                  id: _id,
                })),
                { type: "GET_FRIENDS", id: "LIST" },
              ]
            : [{ type: "GET_FRIENDS", id: "LIST" }],
      }),
      getFriendsByUserId: builder.query({
        query: (userId) => `/users/${userId}/friends`,
        providesTags: (result) =>
          result?.friends
            ? [
                ...result.friends.map(({ _id }) => ({
                  type: "GET_FRIENDS",
                  id: _id,
                })),
                { type: "GET_FRIENDS", id: "LIST" },
              ]
            : [{ type: "GET_FRIENDS", id: "LIST" }],
      }),
    };
  },
});

export const {
  useSendFriendRequestMutation,
  useGetPendingFriendRequestsQuery,
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useGetFriendsQuery,
  useGetFriendsByUserIdQuery,
} = friendApi;
