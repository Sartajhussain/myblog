import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { IoShareOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";
import userimg from "../../assets/userprofile.png";
import CommentsSection from "../CommentsSection";

/* =========================
   🔥 IMAGE FIX HELPER
========================= */
const getBlogImage = (thumbnail) => {
  if (!thumbnail || thumbnail === "null" || thumbnail === "undefined") {
    return userimg;
  }

  if (thumbnail.startsWith("http")) {
    return thumbnail;
  }

  return `${API_BASE_URL}/${thumbnail}`;
};

const BlogCard = ({ blog }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(blog.likes?.length || 0);

  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const [commentCount, setCommentCount] = useState(0);

  const { user: currentUser } = useSelector((state) => state.auth);

  /* =========================
     LIKE STATE INIT
  ========================= */
  useEffect(() => {
    if (currentUser && blog.likes) {
      setLiked(blog.likes.includes(currentUser._id));
    } else {
      setLiked(false);
    }
    setLikeCount(blog.likes?.length || 0);
  }, [currentUser, blog.likes]);

  /* =========================
     COMMENT COUNT
  ========================= */
  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/comment/blog/${blog._id}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setCommentCount(res.data.comments?.length || 0);
        }
      } catch (error) {
        setCommentCount(0);
      }
    };

    fetchCommentCount();
  }, [blog._id]);

  /* =========================
     LIKE
  ========================= */
  const handleLike = async () => {
    if (!currentUser) {
      toast.error("Please login to like blogs");
      return;
    }

    try {
      const res = await axios.patch(
        `${API_BASE_URL}/api/v1/blog/${blog._id}/like`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setLiked(res.data.liked);
        setLikeCount(res.data.likes);
      }
    } catch (error) {
      toast.error("Failed to like blog");
    }
  };

  /* =========================
     SHARE
  ========================= */
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">

      {/* IMAGE (🔥 FIXED) */}
      <img
        src={getBlogImage(blog.thumbnail)}
        alt={blog.title}
        className="w-full h-52 sm:h-64 object-cover"
      />

      <div className="p-5 space-y-4">

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {blog.title}
        </h2>

        {/* DESCRIPTION */}
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {blog.subtitle}
        </p>

        <div
          className="text-gray-700 dark:text-gray-300 text-sm"
          dangerouslySetInnerHTML={{ __html: blog.description }}
        />

        {/* AUTHOR */}
        <p className="text-xs text-gray-500">
          By {blog.author?.firstName} {blog.author?.lastName}
        </p>

        {/* ACTIONS */}
        <div className="flex justify-between pt-2 border-t">

          {/* LEFT */}
          <div className="flex gap-5 items-center text-sm">

            <button onClick={handleLike} className="flex items-center gap-1">
              {liked ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart />
              )}
              <span>{likeCount}</span>
            </button>

            <button
              onClick={() => setShowComments((prev) => !prev)}
              className="flex items-center gap-1"
            >
              <FaRegComment />
              <span>{commentCount}</span>
            </button>

          </div>

          {/* RIGHT */}
          <div className="flex gap-5 items-center">

            <button onClick={handleShare}>
              <IoShareOutline />
            </button>

            <button onClick={() => setSaved(!saved)}>
              {saved ? (
                <FaBookmark className="text-yellow-500" />
              ) : (
                <FaRegBookmark />
              )}
            </button>

          </div>

        </div>

        {/* COMMENTS */}
        {showComments && (
          <div className="mt-5">
            <CommentsSection
              blogId={blog._id}
              currentUser={currentUser}
              className="bg-white dark:bg-gray-900 p-4 rounded-3xl"
              onCommentChange={(count) => setCommentCount(count)}
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogCard;