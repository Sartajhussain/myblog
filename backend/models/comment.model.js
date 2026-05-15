// models/comment.model.js

import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    // ✅ BLOG ID
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },

    // ✅ COMMENT USER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ COMMENT TEXT
    text: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ COMMENT LIKES
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ✅ OPTIONAL REPLIES SUPPORT
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;