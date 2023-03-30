import { createSlice } from "@reduxjs/toolkit";

const LoggedUserSlice = createSlice({
  name: "users",
  initialState: {
    username: "",
    password: "",
  },
  reducers: {
    login: (state, action) => {
      state.username = action.payload.username;
      state.password = action.payload.password;
    },
  },
});

export const { login } = LoggedUserSlice.actions;

export default LoggedUserSlice.reducer;
