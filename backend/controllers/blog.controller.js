import { Blog } from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import mongoose from "mongoose";


/* =====================================================
   CREATE / UPDATE BLOG
===================================================== */

export const createBlog = async (req, res) => {
  try {
    const {
      title,
      category,
      subtitle,
      description,
    } = req.body;

    const { blogId } = req.params;

    /* ================= BLOG ID VALIDATION ================= */

    if (
      blogId &&
      !mongoose.isValidObjectId(blogId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog id",
      });
    }


    /* ================= TITLE VALIDATION ================= */

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Blog title is required",
      });
    }


    /* ================= CATEGORY VALIDATION ================= */

    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Blog category is required",
      });
    }


    let thumbnail = null;


    /* ================= CLOUDINARY UPLOAD ================= */

    if (req.file) {
      const result = await new Promise(
        (resolve, reject) => {

          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder: "blogs",
              },
              (error, uploaded) => {

                if (error) {
                  reject(error);
                  return;
                }

                resolve(uploaded);
              }
            );


          streamifier
            .createReadStream(req.file.buffer)
            .pipe(stream);
        }
      );

      thumbnail = result.secure_url;
    }


    /* ================= BLOG DATA ================= */

    const blogData = {
      title: title.trim(),

      category: category.trim(),

      subtitle: subtitle
        ? subtitle.trim()
        : "",

      description: description
        ? description.trim()
        : "",

      author: req.user.id,
    };


    /* ================= THUMBNAIL ================= */

    if (thumbnail) {
      blogData.thumbnail = thumbnail;
    }


    /* =====================================================
       UPDATE EXISTING BLOG
    ===================================================== */

    if (blogId) {

      const existingBlog =
        await Blog.findById(blogId);


      if (!existingBlog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }


      /* ================= AUTHORIZATION ================= */

      if (
        existingBlog.author.toString() !==
        req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }


      /* ================= KEEP OLD IMAGE ================= */

      if (
        !thumbnail &&
        existingBlog.thumbnail
      ) {
        blogData.thumbnail =
          existingBlog.thumbnail;
      }


      /* ================= DELETE OLD CLOUDINARY IMAGE ================= */

      if (
        thumbnail &&
        existingBlog.thumbnail &&
        existingBlog.thumbnail.includes(
          "cloudinary"
        )
      ) {

        try {

          const parts =
            existingBlog.thumbnail.split("/");


          const fileName =
            parts[parts.length - 1]
              .split(".")[0];


          const folderName =
            parts[parts.length - 2];


          const publicId =
            `${folderName}/${fileName}`;


          await cloudinary.uploader.destroy(
            publicId
          );

        } catch (err) {

          console.log(
            "Old image delete failed:",
            err
          );
        }
      }


      /* ================= UPDATE ================= */

      const blog =
        await Blog.findByIdAndUpdate(
          blogId,
          blogData,
          {
            new: true,
          }
        );


      return res.status(200).json({
        success: true,
        message: "Blog Updated Successfully",
        blog,
      });
    }


    /* =====================================================
       CREATE NEW BLOG
    ===================================================== */

    const blog =
      await Blog.create({
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

    console.error(
      "BLOG ERROR:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to create/update blog",
    });
  }
};


/* =====================================================
   GET MY BLOGS
===================================================== */

