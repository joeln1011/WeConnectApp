import { rootApi } from "./rootApi";

export const notificationApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getNotifications: builder.query({
        query: () => "/notifications",
        providesTags: (result) =>
          result
            ? [
                ...result.notifications.map(({ _id }) => ({
                  type: "GET_NOTIFICATIONS",
                  id: _id,
                })),
                { type: "GET_NOTIFICATIONS", id: "LIST" },
              ]
            : [{ type: "GET_NOTIFICATIONS", id: "LIST" }],
      }),
      createNotification: builder.mutation({
        query: ({ userId, postId, notificationType, notificationTypeId }) => {
          return {
            url: "/notifications/create",
            method: "POST",
            body: {
              userId,
              postId,
              notificationType,
              notificationTypeId,
            },
          };
        },
        // invalidatesTags: (result, error, args) => [
        //   { type: "USERS", id: args },
        //   { type: "PENDING_FRIEND_REQUEST", id: args },
        // ],
      }),
    };
  },
});

export const { useGetNotificationsQuery, useCreateNotificationMutation } =
  notificationApi;
