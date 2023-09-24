import { createSlice } from "@reduxjs/toolkit";
export const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
  },
  reducers: {
    addNotifcation: (state, { payload }) => {
      const exists = state.notifications.find((item) => item.name === payload.name);
      console.log('PAYLOAD',payload)
      if (exists) {
        console.log("exists");
        return {
          ...state,
          notifications: state.notifications.map((item) => {
            if (item.name === payload.name) {
              return {
                ...item,
                count: item.count + 1,
              };
            } else {
              return item;
            }
          }),
        };
      } else {
        console.log("No exists");
        const newNotif = {
          name: payload.name,
          count: payload.num ? payload.num : 1,
        };
        return {
          ...state,
          notifications: [...state.notifications, newNotif],
        };
      }
    },
    clearNotifications: (state, { payload }) => {
      return {
        ...state,
        notifications: state.notifications.map((item) => {
          if (item.name === payload) {
            return {
              ...item,
              count: 0,
            };
          } else {
            return item;
          }
        }),
      };
    },
    
    setNotifications: (state, {payload}) => {
      const found = state.notifications.find((item) => item.name === payload.name)
      if(found){
        return{
          ...state,
          notifications:state.notifications.map((item) => {
            if(item.name === payload.name){
              return{
                ...item,
                count:payload.num
              }
            }else{
              return item
            }
          })
        }
      }else{

      const newNotif = {
        name: payload.name,
        count: payload.num,
      };
      return{
        ...state,
        notifications: [...state.notifications,newNotif]
      }
    }
  }

  },
 
});

export const { addNotifcation,clearNotifications, setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
