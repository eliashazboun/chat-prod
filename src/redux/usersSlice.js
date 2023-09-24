import { createSlice,current } from "@reduxjs/toolkit";
import { sortUsers } from "../utils/utils";
export const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
  },
  reducers: {
    setUserState: (state, {payload}) => {
      return{
        ...state,
        users:payload
      }
    },
    removeUser : (state, {payload}) => {
      return{
        ...state,
        users: state.users.filter((user) => user.nameLower !== payload)
      }
    },
    addUser : (state, {payload}) => {
      return{
        ...state,
        users: sortUsers([...state.users, payload])
      }

    },

    addNotification : (state, {payload}) => {
      console.log('STATE.USERS',current(state))
      return{
        ...state,
        users: state.users.map((user) => {
          if(user.nameLower === payload){
            return{
              ...user,
              notifications: user.notifications + 1
            }
          }
        })
      }
    },

    clearNotifications: (state, {payload}) => {
      return{
        ...state,
        users: state.users.map((user) => {
          if(user.nameLower === payload){
            return{
              ...user,
              notifications:0
            }
          }
        })
      }
    }
    

  }
});

export const {setUserState,removeUser,addUser, addNotification, clearNotifications } = usersSlice.actions;
export default usersSlice.reducer;
