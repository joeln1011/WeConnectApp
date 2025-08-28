import Post from "./Post";
import Loading from "./Loading";
import { useLazyLoadPosts, useNotifications, useUserInfo } from "@hooks/index";
import {
  useCreateCommentMutation,
  useLikePostMutation,
} from "@services/postApi";

const PostList = ({ userId }) => {
  const { isFetching, posts } = useLazyLoadPosts({ userId });
  const [likePost] = useLikePostMutation();
  const { _id } = useUserInfo();
  const [createComment] = useCreateCommentMutation();
  const { createNotification } = useNotifications();

  return (
    <div className="flex flex-col gap-4">
      {(posts || []).map((post) => (
        <Post
          key={post._id}
          id={post._id}
          fullName={post.author?.fullName}
          avatarImage={post.author?.image}
          authorId={post.author?._id}
          createdAt={post.createdAt}
          content={post.content}
          image={post.image}
          likes={post.likes}
          comments={post.comments}
          isLiked={post.likes.some((like) => like.author?._id === _id)}
          onLike={async (postId) => {
            const res = await likePost(postId).unwrap();

            createNotification({
              receiverUserId: post.author?._id,
              postId: post._id,
              notificationType: "like",
              notificationTypeId: res._id,
            });
          }}
          onComment={async ({ comment, postId }) => {
            console.log({ comment, postId });
            const res = await createComment({ comment, postId }).unwrap();

            createNotification({
              receiverUserId: post.author?._id,
              postId: post._id,
              notificationType: "comment",
              notificationTypeId: res._id,
            });
          }}
        />
      ))}
      {isFetching && <Loading />}
    </div>
  );
};
export default PostList;
