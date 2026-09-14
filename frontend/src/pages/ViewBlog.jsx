import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

import { IoShareOutline, IoArrowBack } from "react-icons/io5";

import Skeleton from "../components/Skeleton";
import CommentsSection from "../components/CommentsSection";
import userimg from "../assets/userprofile.png";

/* =======================
   IMAGE HELPER
======================= */
const getBlogImage = (blog) => {
  const imagePath = blog?.thumbnail || blog?.image || blog?.coverImage;

  if (
    !imagePath ||
    imagePath === "null" ||
    imagePath === "undefined" ||
    imagePath === ""
  ) {
    return "https://placehold.co/1200x800/6366f1/white?text=No+Image";
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  if (imagePath.startsWith("/uploads")) {
    return `${API_BASE_URL}${imagePath}`;
  }

  if (imagePath.startsWith("uploads")) {
    return `${API_BASE_URL}/${imagePath}`;
  }

  return `${API_BASE_URL}/${imagePath}`;
};

const formatDateTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${day} ${month} ${year} • ${hours}:${minutes} ${ampm}`;
};

const ViewBlog = () => {
  const navigate = useNavigate();
  const { blogId } = useParams();

  const { user } = useSelector((store) => store.auth);

  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  /* =======================
     FETCH BLOG
  ======================= */
  useEffect(() => {
    const fetchBlogFromDB = async () => {
      setLoading(true);

      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/v1/blog/${blogId}`,
          { withCredentials: true }
        );

        if (data?.success && data.blog) {
          const blog = data.blog;
          setSelectedBlog(blog);
          setLiked(blog?.likes?.includes(user?._id) || false);
          setLikeCount(blog?.likes?.length || 0);
        } else {
          toast.error("Blog not found");
          setSelectedBlog(null);
        }
      } catch (err) {
        console.error("❌ Error fetching blog:", err);
        toast.error(err.response?.data?.message || "Failed to load blog");
        setSelectedBlog(null);
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlogFromDB();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [blogId]);

  /* =======================
     COMMENTS COUNT
  ======================= */
  useEffect(() => {
    const fetchComments = async () => {
      if (!selectedBlog?._id) return;

      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/comment/blog/${selectedBlog._id}`,
          { withCredentials: true }
        );
        setCommentCount(res.data?.comments?.length || 0);
      } catch {
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
      const { data } = await axios.patch(
        `${API_BASE_URL}/api/v1/blog/${selectedBlog._id}/like`,
        {},
        { withCredentials: true }
      );

      if (data?.success) {
        const updatedLikes = data.likes || [];
        setLiked(data.liked);
        setLikeCount(updatedLikes.length);
        setSelectedBlog((prev) => ({
          ...prev,
          likes: updatedLikes,
        }));
      }
    } catch (err) {
      console.log(err);
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
      console.log(err);
    }
  };

  /* =======================
     LOADING
  ======================= */
  if (loading) return <Skeleton type="blog" />;

  /* =======================
     NOT FOUND
  ======================= */
  if (!selectedBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">
          Blog not found
        </p>
      </div>
    );
  }

  const blogImageUrl = getBlogImage(selectedBlog);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      {/* =====================================================
          BACKGROUND GLOW — same theme
      ===================================================== */}
      <div className="pointer-events-none absolute top-[-100px] left-[-100px] w-[450px] h-[450px] bg-[oklch(0.71_0.2_46.45)] opacity-[0.1] dark:opacity-[0.08] rounded-full blur-3xl animate-blob" />
      <div className="pointer-events-none absolute bottom-[-100px] right-[-100px] w-[450px] h-[450px] bg-[oklch(0.8_0.15_60)] opacity-[0.1] dark:opacity-[0.07] rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gray-400 dark:bg-gray-600 opacity-[0.08] dark:opacity-[0.06] rounded-full blur-3xl animate-blob animation-delay-4000" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* =====================================================
          MAIN CONTENT — SAME AS BEFORE
      ===================================================== */}
      <div className="relative z-10 flex justify-center">
        <div className="w-full max-w-6xl mt-8 py-10 px-4 md:px-10 space-y-10">

          {/* BACK */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-[oklch(0.71_0.2_46.45)] transition-colors"
          >
            <IoArrowBack className="text-xl" />
          </button>

          {/* TITLE */}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
            {selectedBlog.title}
          </h1>

          {/* AUTHOR */}
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <img
              src={getProfileImage(selectedBlog?.author?.profilePic)}
              alt="author"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[oklch(0.71_0.2_46.45)]/40"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = userimg;
              }}
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {selectedBlog?.author?.firstName}{" "}
                {selectedBlog?.author?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDateTime(selectedBlog?.createdAt)}
              </p>
            </div>
          </div>

          {/* IMAGE */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={blogImageUrl}
              alt={selectedBlog.title}
              className="w-full h-[300px] md:h-[500px] object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/1200x800/6366f1/white?text=Image+Not+Found";
              }}
            />
          </div>

          {/* CONTENT */}
          <div
            className="
              prose prose-lg dark:prose-invert max-w-none
              prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-p:text-gray-700 dark:prose-p:text-gray-300
              prose-a:text-[oklch(0.71_0.2_46.45)] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 dark:prose-strong:text-white
              prose-blockquote:border-l-[oklch(0.71_0.2_46.45)]
              prose-code:text-[oklch(0.71_0.2_46.45)]
            "
            dangerouslySetInnerHTML={{ __html: selectedBlog.description }}
          />

          {/* INTERACTION ROW */}
          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">

            {/* LEFT — Like + Comment */}
            <div className="flex gap-5 items-center">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 transition-colors ${
                  liked
                    ? "text-red-500"
                    : "text-gray-700 dark:text-gray-200 hover:text-red-500"
                }`}
              >
                {liked ? <FaHeart /> : <FaRegHeart />}
                <span>{likeCount}</span>
              </button>

              <button className="flex items-center gap-1.5 text-gray-700 dark:text-gray-200 hover:text-[oklch(0.71_0.2_46.45)] transition-colors">
                <FaRegComment />
                <span>{commentCount}</span>
              </button>
            </div>

            {/* RIGHT — Share + Save */}
            <div className="flex gap-5 items-center">
              <button
                onClick={handleShare}
                className="text-gray-700 dark:text-gray-200 hover:text-[oklch(0.71_0.2_46.45)] transition-colors"
                aria-label="Share"
              >
                <IoShareOutline className="text-xl" />
              </button>

              <button
                onClick={() => setSaved(!saved)}
                className={`transition-colors ${
                  saved
                    ? "text-[oklch(0.71_0.2_46.45)]"
                    : "text-gray-700 dark:text-gray-200 hover:text-[oklch(0.71_0.2_46.45)]"
                }`}
                aria-label="Save"
              >
                {saved ? <FaBookmark /> : <FaRegBookmark />}
              </button>
            </div>
          </div>

          {/* COMMENTS */}
          <CommentsSection
            blogId={selectedBlog._id}
            currentUser={user}
            onCommentsChange={(comments) =>
              setCommentCount(comments?.length || 0)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;