import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ref, uploadBytes } from "firebase/storage";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../Firebase";
import { strip } from "../utils/utils";
import { CircularProgress } from '@mui/material';
import imageCompression from 'browser-image-compression';
import { useDispatch } from "react-redux";
import { addUser } from "../redux/usersSlice";



const Create = () => {
  const fileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const { from, autoUsers } = location.state ? location.state : { from: "/" };

  const [selectedFile, setSelectedFile] = useState();
  const [name, setName] = useState("");
  const [error, setError] = useState({ bool: false, msg: "" });
  const [admin, setAdmin] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleBack = () => {
    navigate(from);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameLower = strip(name).toLowerCase();
    if (/^[a-zA-Z]/.test(nameLower) === false) {
      setError({ bool: true, msg: "Name must only contain letters." });
      return;
    }


    const q = query(
      collection(db, import.meta.env.VITE_USERS),
      where("nameLower", "==", nameLower)
    );
    const found = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      found.push(doc.data());
    });
    if (found.length > 0) {
      setError({ bool: true, msg: "User already created" });
      return;
    }
    setLoading(true)


    const docRef = doc(collection(db, import.meta.env.VITE_USERS));
    const storageRef = ref(storage, `profilePics/${name}`);

    const newUser = {
      name: name,
      admin: admin,
      nameLower: nameLower,
      lastModified:Date.now(),
      notifications:0
    };

    dispatch(addUser(newUser))


    await setDoc(docRef, newUser);

    const compressedImage = await imageCompression(selectedFile,{
      maxSizeMB:1
    })

    uploadBytes(storageRef, compressedImage)
      .then(() => {
        setLoading(false)
        navigate("/success", { state: { user: newUser,autoUsers:autoUsers } });
      })
      .catch(() => {
        setLoading(false)
        alert("Something went wrong. Please contact Elias.");
      });

   
  };

  return (
    <>
    {loading ? <div className="text-center"><CircularProgress size={100}/></div> : <div>
      <h2 className="text-center mb-5">Create new user!</h2>
      <form
        onSubmit={handleSubmit}
        className="create-form grid grid-cols-4 gap-4"
      >
        <div className="col-start-2 col-end-4">
          <label htmlFor="create-new">New Name</label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(false);
            }}
            id="create-new"
          />
          {error.bool ? (
            <p className="text-sm text-red-600">{error.msg}</p>
          ) : (
            ""
          )}
        </div>
        <div className="col-start-2 col-end-4">
          <label htmlFor="create-new-pic">Profile Pic</label>
          <input
            required
            ref={fileRef}
            id="create-new-pic"
            type="file"
            name="image"
            accept="image/*"
            value={undefined}
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
        </div>
        <div className="col-start-2 justify-center">
          <input id="create-admin" type="checkbox"  onChange={() => {setAdmin(prev => !prev);}}/>
          <label htmlFor="create-admin" className="ml-3">
            Admin
          </label>
        </div>
        <p className="text-sm col-start-2 col-end-4 -mt-3">
          (Create as admin for sub-accounts)
        </p>

        <button className="col-start-2 col-end-4">Submit</button>
      </form>
      <div className="grid grid-cols-5 mt-6">
        <h3 className="col-start-2 col-end-6">Not where you need to be?</h3>
        <button
          className="col-start-2 col-end-5 h-10 mt-2"
          onClick={handleBack}
        >
          Go back
        </button>
      </div>
    </div>}
    </>
  );
};

export default Create;
