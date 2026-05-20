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
   ✅ FIXED IMAGE HELPER
======================= */
const getBlogImage = (blog) => {
  // Try all possible image fields
  const imagePath = blog?.thumbnail || blog?.image || blog?.coverImage;
  
  console.log("🔍 Getting image for blog:", blog?.title);
  console.log("🔍 Image path from DB:", imagePath);
  
  if (!imagePath || imagePath === "null" || imagePath === "undefined" || imagePath === "") {
    console.log("❌ No image path found");
    return "https://placehold.co/1200x800/6366f1/white?text=No+Image";
  }

  // If already full URL
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    console.log("✅ Full URL detected:", imagePath);
    return imagePath;
  }

  // If path starts with /uploads
  if (imagePath.startsWith("/uploads")) {
    const fullUrl = `${API_BASE_URL}${imagePath}`;
    console.log("✅ Converted /uploads path:", fullUrl);
    return fullUrl;
  }

  // If path starts with uploads (without slash)
  if (imagePath.startsWith("uploads")) {
    const fullUrl = `${API_BASE_URL}/${imagePath}`;
    console.log("✅ Converted uploads path:", fullUrl);
    return fullUrl;
  }

  // Default fallback
  const fullUrl = `${API_BASE_URL}/${imagePath}`;
  console.log("✅ Default conversion:", fullUrl);
  return fullUrl;
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
     DIRECTLY FETCH FROM DB (NO REDUX)
  ======================= */
  useEffect(() => {
    const fetchBlogFromDB = async () => {
      setLoading(true);
      
      try {
        console.log("🔄 Fetching blog from DB:", blogId);
        
        const { data } = await axios.get(
          `${API_BASE_URL}/api/v1/blog/${blogId}`,
          { withCredentials: true }
        );

        console.log("📦 API Response:", data);

        if (data?.success && data.blog) {
          const blog = data.blog;
          
          console.log("✅ Blog fetched:", {
            id: blog._id,
            title: blog.title,
            thumbnail: blog.thumbnail,
            image: blog.image,
            coverImage: blog.coverImage,
            imageUrl: getBlogImage(blog)
          });
          
          setSelectedBlog(blog);
          setLiked(blog?.likes?.includes(user?._id) || false);
          setLikeCount(blog?.likes?.length || 0);
        } else {
          console.error("❌ Blog not found");
          toast.error("Blog not found");
          setSelectedBlog(null);
        }
      } catch (err) {
        console.error("❌ Error fetching blog:", err);
        console.error("Error details:", err.response?.data);
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
     LIKE BLOG
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
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 dark:text-gray-400">
          Blog not found
        </p>
      </div>
    );
  }

  const blogImageUrl = getBlogImage(selectedBlog);

  return (
    <div className="flex justify-center bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="w-full max-w-6xl mt-8 py-10 px-4 md:px-10 space-y-10">

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <IoArrowBack className="text-xl" />
        </button>

        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
          {selectedBlog.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <img
            src={getProfileImage(selectedBlog?.author?.profilePic)}
            alt="author"
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => (e.target.src = userimg)}
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {selectedBlog?.author?.firstName} {selectedBlog?.author?.lastName}
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
              console.error(`❌ Image failed to load: ${blogImageUrl}`);
              e.target.onerror = null;
              e.target.src = "https://placehold.co/1200x800/6366f1/white?text=Image+Not+Found";
            }}
            onLoad={() => {
              console.log(`✅ Image loaded: ${blogImageUrl}`);
            }}
          />
        </div>

        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: selectedBlog.description }}
        />

        <div className="flex justify-between pt-4 border-t">
          <div className="flex gap-5 items-center">
            <button onClick={handleLike} className="flex items-center gap-1">
              {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              <span>{likeCount}</span>
            </button>
            <button className="flex items-center gap-1">
              <FaRegComment />
              <span>{commentCount}</span>
            </button>
          </div>
          <div className="flex gap-5 items-center">
            <button onClick={handleShare}><IoShareOutline /></button>
            <button onClick={() => setSaved(!saved)}>
              {saved ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          </div>
        </div>

        <CommentsSection
          blogId={selectedBlog._id}
          currentUser={user}
          onCommentsChange={(comments) => setCommentCount(comments?.length || 0)}
        />
      </div>
    </div>
  );
};

export default ViewBlog;