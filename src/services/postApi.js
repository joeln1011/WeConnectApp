import { createEntityAdapter } from "@reduxjs/toolkit";
import { rootApi } from "./rootApi";

export const postsAdapter = createEntityAdapter({
  selectId: (post) => post._id,
  sortComparer: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
});

const initialState = postsAdapter.getInitialState();

export const postApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      createPost: builder.mutation({
        query: (formData) => {
          return {
            url: "/posts",
            method: "POST",
            body: formData,
          };
        },
        onQueryStarted: async (
          args,
          { dispatch, queryFulfilled, getState },
        ) => {
          const store = getState();
          const tempId = crypto.randomUUID();
          const newPost = {
            _id: tempId,
            likes: [],
            comments: [],
            content: args.get("content"),
            author: {
              notifications: [],
              _id: store.auth.userInfo._id,
              fullName: store.auth.userInfo.fullName,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            __v: 0,
          };

          const patchResult = dispatch(
            rootApi.util.updateQueryData("getPosts", "allPosts", (draft) => {
              postsAdapter.addOne(draft, newPost);
            }),
          );

          try {
            const { data } = await queryFulfilled;
            dispatch(
              rootApi.util.updateQueryData("getPosts", "allPosts", (draft) => {
                postsAdapter.removeOne(draft, tempId);
                postsAdapter.addOne(draft, data);
              }),
            );
          } catch (err) {
            console.log({ err });
            patchResult.undo();
          }
        },
      }),
      getPosts: builder.query({
        query: ({ limit, offset } = {}) => {
          return {
            url: "/posts",
            params: { limit, offset },
          };
        },
        transformResponse: (response) => {
          return postsAdapter.upsertMany(initialState, response);
        },
        serializeQueryArgs: () => "allPosts",
        merge: (currentCache, newItems) => {
          // gop du lieu tu request truoc do + voi du lieu moi sau nay, no luon dam bao (entity adapter)
          // du lieu se ko bi duplicate boi vi no da co 1 he thong cac ids duy nhat
          return postsAdapter.upsertMany(currentCache, newItems.entities);
        },
        providesTags: [{ type: "POSTS" }],
      }),
      likePost: builder.mutation({
        query: (postId) => {
          return {
            url: `/posts/${postId}/like`,
            method: "POST",
          };
        },
        onQueryStarted: async (
          args,
          { dispatch, queryFulfilled, getState },
        ) => {
          const store = getState();
          const tempId = crypto.randomUUID();
          // const newPost = {
          //   _id: tempId,
          //   likes: [],
          //   comments: [],
          //   content: args.get("content2"),
          //   author: {
          //     notifications: [],
          //     _id: store.auth.userInfo._id,
          //     fullName: store.auth.userInfo.fullName,
          //   },
          //   createdAt: new Date().toISOString(),
          //   updatedAt: new Date().toISOString(),
          //   __v: 0,
          // };

          const patchResult = dispatch(
            rootApi.util.updateQueryData("getPosts", "allPosts", (draft) => {
              const currentPost = draft.entities[args];
              if (currentPost) {
                currentPost.likes.push({
                  author: {
                    _id: store.auth.userInfo._id,
                    fullName: store.auth.userInfo.fullName,
                  },
                  _id: tempId,
                });
              }
            }),
          );

          try {
            const { data } = await queryFulfilled;

            dispatch(
              rootApi.util.updateQueryData("getPosts", "allPosts", (draft) => {
                const currentPost = draft.entities[args];
                if (currentPost) {
                  currentPost.likes = currentPost.likes.map((like) => {
                    if (like._id === tempId) {
                      return {
                        author: {
                          _id: store.auth.userInfo._id,
                          fullName: store.auth.userInfo.fullName,
                        },
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt,
                        _id: data._id,
                      };
                    }

                    return like;
                  });
                }
              }),
            );
          } catch (err) {
            console.log({ err });
            patchResult.undo();
          }
        },
      }),
      unlikePost: builder.mutation({
        query: (postId) => {
          return {
            url: `/posts/${postId}/unlike`,
            method: "DELETE",
          };
        },
      }),
      createComment: builder.mutation({
        query: ({ postId, comment }) => {
          return {
            url: `/posts/${postId}/comments`,
            method: "POST",
            body: { comment },
          };
        },
        onQueryStarted: async (
          params,
          { dispatch, queryFulfilled, getState },
        ) => {
          const tempId = crypto.randomUUID();
          const store = getState();

          const optimisticComment = {
            _id: tempId,
            comment: params.comment,
            author: {
              _id: store.auth.userInfo._id,
              fullName: store.auth.userInfo.fullName,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const patchResult = dispatch(
            rootApi.util.updateQueryData("getPosts", "allPosts", (draft) => {
              const currentPost = draft.entities[params.postId];

              if (currentPost) {
                currentPost.comments.push(optimisticComment);
              }
            }),
          );

          try {
            const { data } = await queryFulfilled;
            dispatch(
              rootApi.util.updateQueryData("getPosts", "allPosts", (draft) => {
                const currentPost = draft.entities[params.postId];
                if (currentPost) {
                  const commentIndex = currentPost.comments.findIndex(
                    (comment) => comment._id === tempId,
                  );

                  if (commentIndex !== -1) {
                    currentPost.comments[commentIndex] = data;
                  }
                }
              }),
            );
          } catch (err) {
            console.log({ err });
            patchResult.undo();
          }
        },
      }),
    };
  },
});

export const {
  useCreatePostMutation,
  useGetPostsQuery,
  useLikePostMutation,
  useUnlikePostMutation,
  useCreateCommentMutation,
} = postApi;
