import { Blog } from "../models/blog.model.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= CREATE / UPDATE BLOG ================= */
export const createBlog = async (req, res) => {
  try {
    const { title, category, subtitle, description } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Blog title and category is required",
      });
    }

    let thumbnail = null;

    // ✅ IMAGE UPLOAD FIXED
    if (req.file) {
      const uploadDir = path.join(__dirname, "..", "uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${req.file.originalname}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, req.file.buffer);

      // ✅ SAVE ONLY RELATIVE PATH
      thumbnail = `uploads/${fileName}`;
    }

    const blogData = {
      title,
      category,
      subtitle,
      description,
      author: req.user.id,
    };

    // ✅ ONLY IF IMAGE EXISTS
    if (thumbnail) {
      blogData.thumbnail = thumbnail;
    }

    let blog;

    // ================= UPDATE =================
    if (req.params.blogId) {
      const existingBlog = await Blog.findById(req.params.blogId);

      if (!existingBlog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      if (existingBlog.author.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }

      blog = await Blog.findByIdAndUpdate(
        req.params.blogId,
        blogData,
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Blog Updated Successfully",
        blog,
      });
    }

    // ================= CREATE =================
    blog = await Blog.create({
      ...blogData,
      likes: [],
      isPublished: false,
    });

    return res.status(201).json({
      success: true,
      message: "Blog Created Successfully",
      blog,
    });

  } catch (error) {
    console.log("BLOG ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create/update blog",
    });
  }
};

/* ================= GET MY BLOGS ================= */
export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id })
      .populate("author", "firstName lastName profilePic")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      blogs,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
    });
  }
};

/* ================= PUBLIC FEED ================= */
export const getPublicFeed = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .populate("author", "firstName lastName profilePic")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      blogs,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
    });
  }
};

/* ================= SINGLE BLOG ================= */
export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId)
      .populate("author", "firstName lastName profilePic");

    if (!blog) {
      return res.status(404).json({
        success: false,
      });
    }

    res.json({
      success: true,
      blog,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
    });
  }
};

/* ================= DELETE BLOG ================= */
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({
      _id: req.params.blogId,
      author: req.user.id,
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
      });
    }

    res.json({
      success: true,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
    });
  }
};

/* ================= PUBLISH BLOG ================= */
export const publishBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
      });
    }

    blog.isPublished = !blog.isPublished;

    await blog.save();

    res.json({
      success: true,
      blog,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
    });
  }
};

/* ================= LIKE BLOG ================= */
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
      });
    }

    const userId = req.user.id;

    const alreadyLiked = blog.likes.includes(userId);

    if (alreadyLiked) {
      blog.likes.pull(userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    res.json({
      success: true,
      likes: blog.likes.length,
      liked: !alreadyLiked,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
    });
  }
};

/* ================= TOTAL LIKES ================= */
export const fetMyTotallogslikes = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id });

    const totalLikes = blogs.reduce(
      (acc, b) => acc + b.likes.length,
      0
    );

    res.json({
      success: true,
      totalLikes,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
    });
  }
};