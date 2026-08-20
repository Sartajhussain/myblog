import mongoose from "mongoose";

export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request. User identity not found.",
      });
    }

    // Ensure commentId valid ObjectId hai
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Comment ID",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Ensure likes array exists
    if (!comment.likes) {
      comment.likes = [];
    }

    // Safe comparison using toString()
    const userIndex = comment.likes.findIndex(
      (id) => id.toString() === userId.toString()
    );

    let isLiked = false;

    if (userIndex !== -1) {
      // User found -> Remove like
      comment.likes.splice(userIndex, 1);
      isLiked = false;
    } else {
      // User not found -> Add like
      comment.likes.push(userId);
      isLiked = true;
    }

    await comment.save();

    return res.status(200).json({
      success: true,
      message: isLiked ? "Comment liked" : "Comment unliked",
      liked: isLiked,
      likes: comment.likes,
      likesCount: comment.likes.length,
    });
  } catch (err) {
    console.error("Error in likeComment live:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};