export const getMyBlogs = async (
  req,
  res
) => {

  try {

    const blogs =
      await Blog.find({
        author: req.user.id,
      })
        .populate(
          "author",
          "firstName lastName profilePic"
        )
        .sort({
          createdAt: -1,
        })
        .lean();


    const enrichedBlogs =
      blogs.map((blog) => ({
        ...blog,

        commentCount:
          blog.comments?.length || 0,
      }));


    return res.status(200).json({
      success: true,
      blogs: enrichedBlogs,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* =====================================================
   GET USER BLOGS (ONLY BLOGS - kept for backward compatibility)
===================================================== */

export const getUserBlogs = async (
  req,
  res
) => {

  try {

    const { userId } = req.params;


    /* ================= VALIDATE USER ID ================= */

    if (
      !mongoose.isValidObjectId(userId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }


    /* ================= FIND USER BLOGS ================= */

    const blogs =
      await Blog.find({
        author: userId,
      })
        .populate(
          "author",
          "firstName lastName profilePic"
        )
        .sort({
          createdAt: -1,
        })
        .lean();


    /* ================= ADD COMMENT COUNT ================= */

    const enrichedBlogs =
      blogs.map((blog) => ({
        ...blog,

        commentCount:
          blog.comments?.length || 0,
      }));


    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,

      blogs: enrichedBlogs,

      totalBlogs:
        enrichedBlogs.length,
    });

  } catch (error) {

    console.error(
      "GET USER BLOGS ERROR:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch user blogs",
    });
  }
};


/* =====================================================
   GET USER BLOGS + COMMENTS (SINGLE API - OPTIMIZED)
===================================================== */

/*
  Ye endpoint UserProfileModal ke liye hai.
  Ek hi API call mein blogs + comments dono return karta hai.

  GET:
  /api/v1/blog/user/:userId/with-comments

  Example:
  /api/v1/blog/user/69831d6a23861404202937c4/with-comments
*/

export const getUserBlogsWithComments = async (
  req,
  res
) => {

  try {

    const { userId } = req.params;


    /* ================= VALIDATE USER ID ================= */

    if (
      !mongoose.isValidObjectId(userId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }


    /* =====================================================
       1. FETCH USER BLOGS
    ===================================================== */

    const blogs =
      await Blog.find({
        author: userId,
      })
        .populate(
          "author",
          "firstName lastName profilePic"
        )
        .sort({
          createdAt: -1,
        })
        .lean();


    /* ================= EMPTY CASE ================= */

    if (!blogs || blogs.length === 0) {
      return res.status(200).json({
        success: true,
        blogs: [],
        comments: [],
        totalBlogs: 0,
        totalComments: 0,
      });
    }


    /* ================= BLOG IDS ================= */

    const blogIds = blogs.map(
      (blog) => blog._id
    );


    /* =====================================================
       2. FETCH ALL COMMENTS IN ONE QUERY ($in)
    ===================================================== */

    const comments =
      await Comment.find({
        blog: { $in: blogIds },
      })
        .populate(
          "user",
          "firstName lastName profilePic"
        )
        .populate(
          "blog",
          "title thumbnail"
        )
        .sort({
          createdAt: -1,
        })
        .lean();


    /* =====================================================
       3. ENRICH BLOGS WITH COMMENT COUNT
    ===================================================== */

    const commentCountMap = {};

    comments.forEach((comment) => {
      const blogId =
        comment.blog?._id?.toString() ||
        comment.blog?.toString();

      if (blogId) {
        commentCountMap[blogId] =
          (commentCountMap[blogId] || 0) + 1;
      }
    });


    const enrichedBlogs = blogs.map((blog) => ({
      ...blog,

      commentCount:
        commentCountMap[blog._id.toString()] || 0,
    }));


    /* =====================================================
       4. RESPONSE
    ===================================================== */

    return res.status(200).json({
      success: true,

      blogs: enrichedBlogs,

      comments,

      totalBlogs: enrichedBlogs.length,

      totalComments: comments.length,
    });

  } catch (error) {

    console.error(
      "GET USER BLOGS WITH COMMENTS ERROR:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch user blogs with comments",
    });
  }
};


/* =====================================================
   PUBLIC FEED
===================================================== */

export const getPublicFeed = async (
  req,
  res
) => {

  try {

    const blogs =
      await Blog.find({
        isPublished: true,
      })
        .populate(
          "author",
          "firstName lastName profilePic"
        )
        .sort({
          createdAt: -1,
        })
        .lean();


    const enrichedBlogs =
      blogs.map((blog) => ({
        ...blog,

        commentCount:
          blog.comments?.length || 0,
      }));


    return res.status(200).json({
      success: true,
      blogs: enrichedBlogs,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* =====================================================
   SINGLE BLOG
===================================================== */

export const getSingleBlog = async (
  req,
  res
) => {

  try {

    const blog =
      await Blog.findById(
        req.params.blogId
      )
        .populate(
          "author",
          "firstName lastName profilePic"
        )
        .populate({
          path: "comments",

          populate: {
            path: "user",

            select:
              "firstName lastName profilePic",
          },
        });


    if (!blog) {

      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }


    return res.status(200).json({
      success: true,
      blog,
    });

  } catch (error) {

    console.log(error);


    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =====================================================
   DELETE BLOG
===================================================== */

export const deleteBlog = async (
  req,
  res
) => {

  try {

    const blog =
      await Blog.findOneAndDelete({
        _id: req.params.blogId,

        author: req.user.id,
      });


    if (!blog) {

      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }


    return res.json({
      success: true,
      message:
        "Blog deleted successfully",
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* =====================================================
   PUBLISH BLOG
===================================================== */

export const publishBlog = async (
  req,
  res
) => {

  try {

    const blog =
      await Blog.findById(
        req.params.blogId
      );


    if (!blog) {

      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }


    blog.isPublished =
      !blog.isPublished;


    await blog.save();


    return res.json({
      success: true,

      message:
        blog.isPublished
          ? "Blog published"
          : "Blog unpublished",

      blog,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* =====================================================
   LIKE BLOG
===================================================== */

export const likeBlog = async (
  req,
  res
) => {

  try {

    const blog =
      await Blog.findById(
        req.params.blogId
      );


    if (!blog) {

      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }


    const userId =
      req.user.id;


    const alreadyLiked =
      blog.likes.some(
        (id) =>
          id.toString() === userId
      );


    if (alreadyLiked) {

      blog.likes =
        blog.likes.filter(
          (id) =>
            id.toString() !== userId
        );

    } else {

      blog.likes.push(userId);
    }


    await blog.save();


    return res.status(200).json({
      success: true,

      totalLikes:
        blog.likes.length,

      liked:
        !alreadyLiked,
    });

  } catch (error) {

    console.log(error);


    return res.status(500).json({
      success: false,
      message: "Failed to like blog",
    });
  }
};


/* =====================================================
   TOTAL LIKES
===================================================== */

export const fetMyTotallogslikes =
  async (req, res) => {

    try {

      const blogs =
        await Blog.find({
          author: req.user.id,
        });


      const totalLikes =
        blogs.reduce(
          (acc, blog) =>
            acc + blog.likes.length,
          0
        );


      return res.json({
        success: true,
        totalLikes,
      });

    } catch (err) {

      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };