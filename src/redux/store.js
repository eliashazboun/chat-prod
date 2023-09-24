import { configureStore } from '@reduxjs/toolkit'
import notificationsReducer from './notificationSlice'
import usersReducer from './usersSlice'

export default configureStore({
  reducer: {
    notifications:notificationsReducer,
    users:usersReducer
  },
})