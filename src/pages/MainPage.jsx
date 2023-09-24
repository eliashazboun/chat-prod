/* eslint-disable no-unused-vars */
/*Firebase Imports */
import {
  onSnapshot,
  collection,
  orderBy,
  query,
  setDoc,
  doc,
  where,
  getDocs,
  updateDoc,
  increment,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../Firebase";

/*Mui Imports */
import { BottomNavigation, SwipeableDrawer } from "@mui/material";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
/*Mui List */
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

/*Components */
import Post from "../components/Post";
import Tiptap from "../components/TipTap";
import Dev from "../components/Dev";

/*Utils */
import { strip } from "../utils/utils";
import { imageCache } from "../cache";
import imageCompression from "browser-image-compression";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  clearNotifications,
  setNotifications,
} from "../redux/notificationSlice";
import { addNotification } from "../redux/usersSlice";

/*React Imports */
import { useEffect, useRef, useState } from "react";

import "../App.css";
import { useDispatch } from "react-redux";

const MainPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editProfilePicRef = useRef(null);
  const postTextAreaRef = useRef(null);

  const { user, collectionDB, autoUsers, admin } = location.state;
  console.log("🚀 ~ file: MainPage.jsx:57 ~ MainPage ~ user, collectionDB:", user, collectionDB)
  const dispatch = useDispatch();

  const [posts, setPosts] = useState([]);

  /*States */
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [editor, setEditor] = useState("");

  const [imageUrl, setImageUrl] = useState(null);
  const [picOpen, setPicOpen] = useState(false);
  const [error, setError] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const uploadProfilePic = async (e) => {
    e.preventDefault();
    const storageRef = ref(storage, `profilePics/${user.name}`);

    const compressedImage = await imageCompression(selectedFile, {
      maxSizeMB: 1,
    });

    imageCache.remove(user.name);

    uploadBytes(storageRef, compressedImage).then(() => {
      editProfilePicRef.current.value = null;
      alert("Uploaded!");
      setPicOpen(false);
    });
  };

  const getPicture = async () => {
    setPicOpen(true);
    const pic = await imageCache.get(user.name);
    if (pic) {
      setImageUrl(pic);
      console.log("CACHE");
    } else {
      const pathReference = ref(storage, `profilePics/${user.name}`);

      getDownloadURL(pathReference)
        .then((url) => {
          setImageUrl(url);
        })
        .catch(() => {
          setError(true);
        });
    }
  };

  const handleListClick = async (name) => {
    let user;
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("nameLower", "==", strip(name).toLowerCase()));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
       user = doc.data();
    });

    console.log(user)
    navigate("/main", {
      state: {
        collectionDB: user.admin ? "posts" : "otherPosts",
        user: user,
        autoUsers: autoUsers,
      },
    });
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    addNotifications()

    const docRef = doc(collection(db, collectionDB));
    const backupDocRef = doc(collection(db, "postsBackup"));

    if (strip(description).length < 8) {
      return alert("Enter content");
    }
    if (strip(title).length === 0) {
      return alert("Enter a title.");
    }

    try {
      await setDoc(docRef, {
        id: docRef.id,
        title: title,
        post: description,
        time: Date.now(),
        user: user.name,
        liked: [],
        disliked: [],
        heart: [],
      });

      await setDoc(backupDocRef, {
        id: docRef.id,
        title: title,
        post: description,
        time: Date.now(),
        user: user.name,
        liked: [],
        disliked: [],
        heart: [],
      });

      setTitle("");
      editor.commands.clearContent(true);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log(autoUsers);
    const postsRef = collection(db, collectionDB);

    const unsubscribe = onSnapshot(
      query(postsRef, orderBy("time", "desc")),
      (snapshot) => {
        setPosts(snapshot.docs.map((item) => item.data()));
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    const clearNoti = async () => {
      const nameLower = user.nameLower;
      const q = query(
        collection(db, "users"),
        where("nameLower", "==", nameLower)
      );
      const snapshot = await getDocs(q);
      snapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, {
          notifications: 0,
        });
      });
    };
    clearNoti()
  }, []);

  const deepSearch = (item) => {
    const results = []
    let found = false
    const iterate = (item) => {
      const keys = Object.keys(item)
      keys.forEach((key) => {
        if(item[key] === 'mention'){
          return found=true
        }
        if(found && key === 'id'){
          found = false
          return results.push(item[key])

        }
        if (typeof item[key] === 'object' && item[key]) {
          console.log('HIT THE IF CNDITION')
          return iterate(item[key])
        }
      })
    }
    iterate(item)
    return results
  }

 

  const addNotifications =  async () => {

    var mentions = deepSearch(description);
    console.log('MENTIONS',mentions)

    const q = query(
      collection(db, "users"),
      where("nameLower", "in", mentions)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, {
        notifications: increment(1),
        lastModified: Date.now(),
      });
    });

    mentions.forEach((item) => dispatch(addNotification(item)));

  };

  return (
    <div className="app bg-slate-50" key={user.name}>
      {collectionDB === "testPosts" ? <Dev /> : ""}
      <Link to={"/"} className="relative">
        <p className="text-center text-xs">(Tap me to go back)</p>

        <h3 className="text-center">
          Logged in as -<span className="text-red-600">{user.name}</span>
        </h3>
      </Link>

      <form onSubmit={uploadProfilePic} className="grid grid-cols-4 pt-5 gap-2">
        <input
          className="col-start-2 col-end-4 custom-file-input"
          required
          ref={editProfilePicRef}
          type="file"
          id="file-upload"
          name="image"
          accept="image/*"
          value={undefined}
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <button className="col-start-2 col-end-4 h-10">Submit</button>
      </form>
      <div className="grid grid-cols-4 mt-5">
        {picOpen ? (
          <button
            className="col-start-2 col-end-4 h-10"
            onClick={() => setPicOpen(false)}
          >
            Close pic
          </button>
        ) : (
          <button className="col-start-2 col-end-4 h-10" onClick={getPicture}>
            Current Profile Picture
          </button>
        )}
        {picOpen && imageUrl && (
          <img
            src={imageUrl}
            width={"100%"}
            className="object-cover col-start-2 col-end-4"
            alt="profile_pic"
            id="profile-pic"
          />
        )}
        {error && (
          <p className="text-center text-sm text-red-600 col-start-2 col-end-4">
            No image found.
          </p>
        )}
      </div>

      <div className="wrap lg:w-9/12 m-auto xsm:p-3">
        <form className="flex flex-col gap-2 mt-10" onSubmit={handleSubmit}>
          <Tiptap
            ref={postTextAreaRef}
            setDescription={setDescription}
            setEditor={setEditor}
            setTitle={setTitle}
            title={title}
            users={autoUsers}
          />
          <div className="w-full text-center">
            <button type="submit" className="h-8 mb-4 w-80">
              Post
            </button>
          </div>
        </form>

        <h2 className="text-center mt-3">Welcome to our chat board</h2>

        <div className="postholder flex flex-col">
          {posts.length > 0 ? posts.map((post) => {
            return (
              <Post
                post={post}
                time={post.time}
                key={post.time}
                user={user}
                collectionDB={collectionDB}
                autoUsers={autoUsers}
              />
            );
          }): "No posts yet!"}
        </div>
      </div>
      <BottomNavigation
        showLabels
        className="fixed bottom-0 w-full"
        sx={{
          height: "50px",
          backgroundColor: "greenyellow",
          display: "flex",
          alignItems: "center",
        }}
      >
        <BottomNavigationAction
          onClick={() => navigate("/")}
          icon={<ArrowBackIcon />}
        />
        <BottomNavigationAction
          onClick={() => setOpenDrawer(true)}
          label={
            <p className="text-xs font-bold bg-blue-600 text-white border-solid border-2 rounded-lg p-2">
              Switch User
            </p>
          }
        />
        <BottomNavigationAction
          label={<p className="text-sm font-bold text-blue-600">{user.name}</p>}
        />
      </BottomNavigation>
      <SwipeableDrawer
        ModalProps={{ onClick: () => setOpenDrawer(false) }}
        anchor="bottom"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        className="fuck"
      >
        <List
          sx={{
            width: "60%",
            backgroundColor: "white",
            margin: "10% auto 0",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
          disablePadding
        >
          {autoUsers
            .sort((a, b) => (a.display < b.display ? 1 : -1))
            .map((item) => (
              <>
                <ListItem
                  className=""
                  onClick={() => handleListClick(item.display)}
                  disablePadding
                  key={item.display}
                >
                  <ListItemText className="">
                    <p className="ml-5">{item.display}</p>
                  </ListItemText>
                </ListItem>
                <Divider />
              </>
            ))}
        </List>
      </SwipeableDrawer>
    </div>
  );
};

export default MainPage;
