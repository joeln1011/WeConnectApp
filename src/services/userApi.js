import { rootApi } from "./rootApi";

export const userApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getUserInfoById: builder.query({
        query: (id) => `/users/${id}`,
        providesTags: (result) => [
          { type: "GET_USER_INFO_BY_ID", id: result._id },
        ],
      }),
      uploadPhoto: builder.mutation({
        query: (formData) => {
          return {
            url: "/users/upload-photo",
            method: "POST",
            body: formData,
          };
        },
        invalidatesTags: [
          { type: "GET_AUTH_USER" },
          { type: "GET_USER_INFO_BY_ID" },
        ],
      }),
      deletePhoto: builder.mutation({
        query: (isCover) => {
          return {
            url: "/users/reset-photo",
            method: "DELETE",
            body: { isCover },
          };
        },
        invalidatesTags: [
          { type: "GET_AUTH_USER" },
          { type: "GET_USER_INFO_BY_ID" },
        ],
        // invalidatesTags: (result, error, args) => [
        //   { type: "USERS", id: args },
        //   { type: "PENDING_FRIEND_REQUEST", id: args },
        // ],
      }),
      updateUserProfile: builder.mutation({
        query: (payload) => {
          return {
            url: "/users/update-profile",
            method: "PATCH",
            body: payload,
          };
        },
        invalidatesTags: [{ type: "GET_AUTH_USER" }],
      }),
    };
  },
});

export const {
  useGetUserInfoByIdQuery,
  useUploadPhotoMutation,
  useUpdateUserProfileMutation,
  useDeletePhotoMutation,
} = userApi;
