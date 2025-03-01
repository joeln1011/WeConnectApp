import { useLazyLoadPosts, useUserInfo } from "@hooks/index";
import Post from "./Post";
import Loading from "./Loading";
import { useLikePostMutation } from "@services/postApi";

const PostList = () => {
  const { isFetching, posts } = useLazyLoadPosts();
  const [likePost] = useLikePostMutation();
  const { _id } = useUserInfo();
  return (
    <div className="flex flex-col gap-4 py-4">
      {(posts || []).map((post) => (
        <Post
          key={post._id}
          id={post._id}
          fullName={post.author?.fullName}
          createdAt={post.createdAt}
          content={post.content}
          image={post.image}
          likes={post.likes}
          comments={post.comments}
          isLiked={post.likes.some((like) => like.author?._id === _id)}
          onLike={(postId) => {
            likePost(postId);
          }}
        />
      ))}
      {isFetching && <Loading />}
    </div>
  );
};
export default PostList;
