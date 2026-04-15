import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  blog: [],
  allBlogs: [],
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload ?? false;
    },

    setBlog: (state, action) => {
      state.blog = Array.isArray(action.payload) ? action.payload : [];
    },

    setAllBlogs: (state, action) => {
      state.allBlogs = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const { setLoading, setBlog, setAllBlogs } = blogSlice.actions;
export default blogSlice.reducer;