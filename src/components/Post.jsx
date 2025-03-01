import { Comment, ThumbUp } from "@mui/icons-material";
import { Avatar, Button } from "@mui/material";
import classNames from "classnames";
import dayjs from "dayjs";

const Post = ({
  id,
  fullName = "",
  createdAt,
  content = "",
  image,
  likes = [],
  comments = [],
  isLiked = false,
  onLike = () => {},
}) => {
  return (
    <div className="card">
      <div className="mb-3 flex gap-3">
        <Avatar className="!bg-primary-main">
          {fullName?.[0]?.toUpperCase()}
        </Avatar>
        <div>
          <p className="font-bold">{fullName}</p>
          <p className="text-dark-400 text-sm">
            {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
          </p>
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
          />
          Like
        </Button>
        <Button size="small" className="!text-dark-100 flex-1">
          <Comment fontSize="small" className="mr-1" /> Comment
        </Button>
      </div>
    </div>
  );
};
export default Post;
