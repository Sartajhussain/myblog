import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../utils/api";
import { getProfileImage } from "../utils/profileImage";

import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";

import { IoShareOutline } from "react-icons/io5";

import Skeleton from "../components/Skeleton";
import CommentsSection from "../components/CommentsSection";

import userimg from "../assets/userprofile.png";

/* =======================
   IMAGE HELPER
======================= */
const getBlogImage = (thumbnail) => {
  if (!thumbnail || thumbnail === "null" || thumbnail === "undefined") {
    return userimg;
  }

  if (thumbnail.startsWith("http")) {
    return thumbnail;
  }

  return `${API_BASE_URL}/${thumbnail}`;
};

const ViewBlog = ({ blog }) => {
  const { blogId } = useParams();

  const { blog: blogState } = useSelector((store) => store.blog);
  const { user } = useSelector((store) => store.auth);

  const [selectedBlog, setSelectedBlog] = useState(null);

  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);

  /* =======================
     COMMENT COUNT
  ======================= */
  const [commentCount, setCommentCount] = useState(0);

  /* =======================
     FETCH BLOG
  ======================= */
  const fetchBlog = async () => {
    try {
      setLoading(true);

      /* 🔥 FIRST CHECK REDUX */
      const existingBlog =
        blog ||
        blogState?.find((b) => b._id === blogId);

      if (existingBlog) {
        setSelectedBlog(existingBlog);
        setLiked(existingBlog.likes?.includes(user?._id) || false);
        setLikeCount(existingBlog.likes?.length || 0);
        setLoading(false);
      }

      /* 🔥 ALWAYS FETCH NEW BLOG */
      const { data } = await axios.get(
        `${API_BASE_URL}/api/v1/blog/${blogId}`,
        { withCredentials: true }
      );

      if (data.success) {
        setSelectedBlog(data.blog);
        setLiked(data.blog.likes?.includes(user?._id) || false);
        setLikeCount(data.blog.likes?.length || 0);
      }

    } catch (error) {
      console.log(error);
      toast.error("Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     BLOG CHANGE FIX 🔥
  ======================= */
  useEffect(() => {
    if (blogId) {
      fetchBlog();

      /* 🔥 TOP SCROLL */
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [blogId]);

  /* =======================
     COMMENT COUNT FETCH
  ======================= */
  useEffect(() => {
    const fetchComments = async () => {
      if (!selectedBlog?._id) return;

      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/comment/blog/${selectedBlog._id}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setCommentCount(res.data.comments?.length || 0);
        }
      } catch (error) {
        console.log(error);
        setCommentCount(0);
      }
    };

    fetchComments();
  }, [selectedBlog?._id]);

  /* =======================
     LIKE
  ======================= */
  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like blogs");
      return;
    }

    try {
      const res = await axios.patch(
        `${API_BASE_URL}/api/v1/blog/${selectedBlog._id}/like`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setLiked(res.data.liked);
        setLikeCount(res.data.likes);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to like blog");
    }
  };

  /* =======================
     SHARE
  ======================= */
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: selectedBlog.title,
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

  /* =======================
     LOADING
  ======================= */
  if (loading) {
    return <Skeleton type="blog" />;
  }

  /* =======================
     BLOG NOT FOUND
  ======================= */
  if (!selectedBlog) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 dark:text-gray-400">
          Blog not found
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="w-full max-w-6xl mt-14 py-10 px-4 md:px-10 space-y-10">

        {/* TITLE */}
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
          {selectedBlog.title}
        </h1>

        {/* AUTHOR */}
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">

          <img
            src={getProfileImage(selectedBlog?.author?.profilePic)}
            alt={selectedBlog?.author?.firstName || "Author"}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.src = userimg;
            }}
          />

          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {selectedBlog?.author?.firstName}{" "}
              {selectedBlog?.author?.lastName}
            </p>

            <p>
              {new Date(selectedBlog.createdAt).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )}{" "}
              •{" "}
              {new Date(selectedBlog.createdAt).toLocaleTimeString(
                "en-IN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </p>
          </div>
        </div>

        {/* IMAGE */}
        <img
          src={getBlogImage(
            selectedBlog.thumbnail ||
              selectedBlog.image
          )}
          alt={selectedBlog.title}
          className="w-full h-[300px] md:h-[500px] object-cover rounded-2xl"
          onError={(e) => {
            e.target.src = userimg;
          }}
        />

        {/* DESCRIPTION */}
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: selectedBlog.description,
          }}
        />

        {/* ACTIONS */}
        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">

          <div className="flex gap-5 items-center text-sm">

            {/* LIKE */}
            <button
              onClick={handleLike}
              className="flex items-center gap-1 hover:scale-105 transition"
            >
              {liked ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart />
              )}

              <span>{likeCount}</span>
            </button>

            {/* COMMENT */}
            <button className="flex items-center gap-1">
              <FaRegComment />
              <span>{commentCount}</span>
            </button>

          </div>

          <div className="flex gap-5 items-center">

            {/* SHARE */}
            <button
              onClick={handleShare}
              className="hover:scale-105 transition"
            >
              <IoShareOutline />
            </button>

            {/* SAVE */}
            <button
              onClick={() => setSaved(!saved)}
              className="hover:scale-105 transition"
            >
              {saved ? (
                <FaBookmark className="text-yellow-500" />
              ) : (
                <FaRegBookmark />
              )}
            </button>

          </div>

        </div>

        {/* COMMENTS */}
        <CommentsSection
          blogId={selectedBlog._id}
          currentUser={user}
        />

      </div>
    </div>
  );
};

export default ViewBlog;