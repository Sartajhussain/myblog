import { Blog } from "../models/blog.model.js";
import cloudinary from "../utils/cloudinary.js";
import { getDataUri } from "../utils/dataUri.js";
import mongoose from "mongoose";


// ================= CREATE BLOG =================
export const createBlog = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Blog title and category is required",
      });
    }

    const blog = await Blog.create({
      title,
      category,
      author: req.user.id,
      likes: [],
      isPublished: false,
    });

    return res.status(201).json({
      success: true,
      message: "Blog Created Successfully",
      blog,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create blog",
    });
  }
};


// ================= GET MY BLOGS =================
export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id })
      .populate("author", "firstName lastName profilePic")
      .sort({ createdAt: -1 });

    res.json({ success: true, blogs });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};


// ================= PUBLIC FEED =================
export const getPublicFeed = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .populate("author", "firstName lastName profilePic")
      .sort({ createdAt: -1 });

    res.json({ success: true, blogs });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};


// ================= SINGLE BLOG =================
export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId)
      .populate("author", "firstName lastName profilePic");

    if (!blog) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true, blog });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};


// ================= DELETE BLOG =================
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({
      _id: req.params.blogId,
      author: req.user.id,
    });

    if (!blog) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};


// ================= PUBLISH BLOG =================
export const publishBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);

    if (!blog) {
      return res.status(404).json({ success: false });
    }

    blog.isPublished = !blog.isPublished;
    await blog.save();

    res.json({ success: true, blog });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};


// ================= LIKE BLOG (🔥 FIXED) =================
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);

    if (!blog) {
      return res.status(404).json({ success: false });
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
    res.status(500).json({ success: false });
  }
};


// ================= TOTAL LIKES =================
export const fetMyTotallogslikes = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id });

    const totalLikes = blogs.reduce(
      (acc, b) => acc + b.likes.length,
      0
    );

    res.json({ success: true, totalLikes });

  } catch (err) {
    res.status(500).json({ success: false });
  }
};