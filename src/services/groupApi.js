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
        query: ({ limit, offset, searchQuery }) => {
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
        providesTags: (result, error, args) => {
          return [{ type: "GET_GROUP_DETAIL", id: args }];
        },
      }),
      getMyGroups: builder.query({
        query: ({ limit, offset, status }) => {
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
        invalidatesTags: (result, error, args) => [
          { type: "GET_ALL_GROUPS", id: "LIST" },
          { type: "GET_ALL_GROUPS", id: args },
          { type: "GET_MY_GROUPS", id: "LIST" },
          { type: "GET_GROUP_DETAIL", id: args },
        ],
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
            { type: "GET_GROUP_DETAIL", id: args },
          ];
        },
      }),
      getGroupPendingRequests: builder.query({
        query: (groupId) => `/groups/${groupId}/pending-requests`,
        providesTags: (result) =>
          result?.pendingRequests
            ? [
                ...result.pendingRequests.map(({ _id }) => ({
                  type: "PENDING_GROUP_REQUEST",
                  id: _id,
                })),
                { type: "PENDING_GROUP_REQUEST", id: "LIST" },
              ]
            : [{ type: "PENDING_GROUP_REQUEST", id: "LIST" }],
      }),
      respondGroupPendingRequest: builder.mutation({
        query: ({ groupId, userId, approve }) => {
          return {
            url: `/groups/${groupId}/respond-request`,
            method: "POST",
            body: {
              userId,
              approve,
            },
          };
        },
        invalidatesTags: (result, error, args) => [
          { type: "PENDING_GROUP_REQUEST", id: "LIST" },
          { type: "GET_GROUP_DETAIL", id: args.groupId },
          { type: "GET_GROUP_MEMBERS", id: "LIST" },
        ],
      }),
      uploadGroupBanner: builder.mutation({
        query: ({ groupId, formData }) => {
          return {
            url: `/groups/${groupId}/image`,
            method: "POST",
            body: formData,
          };
        },
        invalidatesTags: (result, error, args) => {
          return [{ type: "GET_GROUP_DETAIL", id: args.groupId }];
        },
      }),
      getGroupMembers: builder.query({
        query: (groupId) => {
          return {
            url: `/groups/${groupId}/members`,
          };
        },
        providesTags: (result) =>
          result?.members
            ? [
                ...result.members.map(({ _id }) => ({
                  type: "GET_GROUP_MEMBERS",
                  id: _id,
                })),
                { type: "GET_GROUP_MEMBERS", id: "LIST" },
              ]
            : [{ type: "GET_GROUP_MEMBERS", id: "LIST" }],
      }),
      updateMember: builder.mutation({
        query: ({ groupId, userId, role }) => {
          return {
            url: `/groups/${groupId}/members/${userId}`,
            method: "PUT",
            body: { role },
          };
        },
        invalidatesTags: (result, error, args) => {
          return [
            { type: "GET_GROUP_DETAIL", id: args.groupId },
            { type: "GET_GROUP_MEMBERS", id: "LIST" },
          ];
        },
      }),
      removeMember: builder.mutation({
        query: ({ groupId, userId }) => {
          return {
            url: `/groups/${groupId}/members/${userId}`,
            method: "DELETE",
          };
        },
        invalidatesTags: (result, error, args) => {
          return [
            { type: "GET_GROUP_DETAIL", id: args.groupId },
            { type: "GET_GROUP_MEMBERS", id: "LIST" },
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
  useGetGroupPendingRequestsQuery,
  useRespondGroupPendingRequestMutation,
  useUploadGroupBannerMutation,
  useGetGroupMembersQuery,
  useUpdateMemberMutation,
  useRemoveMemberMutation,
} = groupApi;
