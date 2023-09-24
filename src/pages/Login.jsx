/* eslint-disable no-unused-vars */
import UserHolder from "../components/UserHolder";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { usersCache } from "../cache";
import { db } from "../Firebase";
import { useEffect, useState, useContext, createContext, useRef } from "react";
import { CircularProgress } from "@mui/material";
import { initialTime } from "../App";
import {
  addNotifcation,
  clearNotifications,
  setNotifications,
} from "../redux/notificationSlice";
import { setUserState } from "../redux/usersSlice";
import { useSelector, useDispatch } from "react-redux";
import Dev from "../components/Dev";

const Login = () => {
  const initalEntryTime = useContext(initialTime);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const notifications = useSelector((state) => state.notifications);
  const users = useSelector((state) => state.users);

  const autoUsers = users.users.map((item) => {
    return {
      id: item.nameLower,
      display: item.name,
    };
  });


  // Move the fetch users into the App component
  // Save to redux state
  //grab it here then derive the autousers from it
  //

  const handleClick = () => {
    navigate("/create", { state: { from: "/", autoUsers:autoUsers } });
  };

  return (
    <div className="">

      {notifications.notifications?.map((item, idx) => {
        return (
          <p key={idx}>
            {item.name} {item.count}
          </p>
        );
      })}

      <h1 className="text-center ">Select your name!</h1>
      <h1 className="text-center">OR</h1>
      <div className="flex justify-center mb-7 mt-7 h-20">
        <button className="w-full text-2xl" onClick={handleClick}>
          Create New User
        </button>
      </div>
      <div className="flex flex-col gap-6">
        {users.users.length > 0 ? users.users?.map((user, idx) => {
          const key = user?.nameLower + idx.toString();
          return (
            <UserHolder
              key={key}
              autoUsers={autoUsers}
              user={user}
            />
          );
        }): "Create a user!"}
      </div>
    </div>
  );
};

export default Login;
