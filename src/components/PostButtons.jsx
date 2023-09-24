import { ReactComponent as Like } from "../assets/like.svg";
import { ReactComponent as Heart } from "../assets/heart.svg";
import { ReactComponent as Dislike } from "../assets/dislike.svg";

const PostButtons = ({ time, reaction, setReaction, post }) => {
  return (
    <div
      className="grid grid-cols-3 justify-center items-start  pt-20"
      key={time}
    >
      <div className="col-start-1 text-center ">
        <Like
          key={parseInt(time)}
          className="cursor-pointer"
          fill={reaction.liked ? "#4caf50" : "none"}
          onClick={() => {
            setReaction((prev) => ({
              liked: !prev.liked,
              disliked: false,
              heart: false,
            }));
          }}
        />
        <div className="text-[#4caf50] font-bold">{post.liked.length > 0 ? post.liked.length : ""}</div>

        {post.liked?.map((user) => {
          return (
            <p className="text-center text-sm text-[#4caf50]" key={user}>
              {user}
            </p>
          );
        })}
      </div>

      <div className="col-start-2 text-center relative ">
        <Heart
          key={parseInt(time) + 1}
          className="cursor-pointer"
          fill={reaction.heart ? "#ff0000" : "none"}
          onClick={() => {
            setReaction((prev) => ({
              liked: false,
              disliked: false,
              heart: !prev.heart,
            }));
          }}
        />
        <div className="text-[#ff0000] font-bold">{post.heart.length > 0 ? post.heart.length : ""}</div>

        {post.heart.map((user) => {
          return (
            <p className="text-center text-sm text-[#ff0000]" key={user}>
              {user}
            </p>
          );
        })}
      </div>
      <div className="col-start-3 text-center relative">
        <Dislike
          key={parseInt(time) + 2}
          className="cursor-pointer relative"
          fill={reaction.disliked ? "#FFA500" : "none"}
          onClick={() => {
            setReaction((prev) => ({
              liked: false,
              disliked: !prev.disliked,
              heart: false,
            }));
          }}
        />

        <div className="text-[#FFA500] font-bold">{post.disliked.length > 0 ? post.disliked.length : ""}</div>

        {post.disliked.map((user) => {
          return (
            <p className="text-center text-sm text-[#FFA500]" key={user}>
              {user}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default PostButtons;
