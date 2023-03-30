import { createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
  name: "post",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    fetchPostsStart: (state) => {
      state.isLoading = true;
    },
    fetchPostsSuccess: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchPostsFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    appendPost: (state, action) => {
      state.data.push(action.payload);
    },
  },
});

export const {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  appendPost,
} = postSlice.actions;

export default postSlice.reducer;
