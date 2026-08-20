import Comment from "../models/comment.model.js";
import { Blog } from "../models/blog.model.js";

export { addReply } from "./addReply.controller.js";
export { getComments } from "./getCommentReply.controller.js";
export { likeComment } from "./likeComment.controller.js";

// ================= ADD COMMENT =================
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { blogId } = req.params;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment text required",
      });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const comment = await Comment.create({
      text,
      user: req.user.id || req.user._id,
      blog: blog._id,
    });

    blog.comments.push(comment._id);
    await blog.save();

    const populatedComment = await Comment.findById(comment._id).populate(
      "user",
      "firstName lastName profilePic"
    );

    return res.status(201).json({
      success: true,
      comment: populatedComment,
    });
  } catch (error) {
    console.log("ADD COMMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add comment",
    });
  }
};

// ================= GET ALL COMMENTS =================
export const getAllComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const totalComments = await Comment.countDocuments();

    let query = Comment.find()
      .populate("user", "firstName lastName profilePic")
      .populate("blog", "title thumbnail")
      .sort({ createdAt: -1 });

    // Agar frontend limit bhejta hai tabhi limit lagayein
    if (req.query.limit) {
      const limit = parseInt(req.query.limit);
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    const comments = await query;

    res.status(200).json({
      success: true,
      comments,
      currentPage: page,
      totalComments,
    });
  } catch (err) {
    console.log("GET ALL COMMENTS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
    });
  }
};

// ================= GET COMMENTS FOR CURRENT USER'S BLOGS =================
export const getCommentsForMyBlogs = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    // 1. User ke saare blogs ki IDs nikalein
    const userBlogIds = await Blog.find({ author: userId }).select("_id").lean();
    const blogIds = userBlogIds.map((blog) => blog._id);

    // 2. Database mein total comments count
    const totalComments = await Comment.countDocuments({
      blog: { $in: blogIds },
    });

    // 3. Dynamic Query (Default: Saare comments, Limit sirf jab req.query.limit ho)
    let query = Comment.find({ blog: { $in: blogIds } })
      .populate("user", "firstName lastName profilePic")
      .populate("blog", "title thumbnail author")
      .sort({ createdAt: -1 });

    if (req.query.limit) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit);
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    const comments = await query;

    return res.status(200).json({
      success: true,
      comments,
      totalComments,
    });
  } catch (err) {
    console.log("GET COMMENTS FOR MY BLOGS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments for your blogs",
    });
  }
};

// ================= UPDATE COMMENT =================
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment text required",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const currentUserId = (req.user.id || req.user._id).toString();

    if (comment.user.toString() !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own comments",
      });
    }

    comment.text = text;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id).populate(
      "user",
      "firstName lastName profilePic"
    );

    res.status(200).json({
      success: true,
      comment: updatedComment,
    });
  } catch (err) {
    console.log("UPDATE COMMENT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update comment",
    });
  }
};

// ================= DELETE COMMENT =================
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const currentUserId = (req.user.id || req.user._id).toString();

    if (comment.user.toString() !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments",
      });
    }

    // REMOVE COMMENT ID FROM BLOG
    await Blog.findByIdAndUpdate(comment.blog, {
      $pull: {
        comments: comment._id,
      },
    });

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({
      success: true,
      message: "Comment deleted",
    });
  } catch (err) {
    console.log("DELETE COMMENT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete comment",
    });
  }
};