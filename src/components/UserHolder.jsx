import { useNavigate } from "react-router-dom";
import UserInfo from "./UserInfo";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";


import { useState } from "react";
import { db } from "../Firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { strip } from "../utils/utils";
import { imageCache } from "../cache";
import { useDispatch } from "react-redux";
import { removeUser } from "../redux/usersSlice";

const UserHolder = ({ user, autoUsers}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const users = useSelector((state) => state.users);
  const foundUser = users.users.find((item) => item.nameLower === strip(user.name).toLowerCase())
  
  const dispatch = useDispatch()
  let notificationCount = foundUser.notifications || 0


  const handleClick = () => {
    if (user.admin) {
      navigate("/selection", {
        state: { user: user, admin: user.admin, autoUsers: autoUsers },
      });
    } else {
      navigate("/main", {
        state: {
          user: user,
          collectionDB: "otherPosts",
          autoUsers: autoUsers,
        },
      });
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    const q = query(
      collection(db, import.meta.env.VITE_USERS),
      where("nameLower", "==", strip(user.name).toLowerCase())
    );
    const snapshot = await getDocs(q);
    snapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    
    await imageCache.remove(user.name);
    dispatch(removeUser(strip(user.name).toLowerCase()))

    setOpen(false);
  };

  return (
    <div className="">
      <div
        className={`${
          user.admin ? "admin-user " : "main-user "
        } flex pr-2 text-center relative border-solid border-t-8`}
      >
        <button
          className="w-full bg-inherit border-none  h-fit"
          onClick={handleClick}
        >
          <UserInfo name={user.name} key={user.name} notificationCount={notificationCount} />
        </button>
        <CloseIcon
          onClick={handleClickOpen}
          className="absolute rounded-lg border-x-2 top-0 right-0 border-solid"
        />

      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Deleting User Account"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="" id="alert-dialog-description">
            <div className="flex justify-center items-center">
              <UserInfo
                className={"flex flex-col justify-center items-center"}
                name={user.name}
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            DELETE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserHolder;
