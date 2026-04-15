import { Blog } from "../models/blog.model.js";
import cloudinary from "../utils/cloudinary.js";
import { getDataUri } from "../utils/dataUri.js";
import mongoose from "mongoose";

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
      author: req.user.id

    });

    return res.status(201).json({
      success: true,
      message: "Blog Created Successfully",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "failed to create blog",
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId
    const { title, subtitle, description, category } = req.body;
    const file = req.file;

    let blog = await Blog.findById(blogId)
    if (!blog) {
      return res.status(404).json({
        message: "blog not found"
      })

    }
    let thumbnail;
    if (file) {

      const fileUri = getDataUri(file);
      thumbnail = await cloudinary.uploader.upload(fileUri.content)

    }
    const updateData = { title, subtitle, description, category, author: req.user.id, thumbnail: thumbnail?.secure_url }
    blog = await Blog.findByIdAndUpdate(blogId, updateData, { new: true })
    res.status(200).json({
      success: true,
      message: "Updated Blog",
      blog
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "error updatng blog"
    })
  }
}



export const getMyBlogs = async (req, res) => {
  try {
    const userId = req.user.id;

    // 🔐 Check authentication
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login."
      });
    }

    // ✅ Fetch only logged-in user's blogs
    const blogs = await Blog.find({ author: userId })
      .populate("author", "firstName lastName profilePic")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Your blogs fetched successfully",
      blogs
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching your blogs",
      error: error.message
    });
  }
};

export const getPublicFeed = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .sort({ createdAt: -1 }) // newest first
      .populate("author", "firstName lastName profilePic");

    return res.status(200).json({
      success: true,
      blogs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching public feed",
      error: error.message
    });
  }
};


export const deleteBlog = async (req, res) => {
  try {

    const blogId = req.params.blogId;
    const authorId = req.user.id;

    if (!authorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    const blog = await Blog.findOne({ _id: blogId, author: authorId });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found or you are not the author",
      });
    }

    // ✅ DELETE BLOG
    await blog.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });

  } catch (error) {
    console.error("DELETE BLOG ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error deleting blog",
    });
  }
};
export const getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .populate("author", "firstName lastName profilePic")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      blogs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching blogs"
    });
  }
};

export const getSingleBlog = async (req, res) => {
  try {

    const blogId = req.params.blogId;

    const blog = await Blog.findById(blogId)
      .populate("author", "firstName lastName profilePic");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    return res.status(200).json({
      success: true,
      blog
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching blog",
      error: error.message
    });
  }
};

export const publishBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const authorId = req.user.id;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    // Check blog owner
    if (blog.author.toString() !== authorId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this blog"
      });
    }

   // Toggle publish status
blog.isPublished = !blog.isPublished;

await blog.save();

// 🔥 IMPORTANT: populate before sending response
await blog.populate("author");

return res.status(200).json({
  success: true,
  message: blog.isPublished
    ? "Blog published successfully"
    : "Blog unpublished successfully",
  blog
});

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating blog status",
      error: error.message
    });
  }
};

export const likeBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.user.id;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    const isLiked = blog.likes.includes(userId);

    if (isLiked) {
      // Unlike the blog
      blog.likes = blog.likes.filter(id => id.toString() !== userId);
    } else {
      // Like the blog
      blog.likes.push(userId);
    }

    await blog.save();

    return res.status(200).json({
      success: true,
      message: isLiked ? "Blog unliked successfully" : "Blog liked successfully",
      likes: blog.likes.length
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error liking/unliking blog",
      error: error.message
    });
  }
}

export const fetMyTotallogslikes = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogs = await Blog.find({ author: userId });

    const totalLikes = blogs.reduce((acc, blog) => acc + blog.likes.length, 0);
    return res.status(200).json({
      success: true,
      message: "Total likes fetched successfully",
      totalLikes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching total likes",
      error: error.message
    });
  }
}
