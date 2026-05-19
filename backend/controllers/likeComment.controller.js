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

    const alreadyLiked = comment.likes.some(
      (id) => String(id) === String(userId)
    );

    if (alreadyLiked) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.status(200).json({
      success: true,

      liked: !alreadyLiked,

      likes: comment.likes, // ✅ FULL ARRAY
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};