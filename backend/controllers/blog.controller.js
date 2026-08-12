import { Blog } from "../models/blog.model.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
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
    const { blogId } = req.params;

    if (blogId && !mongoose.isValidObjectId(blogId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog id",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Blog title is required",
      });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Blog category is required",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Blog description is required",
      });
    }

    let thumbnail = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blogs" },
          (error, uploaded) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(uploaded);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      thumbnail = result.secure_url;
    }

    const blogData = {
      title: title.trim(),
      category: category.trim(),
      subtitle: subtitle ? subtitle.trim() : "",
      description: description.trim(),
      author: req.user.id,
    };

    if (thumbnail) {
      blogData.thumbnail = thumbnail;
    }

    if (blogId) {
      const existingBlog = await Blog.findById(blogId);

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

      if (!thumbnail && existingBlog.thumbnail) {
        blogData.thumbnail = existingBlog.thumbnail;
      }

      if (
        thumbnail &&
        existingBlog.thumbnail &&
        existingBlog.thumbnail.includes("cloudinary")
      ) {
        try {
          const parts = existingBlog.thumbnail.split("/");
          const fileName = parts[parts.length - 1].split(".")[0];
          const folderName = parts[parts.length - 2];
          const publicId = `${folderName}/${fileName}`;
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.log("Old image delete failed:", err);
        }
      }

      const blog = await Blog.findByIdAndUpdate(blogId, blogData, {
        new: true,
      });

      return res.status(200).json({
        success: true,
        message: "Blog Updated Successfully",
        blog,
      });
    }

    const blog = await Blog.create({
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
    console.error("BLOG ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create/update blog",
    });
  }
};

/* ================= GET MY BLOGS ================= */
export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id })
      .populate("author", "firstName lastName profilePic")
      .sort({ createdAt: -1 })
      .lean();

    const enrichedBlogs = blogs.map((blog) => ({
      ...blog,
      commentCount: blog.comments?.length || 0,
    }));

    res.json({
      success: true,
      blogs: enrichedBlogs,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message // FIXED: Added error message
    });
  }
};

/* ================= PUBLIC FEED ================= */
export const getPublicFeed = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .populate("author", "firstName lastName profilePic")
      .sort({ createdAt: -1 })
      .lean();

    const enrichedBlogs = blogs.map((blog) => ({
      ...blog,
      commentCount: blog.comments?.length || 0,
    }));

    res.json({
      success: true,
      blogs: enrichedBlogs,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message // FIXED: Added error message
    });
  }
};

/* ================= SINGLE BLOG ================= */
export const getSingleBlog = async (req, res) => {
  try {

    const blog = await Blog.findById(req.params.blogId)
      .populate("author", "firstName lastName profilePic")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "firstName lastName profilePic",
        },
      });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found" // FIXED: Added message
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message // FIXED: Added error message
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
        message: "Blog not found" // FIXED: Added message
      });
    }

    res.json({
      success: true,
      message: "Blog deleted successfully" // FIXED: Added message
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message // FIXED: Added error message
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
        message: "Blog not found" // FIXED: Added message
      });
    }

    blog.isPublished = !blog.isPublished;

    await blog.save();

    res.json({
      success: true,
      message: blog.isPublished ? "Blog published" : "Blog unpublished", // FIXED: Added message
      blog,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message // FIXED: Added error message
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
        message: "Blog not found",
      });
    }

    const userId = req.user.id;

    const alreadyLiked = blog.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {

      blog.likes = blog.likes.filter(
        (id) => id.toString() !== userId
      );

    } else {

      blog.likes.push(userId);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      totalLikes: blog.likes.length,
      liked: !alreadyLiked,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to like blog",
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
      message: err.message // FIXED: Added error message
    });
  }
};