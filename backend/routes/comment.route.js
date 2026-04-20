// routes/comment.route.js

import express from "express";
import {
  addComment,
  likeComment,
  addReply,
  getComments,
  deleteComment,
  updateComment,
  getAllComments
} from "../controllers/comment.controller.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

// ================= COMMENTS =================
router.post("/:id/add-comment", isAuthenticated, addComment);

// 🔥 IMPORTANT (Dashboard use karega)
router.get("/all", isAuthenticated, getAllComments);

// Blog specific
router.get("/blog/:blogId", getComments);

// Update / Delete
router.put("/:commentId", isAuthenticated, updateComment);
router.delete("/:commentId", isAuthenticated, deleteComment);

// Extra
router.post("/reply", addReply);
router.post("/like/:commentId", likeComment);

export default router;