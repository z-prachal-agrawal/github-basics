import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/LoggedUserSlice";
import postReducer from "./slices/PostSlice";
import authReducer from "./slices/AuthSlice";
const store = configureStore({
  reducer: {
    users: userReducer,
    post: postReducer,
    auth: authReducer,
  },
});

export default store;
