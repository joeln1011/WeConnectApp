import { useUserInfo } from "@hooks/index";
import { useLazyLoadGroupPosts } from "@hooks/useLazyLoadGroupPosts";
import Post from "@components/Post";
import Loading from "@components/Loading";
import {
  useCreateGroupCommentMutation,
  useLikeGroupPostMutation,
  useUnlikeGroupPostMutation,
} from "@services/groupPostApi";

const GroupPostList = ({ groupId }) => {
  const { isFetching, posts } = useLazyLoadGroupPosts({ groupId });

  const [likePost] = useLikeGroupPostMutation();
  const [unlikePost] = useUnlikeGroupPostMutation();
  const { _id } = useUserInfo();
  const [createComment] = useCreateGroupCommentMutation();

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
            await likePost(postId).unwrap();
          }}
          onUnlike={async (postId) => {
            await unlikePost(postId).unwrap();
          }}
          onComment={async ({ comment, postId }) => {
            await createComment({ comment, postId }).unwrap();
          }}
        />
      ))}
      {isFetching && <Loading />}
    </div>
  );
};
export default GroupPostList;
