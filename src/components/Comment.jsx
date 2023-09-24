import { useState } from "react";
import { ReactComponent as Heart } from "../assets/heart.svg";
import { setDoc, arrayUnion, arrayRemove } from "firebase/firestore";
/*Tip Tap Imports */
import { generateHTML } from "@tiptap/react";
import { Mention as TipTapMention } from "@tiptap/extension-mention";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

/*Utils */
import parse from "html-react-parser";

const Comment = ({ doc, style, user }) => {
  const comment = doc.data();
  const [liked, setLiked] = useState(comment.liked?.includes(user));
  const [likedBy, setLikedBy] = useState(comment.liked || []);
  const [likeCount, setLikeCount] = useState(comment.liked?.length);

  const date = new Date(comment.time);
  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "numeric",
  });

  const handleCommentLike = async () => {
    console.log("FIRED");
    if (liked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    if (!liked) {
      setLikedBy((prev) => [...prev, user]);
    } else {
      const filtered = likedBy.filter((item) => item !== user);
      setLikedBy(filtered);
    }
    await setDoc(
      doc.ref,
      {
        liked: !liked ? arrayUnion(user) : arrayRemove(user),
      },
      { merge: true }
    );
    setLiked(!liked);
  };

  return (
    <>
      <div className={`${style} p-2 flex flex-wrap`}>
        <span className="text-xs">{date.toLocaleDateString()} </span>

        <div className="comment flex-1 text-center2 flex flex-col">
          <p className="text-center font-bold">{comment.user}</p>

          <div className="text-center mt-2 break-words">
            {parse(
              generateHTML(comment.text, [
                StarterKit.configure({
                  bulletList: {
                    HTMLAttributes: {
                      class: `list-inside post-list`,
                    },
                  },
                  listItem: {
                    HTMLAttributes: {
                      class: "post-list-item",
                    },
                  },
                }),
                Underline,
                TipTapMention.configure({
                  HTMLAttributes: {
                    class: "mention",
                  },
                }),
              ])
            )}

            <div className="flex gap-2"></div>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs">{time}</span>
          <div className="relative cursor-pointer">
            <Heart
              fill={liked ? "#ff0000" : "none"}
              onClick={handleCommentLike}
            />
            <div

              onClick={handleCommentLike}
              className={`absolute top-[30%] right-[43%] text-xs font-bold cursor-pointer ${
                liked ? "text-white" : "text-[#ff0000]"
              }`}
            >
              {likeCount === 0 ? "" : likeCount}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-1 font-bold font-mono bg-red-100 p-1 flex-grow  text-red-500  flex-wrap ">
        {likedBy?.map((item, idx) => {
          return (
            <p
              className="text-sm border-solid rounded-xl p-1 border-[1px] flex-grow text-center"
              key={idx}
            >
              {item}{" "}
            </p>
          );
        })}
      </div>
    </>
  );
};

export default Comment;
