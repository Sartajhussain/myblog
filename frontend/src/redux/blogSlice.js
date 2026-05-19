import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  blog: [],
  publicBlogs: [],
  myBlogs: [],
};

const blogSlice = createSlice({
  name: "blog",
  initialState,

  reducers: {
    // ALL BLOGS
    setBlog: (state, action) => {
      state.blog = action.payload;
    },

    // PUBLIC BLOGS
    setPublicBlogs: (state, action) => {
      state.publicBlogs = action.payload;
    },

    // MY BLOGS
    setMyBlogs: (state, action) => {
      state.myBlogs = action.payload;
    },
  },
});

export const {
  setBlog,
  setPublicBlogs,
  setMyBlogs,
} = blogSlice.actions;

export default blogSlice.reducer;