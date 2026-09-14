import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FiInstagram,
  FiFacebook,
  FiLinkedin,
  FiGithub,
  FiBookOpen,
  FiMessageCircle,
  FiEye,
  FiHeart,
  FiX,
  FiMail,
  FiArrowRight,
} from "react-icons/fi";

import userimg from "../assets/userprofile.png";
import { getProfileImage } from "../utils/profileImage";
import { API_BASE_URL } from "../utils/api";
import { useNavigate } from "react-router-dom";

const UserProfileModal = ({ isOpen, user, onClose }) => {
  const navigate = useNavigate();

  const [userBlogs, setUserBlogs] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // FETCH USER DATA
  // =====================================================
  useEffect(() => {
    if (!isOpen || !user?._id) return;

    let isCancelled = false;

    const fetchUserData = async () => {
      setLoading(true);

      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/v1/blog/user/${user._id}/with-comments`,
          { withCredentials: true }
        );

        if (isCancelled) return;

        if (data?.success) {
          setUserBlogs(data.blogs || []);
          setUserComments(data.comments || []);
        } else {
          setUserBlogs([]);
          setUserComments([]);
        }
      } catch (error) {
        if (isCancelled) return;
        console.error("❌ User data fetch error:", error);
        setUserBlogs([]);
        setUserComments([]);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchUserData();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, user?._id]);

  // =====================================================
  // HELPERS
  // =====================================================
  const getBlogImage = (blog) => {
    const imagePath = blog?.thumbnail || blog?.image || blog?.coverImage;

    if (!imagePath || imagePath === "null" || imagePath === "undefined") {
      return "https://placehold.co/400x200/6366f1/white?text=No+Image";
    }

    if (typeof imagePath === "string" && imagePath.startsWith("http")) {
      return imagePath;
    }

    if (typeof imagePath === "string" && imagePath.startsWith("/uploads")) {
      return `${API_BASE_URL}${imagePath}`;
    }

    return `${API_BASE_URL}/${imagePath}`;
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleViewBlog = (blogId) => {
    if (!blogId) return;
    onClose();
    navigate(`/view-blog/${blogId}`);
  };

  const handleViewAllComments = () => {
    onClose();
    navigate("/dashboard/comments");
  };

  if (!isOpen || !user) return null;

  const totalViews = userBlogs.reduce(
    (sum, blog) => sum + (blog?.views?.length || 0),
    0
  );

  const totalLikes = userBlogs.reduce(
    (sum, blog) => sum + (blog?.likes?.length || 0),
    0
  );

  const statCards = [
    { label: "Views", value: totalViews, icon: FiEye, onClick: null },
    { label: "Blogs", value: userBlogs.length, icon: FiBookOpen, onClick: null },
    {
      label: "Comments",
      value: userComments.length,
      icon: FiMessageCircle,
      onClick: handleViewAllComments,
    },
    { label: "Likes", value: totalLikes, icon: FiHeart, onClick: null },
  ];

  const socialLinks = [
    { key: "instagram", url: user.instagram, icon: FiInstagram, color: "text-pink-500", ring: "hover:ring-pink-500/30" },
    { key: "linkedin", url: user.linkedin, icon: FiLinkedin, color: "text-[#0A66C2]", ring: "hover:ring-[#0A66C2]/30" },
    { key: "github", url: user.github, icon: FiGithub, color: "text-gray-900 dark:text-white", ring: "hover:ring-gray-400/30" },
    { key: "facebook", url: user.facebook, icon: FiFacebook, color: "text-[#1877F2]", ring: "hover:ring-[#1877F2]/30" },
  ].filter((s) => s.url);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      {/* =====================================================
          WRAPPER — top margin so close button is visible
      ===================================================== */}
      <div className="min-h-full flex items-start justify-center px-3 md:px-6 pt-20 md:pt-24 pb-10">
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 flex flex-col w-full max-w-3xl max-h-[85vh] bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl text-gray-900 dark:text-white overflow-hidden"
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 md:top-4 md:right-4 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-gray-900/80 dark:bg-white/90 text-white dark:text-gray-900 shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
            <FiX className="w-4 h-4" />
          </button>

          {/* =====================================================
              HEADER — fixed, does not scroll
          ===================================================== */}
          <div className="relative z-20 flex-shrink-0">
            <div className="relative h-16 md:h-20 bg-gradient-to-r from-[oklch(0.71_0.2_46.45)] to-[oklch(0.8_0.15_60)] overflow-hidden">
              <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 bg-white/15 rounded-full blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </div>

            <div className="px-5 md:px-8 pb-5 flex flex-col sm:flex-row sm:items-end gap-4 -mt-8 md:-mt-10">
              <img
                src={getProfileImage(user.profilePic)}
                alt="profile"
                loading="eager"
                fetchPriority="high"
                className="w-20 h-20 md:w-24 md:h-24 z-1 rounded-full object-cover border-4 border-white dark:border-gray-900 shadow-lg flex-shrink-0"
                onError={(event) => {
                  event.currentTarget.src = userimg;
                }}
              />

              <div className="flex-1 min-w-0 pb-1">
                <h2 className="text-lg md:text-xl font-bold capitalize text-gray-900 dark:text-white truncate">
                  {user.firstName} {user.lastName}
                </h2>
                <a
                  href={`mailto:${user.email}`}
                  className="mt-0.5 flex items-center gap-1.5 text-xs md:text-sm text-gray-500 dark:text-gray-400 hover:text-[oklch(0.6_0.2_46.45)] transition truncate"
                >
                  <FiMail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </a>
              </div>

              {/* SOCIAL LINKS */}
              {socialLinks.length > 0 && (
                <div className="flex gap-2 flex-shrink-0">
                  {socialLinks.map(({ key, url, icon: Icon, color, ring }) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:ring-4 ${ring} hover:scale-110 transition-all duration-300`}
                    >
                      <Icon className={`${color} w-3.5 h-3.5`} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* =====================================================
              BODY — scrollable content
          ===================================================== */}
          <div className="flex-1 overflow-y-auto px-5 md:px-8 pb-6 md:pb-8">
            {user.bio && (
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                {user.bio}
              </p>
            )}

            {/* STATS CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {statCards.map(({ label, value, icon: Icon, onClick }) => (
                <div
                  key={label}
                  onClick={onClick || undefined}
                  className={`p-3 md:p-4 rounded-2xl text-center border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                    onClick ? "cursor-pointer" : ""
                  }`}
                >
                  <div className="mx-auto mb-1.5 w-7 h-7 rounded-full flex items-center justify-center bg-[oklch(0.71_0.2_46.45)]/10 text-[oklch(0.6_0.2_46.45)]">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white">
                    {loading ? "..." : value}
                  </h3>
                  <p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* BLOGS + COMMENTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-7">
              {/* BLOGS */}
              {!loading && userBlogs.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                    <FiBookOpen className="w-4 h-4 text-[oklch(0.6_0.2_46.45)]" />
                    Recent Blogs
                  </h3>

                  <div className="space-y-1.5">
                    {userBlogs.slice(0, 5).map((blog) => (
                      <div
                        key={blog._id}
                        onClick={() => handleViewBlog(blog._id)}
                        className="group flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/60 transition"
                      >
                        <img
                          src={getBlogImage(blog)}
                          alt={blog.title || "Blog"}
                          className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
                          onError={(event) => {
                            event.currentTarget.src =
                              "https://placehold.co/400x200/6366f1/white?text=No+Image";
                          }}
                        />

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {blog.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(blog.createdAt)}
                          </p>
                        </div>

                        <FiArrowRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-[oklch(0.6_0.2_46.45)] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* COMMENTS */}
              {!loading && userComments.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                    <FiMessageCircle className="w-4 h-4 text-[oklch(0.6_0.2_46.45)]" />
                    Recent Comments
                  </h3>

                  <div className="space-y-1.5">
                    {userComments.slice(0, 5).map((comment) => (
                      <div
                        key={comment._id}
                        onClick={() => {
                          if (comment.blog?._id) {
                            handleViewBlog(comment.blog._id);
                          }
                        }}
                        className="p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/70 transition"
                      >
                        <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 italic">
                          "{comment.text}"
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
                          on{" "}
                          <span className="font-medium text-gray-500 dark:text-gray-400">
                            {comment.blog?.title || "Deleted Blog"}
                          </span>{" "}
                          • {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* EMPTY STATE */}
            {!loading &&
              userBlogs.length === 0 &&
              userComments.length === 0 && (
                <div className="mt-7 text-center py-8 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    No blogs or comments yet.
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;