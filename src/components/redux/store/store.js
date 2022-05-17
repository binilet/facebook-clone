import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../slices/userSlice';
import postsReducer from '../slices/postSlice';
import subscriptionReducer from '../slices/subscriptionSlice';

export const store = configureStore({
  reducer:{
    _current_user:userReducer,
    _posts:postsReducer,
    _subscriptions:subscriptionReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})