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
  getUserBlogs,
  getUserBlogsWithComments, // ✅ NEW IMPORT
} from "../controllers/blog.controller.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUploads } from "../middleware/multer.js";

const router = express.Router();

/* ================= PUBLIC ROUTES ================= */

/*
  Get all published blogs
*/
router.get("/feed", getPublicFeed);


/* =====================================================
   USER BLOG ROUTES
   ⚠️ ORDER MATTERS:
   More specific route (/with-comments) MUST come
   BEFORE the generic route (:userId)
===================================================== */

/*
  ✅ NEW - Get user blogs + comments in ONE call
  GET /api/v1/blog/user/:userId/with-comments
*/
router.get(
  "/user/:userId/with-comments",
  getUserBlogsWithComments
);

/*
  Get only blogs of a specific user
  GET /api/v1/blog/user/:userId
*/
router.get("/user/:userId", getUserBlogs);


/* ================= PROTECTED ROUTES ================= */

/*
  Get logged-in user's blogs
*/
router.get("/my-blogs", isAuthenticated, getMyBlogs);


/*
  Get total likes of logged-in user's blogs
*/
router.get(
  "/my-total-likes",
  isAuthenticated,
  fetMyTotallogslikes
);


/*
  Create blog
*/
router.post(
  "/",
  isAuthenticated,
  singleUploads,
  createBlog
);


/*
  Update blog
*/
router.put(
  "/:blogId",
  isAuthenticated,
  singleUploads,
  createBlog
);


/*
  Delete blog
*/
router.delete(
  "/:blogId",
  isAuthenticated,
  deleteBlog
);


/*
  Publish / Unpublish blog
*/
router.patch(
  "/:blogId/publish",
  isAuthenticated,
  publishBlog
);


/*
  Like / Unlike blog
*/
router.patch(
  "/:blogId/like",
  isAuthenticated,
  likeBlog
);


/* ================= SINGLE BLOG ROUTE LAST ================= */

/*
  IMPORTANT:
  Keep this route LAST because :blogId
  can match almost anything.
*/
router.get("/:blogId", getSingleBlog);


export default router;