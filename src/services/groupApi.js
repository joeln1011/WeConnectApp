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
    };
  },
});

export const { useCreateGroupMutation, useGetGroupsQuery } = groupApi;
