import { rootApi } from "./rootApi";

export const groupApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      createGroup: builder.mutation({
        query: (data) => {
          return {
            url: "/groups",
            method: "POST",
            body: data,
          };
        },
        invalidatesTags: [{ type: "GET_ALL_GROUPS", id: "LIST" }],
      }),
      getGroups: builder.query({
        query: (limit, offset, searchQuery) => {
          return {
            url: "/groups",
            params: { limit, offset, searchQuery },
          };
        },
        providesTags: (result) => {
          return result?.groups
            ? [
                ...result.groups.map(({ _id }) => ({
                  type: "GET_ALL_GROUPS",
                  id: _id,
                })),
                { type: "GET_ALL_GROUPS", id: "LIST" },
              ]
            : [{ type: "GET_ALL_GROUPS", id: "LIST" }];
        },
      }),
      getGroupDetail: builder.query({
        query: (id) => {
          return {
            url: `/groups/${id}`,
          };
        },
        providesTags: (result, error, params) => {
          return [{ type: "GET_GROUP_DETAIL", id: params }];
        },
      }),
      getMyGroups: builder.query({
        query: (limit, offset, status) => {
          return {
            url: "/user/groups",
            params: { limit, offset, status },
          };
        },
        providesTags: (result) => {
          return result?.groups
            ? [
                ...result.groups.map(({ _id }) => ({
                  type: "GET_MY_GROUPS",
                  id: _id,
                })),
                { type: "GET_MY_GROUPS", id: "LIST" },
              ]
            : [{ type: "GET_MY_GROUPS", id: "LIST" }];
        },
      }),
      requestJoinGroup: builder.mutation({
        query: (groupId) => {
          return {
            url: `/groups/${groupId}/join`,
            method: "POST",
          };
        },
      }),
      leaveGroup: builder.mutation({
        query: (groupId) => {
          return {
            url: `/groups/${groupId}/leave`,
            method: "POST",
          };
        },
        invalidatesTags: (result, error, args) => {
          return [
            { type: "GET_ALL_GROUPS", id: "LIST" },
            { type: "GET_ALL_GROUPS", id: args },
            { type: "GET_MY_GROUPS", id: "LIST" },
          ];
        },
      }),
    };
  },
});

export const {
  useCreateGroupMutation,
  useGetGroupsQuery,
  useGetMyGroupsQuery,
  useLeaveGroupMutation,
  useRequestJoinGroupMutation,
  useGetGroupDetailQuery,
} = groupApi;
