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

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Blog title and category is required",
      });
    }

    let thumbnail = null;

    // ✅ CLOUDINARY IMAGE UPLOAD
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "blogs",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        streamifier
          .createReadStream(req.file.buffer)
          .pipe(stream);
      });

      // ✅ SAVE CLOUDINARY URL
      thumbnail = result.secure_url;
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



    // ================= UPDATE BLOG =================
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

      // ✅ DELETE OLD CLOUDINARY IMAGE
      if (
        thumbnail &&
        existingBlog.thumbnail &&
        existingBlog.thumbnail.includes("cloudinary")
      ) {
        try {
          const parts = existingBlog.thumbnail.split("/");
          const fileName =
            parts[parts.length - 1].split(".")[0];

          const folderName =
            parts[parts.length - 2];

          const publicId = `${folderName}/${fileName}`;

          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.log("Old image delete failed:", err);
        }
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

    // ================= CREATE BLOG =================
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
      error: error.message,
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
    });
  }
};