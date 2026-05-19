// src/redux/commentSlice.js

import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "comment",

  initialState: {
    comments: [],
  },

  reducers: {
    setComments: (state, action) => {
      state.comments = action.payload;
    },

    // ✅ UPDATE COMMENT LIKE
    updateCommentLike: (state, action) => {
      const { commentId, likes } = action.payload;

      state.comments = state.comments.map((comment) =>
        comment._id === commentId
          ? {
              ...comment,
              likes,
            }
          : comment
      );
    },
  },
});

export const {
  setComments,
  updateCommentLike,
} = commentSlice.actions;

export default commentSlice.reducer;