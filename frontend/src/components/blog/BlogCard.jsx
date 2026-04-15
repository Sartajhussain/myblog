import React, { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaBookmark,
  FaRegBookmark,
  FaEllipsisH,
} from "react-icons/fa";
import { IoShareOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import userimg from "../../assets/userprofile.png";

// Utility to calculate relative time
const getRelativeTime = (date) => {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds

  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} d ago`;
  return `${Math.floor(diff / 604800)} w ago`;
};

const BlogCard = ({ blog, currentUserId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(blog.likes || 0);
  const [saved, setSaved] = useState(false);

  const [comments, setComments] = useState(
    (blog.comments || []).map((c) => ({
      ...c,
      profile: c.user?.profilePic || userimg,
      id: c._id || Date.now() + Math.random(),
      createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
      showMenu: false, // for 3-dot menu toggle
    }))
  );

  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      user: {
        _id: currentUserId,
        firstName: "You",
        lastName: "",
        profilePic: userimg,
      },
      text: commentText,
      likes: 0,
      liked: false,
      replies: [],
      createdAt: new Date(),
      showMenu: false,
    };
    setComments([newComment, ...comments]);
    setCommentText("");
  };

  const toggleCommentLike = (id) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : c
      )
    );
  };

  const handleEditComment = (id, newText) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, text: newText } : c))
    );
  };

  const handleDeleteComment = (id) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleMenu = (id) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, showMenu: !c.showMenu } : { ...c, showMenu: false }))
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
      {blog.thumbnail && (
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="w-full h-52 sm:h-64 object-cover"
        />
      )}

      <div className="p-5 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {blog.title}
        </h2>

        <p className="text-gray-600 dark:text-gray-300 text-sm">{blog.subtitle}</p>

        <div
          className="text-gray-700 dark:text-gray-300 text-sm"
          dangerouslySetInnerHTML={{ __html: blog.description }}
        />

        <p className="text-xs text-gray-500">
          By {blog.author?.firstName} {blog.author?.lastName}
        </p>

        {/* Actions */}
        <div className="flex justify-between pt-2 border-t">
          <div className="flex gap-5 items-center text-sm">
            <button onClick={handleLike} className="flex items-center gap-1">
              {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              {likeCount}
            </button>

            <button onClick={() => setShowCommentInput(!showCommentInput)}>
              <FaRegComment />
            </button>
          </div>

          <div className="flex gap-5 items-center">
            <button onClick={handleShare}>
              <IoShareOutline />
            </button>

            <button onClick={() => setSaved(!saved)}>
              {saved ? <FaBookmark className="text-yellow-500" /> : <FaRegBookmark />}
            </button>
          </div>
        </div>

        {/* Comment Input */}
        {showCommentInput && (
          <div className="flex items-start gap-3 mt-2">
            <img
              src={blog.author?.profilePic || userimg}
              alt={blog.author?.firstName || "User"}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => (e.target.src = userimg)}
            />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddComment();
              }}
              className="flex-1 flex items-center border rounded-full px-4 py-2"
            >
              <input
                type="text"
                placeholder="Leave a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 outline-none bg-transparent text-sm"
              />
              <button type="submit" className="text-blue-500 font-semibold">
                Post
              </button>
            </form>
          </div>
        )}

        {/* Comments */}
        <div className="space-y-4 mt-2">
          {(showAllComments ? comments : comments.slice(0, 3)).map((c) => (
            <div key={c.id} className="flex gap-3 relative">
              <img
                src={c.user?.profilePic || userimg}
                alt={c.user?.firstName || "User"}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => (e.target.src = userimg)}
              />
              <div className="flex-1 bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl relative">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">
                      {c.user?.firstName} {c.user?.lastName}
                    </p>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{c.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{getRelativeTime(new Date(c.createdAt))}</p>
                  </div>

                  {/* 3-dot menu for edit/delete */}
                  {c.user?._id === currentUserId && (
                    <div className="relative">
                      <FaEllipsisH
                        className="cursor-pointer"
                        onClick={() => toggleMenu(c.id)}
                      />
                      {c.showMenu && (
                        <div className="absolute right-0 mt-1 flex flex-col bg-white dark:bg-gray-700 rounded shadow z-50">
                          <button
                            onClick={() => {
                              const newText = prompt("Edit your comment:", c.text);
                              if (newText) handleEditComment(c.id, newText);
                              toggleMenu(c.id);
                            }}
                            className="px-3 py-1 text-xs hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteComment(c.id);
                              toggleMenu(c.id);
                            }}
                            className="px-3 py-1 text-xs hover:bg-gray-200 dark:hover:bg-gray-600 text-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Like button */}
                <button
                  onClick={() => toggleCommentLike(c.id)}
                  className="flex items-center gap-1 text-xs mt-2"
                >
                  {c.liked ? <FaHeart className="text-red-500 text-xs" /> : <FaRegHeart className="text-xs" />}
                  {c.likes}
                </button>
              </div>
            </div>
          ))}

          {comments.length > 3 && (
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className="text-blue-500 text-sm hover:underline"
            >
              {showAllComments ? "Hide comments" : `View all ${comments.length} comments`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;