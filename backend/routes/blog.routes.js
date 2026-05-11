import express from "express";
import {
  createBlog,
  deleteBlog,
  publishBlog,
  likeBlog,
  getMyBlogs,
  getPublicFeed,
  getSingleBlog,
  fetMyTotallogslikes,
} from "../controllers/blog.controller.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUploads } from "../middleware/multer.js";

const router = express.Router();

router.get("/feed", getPublicFeed);
router.get("/my-blogs", isAuthenticated, getMyBlogs);
router.get("/my-total-likes", isAuthenticated, fetMyTotallogslikes);

router.post("/", isAuthenticated, singleUploads, createBlog);

router.put("/:blogId", isAuthenticated, singleUploads, createBlog);

router.delete("/:blogId", isAuthenticated, deleteBlog);

router.patch("/:blogId/publish", isAuthenticated, publishBlog);

// 🔥 LIKE FIXED
router.patch("/:blogId/like", isAuthenticated, likeBlog);

// SINGLE BLOG
router.get("/:blogId", getSingleBlog);

export default router;