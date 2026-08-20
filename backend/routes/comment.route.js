import express from "express";

import {
  addComment,
  likeComment,
  addReply,
  getComments,
  deleteComment,
  updateComment,
  getAllComments,
  getCommentsForMyBlogs,
} from "../controllers/comment.controller.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

// ✅ ADD COMMENT
router.post("/:blogId/add-comment", isAuthenticated, addComment);

// ✅ GET BLOG COMMENTS
router.get("/blog/:blogId", getComments);

// ✅ ALL COMMENTS
router.get("/all", isAuthenticated, getAllComments);

// ✅ COMMENTS FOR CURRENT USER'S BLOGS
router.get("/my-blogs", isAuthenticated, getCommentsForMyBlogs);

// 🛠️ FIX: ADDED MISSING `/my-comments` ROUTE
router.get("/my-comments", isAuthenticated, getCommentsForMyBlogs);

// ✅ UPDATE
router.put("/:commentId", isAuthenticated, updateComment);

// ✅ DELETE
router.delete("/:commentId", isAuthenticated, deleteComment);

// ✅ LIKE
router.post("/like/:commentId", isAuthenticated, likeComment);

// ✅ REPLY
router.post("/reply", isAuthenticated, addReply);

export default router;