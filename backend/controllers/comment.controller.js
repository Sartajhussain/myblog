import Comment from "../models/comment.model.js";

export { addReply } from "./addReply.controller.js";
export { getComments } from "./getCommentReply.controller.js";
export { likeComment } from "./likeComment.controller.js";

export const addComment = async (req, res) => {
  try {

    const { text } = req.body;
    const { id: blogId } = req.params;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Comment text required"
      });
    }

    if (!blogId) {
      return res.status(400).json({
        success: false,
        message: "Blog ID required"
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const comment = await Comment.create({
      blog: blogId,
      user: req.user.id,
      text
    });

    // commenter details laane ke liye
    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "firstName lastName profilePic");

    res.status(201).json({
      success: true,
      comment: populatedComment
    });

  } catch (err) {

    console.log("COMMENT ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: "Comment failed",
      error: err.message
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Comment text required"
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }

    // Check if user is the comment owner
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own comments"
      });
    }

    comment.text = text;
    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "firstName lastName profilePic");

    res.json({
      success: true,
      comment: populatedComment
    });

  } catch (err) {
    console.log("UPDATE COMMENT ERROR:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to update comment"
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }

    // Check if user is the comment owner
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments"
      });
    }

    await Comment.findByIdAndDelete(commentId);

    res.json({
      success: true,
      message: "Comment deleted"
    });

  } catch (err) {
    console.log("DELETE COMMENT ERROR:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete comment"
    });
  }
};