import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaBookmark,
  FaRegBookmark,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

import { IoShareOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import axios from "axios";

import { API_BASE_URL } from "../../utils/api";
import { getBlogImage } from "../../utils/getBlogImage";
import CommentsSection from "../CommentsSection";

const BlogCard = ({ blog }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // ✅ Full content toggle state

  const [commentCount, setCommentCount] = useState(
    Number(blog?.commentCount) || Number(blog?.comments?.length) || 0
  );

  useEffect(() => {
    setCommentCount(
      Number(blog?.commentCount) || Number(blog?.comments?.length) || 0
    );
  }, [blog?.commentCount, blog?.comments]);

  const { user: currentUser } = useSelector((state) => state.auth);

  /* =========================
     LIKE STATE INIT
  ========================= */
  useEffect(() => {
    if (currentUser && blog?.likes) {
      setLiked(blog.likes.includes(currentUser._id));
    } else {
      setLiked(false);
    }

    setLikeCount(Number(blog?.likes?.length) || 0);
  }, [currentUser, blog]);

  /* =========================
     LIKE BLOG
  ========================= */
  const handleLike = async () => {
    if (!currentUser) {
      toast.error("Please login to like blogs");
      return;
    }

    try {
      const { data } = await axios.patch(
        `${API_BASE_URL}/api/v1/blog/${blog._id}/like`,
        {},
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setLiked(data.liked);
        setLikeCount(Number(data.likes) || 0);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to like blog");
    }
  };

  /* =========================
     SHARE
  ========================= */
  const handleShare = async () => {
    try {
      const blogUrl = `${window.location.origin}/view-blog/${blog._id}`;

      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          url: blogUrl,
        });
      } else {
        await navigator.clipboard.writeText(blogUrl);
        toast.success("Link copied!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const blogImageUrl = getBlogImage(
    blog?.thumbnail || blog?.image || blog?.coverImage
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden flex flex-col">
      {/* BLOG IMAGE */}
      <div className="w-full">
        {blogImageUrl ? (
          <Link to={`/view-blog/${blog._id}`}>
            <img
              src={blogImageUrl}
              alt={blog?.title || "blog"}
              loading="lazy"
              decoding="async"
              width="800"
              height="400"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://placehold.co/800x400?text=Blog+Image+Not+Found";
              }}
              className="w-full h-52 sm:h-64 object-cover hover:opacity-95 transition"
            />
          </Link>
        ) : (
          <div className="w-full h-52 sm:h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">
              No Blog Image
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-4">
        {/* TITLE */}
        <Link to={`/view-blog/${blog._id}`}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-500 transition">
            {blog?.title}
          </h2>
        </Link>

        {/* SUBTITLE */}
        {blog?.subtitle && (
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
            {blog?.subtitle}
          </p>
        )}

        {/* DESCRIPTION / FULL CONTENT */}
        {blog?.description && (
          <div>
            <div
              className={`text-gray-700 dark:text-gray-300 text-sm prose dark:prose-invert max-w-none ${
                !isExpanded ? "line-clamp-3" : ""
              }`}
              dangerouslySetInnerHTML={{
                __html: blog.description,
              }}
            />

            {/* Read More / Read Less Button */}
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="mt-2 text-sm dark:text-gray-500 font-semibold hover:underline flex items-center gap-1 focus:outline-none"
            >
              {isExpanded ? (
                <>
                  Show Less <FaChevronUp className="text-xs" />
                </>
              ) : (
                <>
                  Read More <FaChevronDown className="text-xs" />
                </>
              )}
            </button>
          </div>
        )}

        {/* AUTHOR & DATE */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
          <p>
            By {blog?.author?.firstName || "Unknown"}{" "}
            {blog?.author?.lastName || "Author"}
          </p>

          <p>
            {blog?.createdAt
              ? new Date(blog.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : ""}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          {/* LEFT */}
          <div className="flex gap-5 items-center text-sm">
            {/* LIKE */}
            <button
              onClick={handleLike}
              className="flex items-center gap-1 hover:text-red-500 transition"
            >
              {liked ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart />
              )}
              <span>{likeCount}</span>
            </button>

            {/* COMMENT */}
            <button
              onClick={() => setShowComments((prev) => !prev)}
              className="flex items-center gap-1 hover:text-blue-500 transition"
            >
              <FaRegComment />
              <span>{commentCount}</span>
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex gap-5 items-center">
            {/* SHARE */}
            <button
              onClick={handleShare}
              className="hover:text-green-500 transition"
            >
              <IoShareOutline />
            </button>

            {/* SAVE */}
            <button
              onClick={() => setSaved(!saved)}
              className="hover:text-yellow-500 transition"
            >
              {saved ? (
                <FaBookmark className="text-yellow-500" />
              ) : (
                <FaRegBookmark />
              )}
            </button>
          </div>
        </div>

        {/* COMMENTS SECTION */}
        {showComments && (
          <div className="mt-5">
            <CommentsSection
              blogId={blog?._id}
              currentUser={currentUser}
              className="bg-white dark:bg-gray-900 p-4 rounded-3xl"
              onCommentsChange={(comments) => {
                setCommentCount(Number(comments?.length) || 0);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard;