import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import NoMatch from "./pages/NoMatch";
import Create from "./pages/Create";
import UserCreated from "./pages/UserCreated";
import ChatroomSelection from "./pages/ChatroomSelection";
import { createContext, useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./Firebase";
import { useDispatch } from "react-redux";
import { setUserState } from "./redux/usersSlice";
import { sortUsers } from "./utils/utils";


export const initialTime = createContext();

function App() {
  const [initialLoadTime, setInitialLoadTime] = useState();

  const dispatch = useDispatch()


  useEffect(() => {
    setInitialLoadTime(Date.now());
    const unsubscribe = onSnapshot(
      collection(db,'users'),
      (snapshot) =>{
        const usersHolder = [];
        snapshot.docs.forEach((doc) => {
          usersHolder.push(doc.data())
        })
        const sorted = sortUsers(usersHolder)
        console.log(sorted)
        dispatch(setUserState(sorted))
      })
    return () => {
      unsubscribe()
    }
      
  }, []);
  return (
    <initialTime.Provider value={initialLoadTime}>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<Login />} />
          <Route path="/selection" element={<ChatroomSelection />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/create" element={<Create />} />
          <Route path="/success" element={<UserCreated />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
      <Analytics />
    </initialTime.Provider>
  );
}

export default App;
