import Comment from "../models/comment.model.js";

export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyLiked) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({
      success: true,
      likes: comment.likes.length,
      liked: comment.likes.includes(userId), // 🔥 IMPORTANT FIX
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};