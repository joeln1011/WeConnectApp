import { Comment, Send, ThumbUp } from "@mui/icons-material";
import { Button, IconButton, TextField } from "@mui/material";
import classNames from "classnames";
import { useState } from "react";
import { Link } from "react-router-dom";
import UserAvatar from "./UserAvatar";
import TimeAgo from "./TimeAgo";

const Post = ({
  id,
  fullName = "",
  authorId,
  createdAt,
  content = "",
  image,
  avatarImage,
  likes = [],
  comments = [],
  isLiked = false,
  onLike = () => {},
  onComment = () => {},
}) => {
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);
  const [comment, setComment] = useState("");
  console.log({ comments });
  return (
    <div className="card">
      <div className="mb-3 flex gap-3">
        <Link to={`/users/${authorId}`}>
          <UserAvatar name={fullName} src={avatarImage} />
        </Link>
        <div>
          <Link to={`/users/${authorId}`}>
            <p className="font-bold">{fullName}</p>
          </Link>
          <div className="text-dark-400 text-sm">
            <TimeAgo date={createdAt} />
          </div>
        </div>
      </div>
      <p className="mb-1">{content}</p>
      {image && <img src={image} />}
      <div className="my-2 flex justify-between">
        <div className="flex gap-1 text-sm">
          <ThumbUp fontSize="small" className="text-primary-main" />
          <p>{likes.length}</p>
        </div>

        <div className="text-sm">
          <p>{comments.length} comments</p>
        </div>
      </div>
      <div className="border-dark-300 flex border-t border-b py-1 text-sm">
        <Button
          size="small"
          className={classNames("flex-1", {
            "text-primary-main": isLiked,
            "!text-dark-100": !isLiked,
          })}
          onClick={() => onLike(id)}
        >
          <ThumbUp
            fontSize="small"
            className={classNames("mr-1", { "text-primary-main": isLiked })}
          />{" "}
          Like
        </Button>
        <Button
          size="small"
          className="!text-dark-100 flex-1"
          onClick={() => setIsCommentBoxOpen(!isCommentBoxOpen)}
        >
          <Comment fontSize="small" className="mr-1" /> Comment
        </Button>
      </div>
      {isCommentBoxOpen && (
        <>
          <div className="max-h-48 overflow-y-auto py-2">
            {[...comments].reverse().map((comment) => (
              <div key={comment._id} className="flex gap-2 px-4 py-2">
                <UserAvatar
                  name={comment.author?.fullName}
                  src={comment.author?.image}
                  className="!h-6 !w-6"
                />

                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-bold">{comment.author?.fullName}</p>
                    <p className="text-dark-400 text-xs">
                      <TimeAgo date={comment.createdAt} />
                    </p>
                  </div>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="card flex gap-2">
            <UserAvatar isMyAvatar={true} className="!h-6 !w-6" />
            <TextField
              className="flex-1"
              size="small"
              placeholder="Comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <IconButton
              onClick={() => {
                onComment({ comment, postId: id });
                setComment("");
                // setIsCommentBoxOpen(false);
              }}
              disabled={!comment}
              data-testid="send-comment"
            >
              <Send className="text-primary-main" />
            </IconButton>
          </div>
        </>
      )}
    </div>
  );
};
export default Post;
