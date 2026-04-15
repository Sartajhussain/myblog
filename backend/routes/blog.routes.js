import express from "express";

import {
  createBlog,
  deleteBlog,
  updateBlog,
  publishBlog,
  getPublishedBlogs,
  likeBlog,
  fetMyTotallogslikes,
  getMyBlogs,
  getPublicFeed
} from "../controllers/blog.controller.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUploads } from "../middleware/multer.js";
import { getSingleBlog } from "../controllers/blog.controller.js";

const router = express.Router();
router.get("/feed", getPublicFeed);

router.get("/published", getPublishedBlogs);

router.get("/my-blogs", isAuthenticated, getMyBlogs);

router.get("/my-total-likes", isAuthenticated, fetMyTotallogslikes);

router.post("/", isAuthenticated, singleUploads, createBlog);

router.put("/:blogId", isAuthenticated, singleUploads, updateBlog);

router.delete("/:blogId", isAuthenticated, deleteBlog);

router.patch("/:blogId/publish", isAuthenticated, publishBlog);

router.patch("/:blogId/like", isAuthenticated, likeBlog);

router.get("/:blogId", getSingleBlog);

export default router;