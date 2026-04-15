import Comment from "../models/comment.model.js";
import Reply from "../models/reply.model.js";

export const getComments = async (req, res) => {

  try {

    const { blogId } = req.params;

    if (!blogId) {
      return res.status(400).json({
        success: false,
        message: "Blog ID required"
      });
    }

    const comments = await Comment.find({ blog: blogId })
      .populate("user", "firstName lastName profilePic")
      .populate("blog", "title")
      .sort({ createdAt: -1 });

    const replies = await Reply.find({ blog: blogId })
      .populate("user", "firstName lastName profilePic");

    res.status(200).json({
      success: true,
      comments,
      replies
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};