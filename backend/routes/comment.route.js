import express from "express";
import { addComment, likeComment, addReply, getComments, deleteComment, updateComment } 
from "../controllers/comment.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/:id/add-comment",isAuthenticated, addComment);
router.put("/:commentId",isAuthenticated, updateComment);
router.delete("/:commentId",isAuthenticated, deleteComment);
router.post("/reply", addReply);
router.post("/like/:commentId", likeComment);
router.get("/blog/:blogId", getComments);

export default router;