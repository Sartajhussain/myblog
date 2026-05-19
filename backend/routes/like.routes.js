import express from "express";
import { likeComment } from "../controllers/commentController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.patch(
  "/comment/:commentId/like",
  isAuthenticated,
  likeComment
);

export default router;