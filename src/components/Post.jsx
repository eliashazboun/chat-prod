/*Firebase Imports */
import { db } from "../Firebase";
import {
  arrayRemove,
  arrayUnion,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  setDoc,
  getDoc,
  orderBy,
} from "firebase/firestore";

/*Tip Tap Imports */
import { generateHTML } from "@tiptap/react";
import { Mention as TipTapMention } from "@tiptap/extension-mention";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

/*Utils */
import { strip } from "../utils/utils";
import parse from "html-react-parser";
import Linkify from "react-linkify";

/*Components */
import TiptapComment from "./TipTapComment";
import Comment from "./Comment";
import UserInfo from "./UserInfo";
import PostButtons from "./PostButtons";

/*React Imports */
import { useEffect, useState } from "react";

/*Style */
import "../css/PostTiptap.css";
import "../css/CommentTiptap.css";

const Post = ({ post, time, user, collectionDB, autoUsers }) => {
  const [reaction, setReaction] = useState({
    liked: false,
    disliked: false,
    heart: false,
  });

  const [postComments, setPostComments] = useState([]);
  const [comment, setComment] = useState("");
  const [editor, setEditor] = useState();

  const timeStamp = new Date(post.time);

  let commentsCollection;

  if (collectionDB === import.meta.env.VITE_POSTS) {
    commentsCollection = import.meta.env.VITE_COMMENTS;
  } else {
    commentsCollection = "otherComments";
  }

  const updateReactions = async () => {
    const docRef = doc(db, collectionDB, post.id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      await updateDoc(docRef, {
        liked: reaction.liked ? arrayUnion(user.name) : arrayRemove(user.name),
        disliked: reaction.disliked ? arrayUnion(user.name) : arrayRemove(user.name),
        heart: reaction.heart ? arrayUnion(user.name) : arrayRemove(user.name),
      });
    }
  };

  const submitComment = async () => {
    if (strip(comment).length < 8) {
      return alert("Please enter comment");
    }

    const docRef = doc(collection(db, commentsCollection));

    try {
      await setDoc(docRef, {
        user: user.name,
        text: comment,
        postId: post.id,
        time: Date.now(),
        liked: [],
      });

      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPostComments((prev) => [...prev, docSnap]);
      }
    } catch (err) {
      console.log(err);
    }

    editor.commands.clearContent(true);
  };

  const fetchComments = async () => {
    const commentHolder = [];

    const q = query(
      collection(db, commentsCollection),
      where("postId", "==", post.id),
      orderBy("time", "asc")
    );

    try {
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        commentHolder.push(doc);
      });
      setPostComments(commentHolder);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setReaction({
      liked: post.liked.includes(user.name),
      disliked: post.disliked.includes(user.name),
      heart: post.heart.includes(user.name),
    });
  }, [user]);

  useEffect(() => {
    updateReactions();
  }, [reaction]);

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div key={post.id}>
      <Linkify
        options={{
          target: "__blank",
          render: {
            url: ({ attributes, content }) => {
              return <a {...attributes}>{content}</a>;
            },
          },
        }}
      >
        <div className="post mb-5 border-b-2 border-r-0 border-l-0 border-t-2 max-w-full border-black border-solid break-words">
          <div
            className="lg:pl-5 lg:pr-5 lg:pb-5 xsm:pl-2 xsm:pr-2 xsm:pb-2 shadow-lg  bg-white"
            key={time}
          >
            <div className="user pt-3 flex justify-evenly">
              <div className="flex justify-start">
               
                {timeStamp.toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "numeric",
                })}
              </div>
              <UserInfo
                name={post.user}
                imgHeight={40}
                imgWidth={40}
                className={"flex flex-col justify-center items-center flex-1"}
              />

              <div className="flex justify-start">
                {timeStamp.toLocaleDateString()}
              </div>
            </div>
            <div className="flex">
              <div className="content flex-1 break-words">
                <h1 className="text-center font-mono text-blue-700 mb-2 break-words max-w-[92vw]">
                  {post.title}
                </h1>
                <div className="text-center max-w-[92vw]">
                  {parse(
                    generateHTML(post.post, [
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
                </div>
              </div>
              <div className="info flex flex-col gap-4 justify-evenly align-center pt-3"></div>
            </div>
            <PostButtons
              time={time}
              reaction={reaction}
              setReaction={setReaction}
              post={post}
            />
          </div>
          <div className="flex flex-1">
            <TiptapComment
              setEditor={setEditor}
              setComment={setComment}
              users={autoUsers}
            />
            <button
              onClick={submitComment}
              className="border-none mb-2.5 flex-2 border-l-0 border-t-2 border-r-2 border-l-1 box-border pr-4 rounded-r-lg bg-yellow-400"
            >
              Submit
            </button>
          </div>

          {postComments &&
            postComments.map((doc, idx) => {
              if (idx % 2 === 0) {
                var style = "bg-slate-100";
              } else {
                style = "bg-slate-200";
              }
              return (
                <Comment
                  doc={doc}
                  key={doc.ref.id}
                  style={style}
                  user={user.name}
                  commentsCollection={commentsCollection}
                />
              );
            })}
        </div>
      </Linkify>
    </div>
  );
};

export default Post;
