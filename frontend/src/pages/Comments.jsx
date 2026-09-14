import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import { getProfileImage } from "../utils/profileImage";
import userimg from "../assets/userprofile.png";
import UserProfileModal from "../components/UserProfileModal"; // ✅ IMPORT

// ✅ Module-level cache
const commentsCache = {};

const Comments = () => {
  const { user } = useSelector((state) => state.auth);
  const cached = commentsCache[1];

  const [allComments, setAllComments] = useState(cached?.comments || []);
  const [totalPages, setTotalPages] = useState(cached?.totalPages || 1);
  const [loading, setLoading] = useState(!cached);
  const [page, setPage] = useState(1);

  // ✅ MODAL STATE
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUserClick = (userData) => {
    if (!userData?._id) return;
    setSelectedUser(userData);
    setIsModalOpen(true);
  };

  // ✅ IMAGE URL
  const getCorrectImageUrl = (blog) => {
    const imagePath = blog?.thumbnail || blog?.image || blog?.coverImage;

    if (
      !imagePath ||
      imagePath === "null" ||
      imagePath === "undefined" ||
      imagePath === ""
    ) {
      return "https://placehold.co/100x100/6366f1/white?text=No+Image";
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

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      blog?.title || "Blog"
    )}&background=6366f1&color=fff&size=100`;
  };

  // ✅ FETCH COMMENTS
  const fetchComments = async (targetPage, isBackgroundRefresh = false) => {
    if (!user) {
      setAllComments([]);
      setTotalPages(1);
      setLoading(false);
      return;
    }

    try {
      if (!isBackgroundRefresh) {
        setLoading(true);
      }

      const res = await axios.get(
        `${API_BASE_URL}/api/v1/comment/my-blogs?page=${targetPage}&limit=5`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const validComments = (res.data.comments || []).filter(
          (comment) => comment.blog?._id && comment.blog?._id !== "undefined"
        );

        const fetchedTotalPages =
          res.data.totalPages ||
          Math.ceil((res.data.totalComments || validComments.length) / 5) ||
          1;

        setAllComments(validComments);
        setTotalPages(fetchedTotalPages);

        commentsCache[targetPage] = {
          comments: validComments,
          totalPages: fetchedTotalPages,
        };
      }
    } catch (err) {
      console.log("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const pageCache = commentsCache[page];

    if (pageCache) {
      setAllComments(pageCache.comments);
      setTotalPages(pageCache.totalPages);
      setLoading(false);
      fetchComments(page, true);
    } else {
      fetchComments(page, false);
    }
  }, [page, user]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // ✅ PAGINATION NUMBERS
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  // =====================================================
  // BACKGROUND GLOW
  // =====================================================
  const BackgroundGlow = () => (
    <>
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
    </>
  );

  // ✅ LOADING
  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <BackgroundGlow />

        <div className="relative z-10">
          <div className="h-7 w-48 bg-gray-200 dark:bg-slate-700 rounded-lg mb-4 sm:mb-5 animate-pulse"></div>
          <div className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-md animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full animate-pulse"></div>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded-md animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 px-3 sm:px-4 md:px-6 py-4 sm:py-6 transition-colors duration-300">
        <BackgroundGlow />

        <div className="relative z-10">
          <h2 className="text-sm mt-10 sm:text-base md:text-lg font-semibold mb-4 sm:mb-5 text-gray-800 dark:text-white flex items-center justify-between">
            <span>All Blog's Comments</span>
            <span className="text-xs px-2.5 py-1 bg-[oklch(0.71_0.2_46.45)]/10 dark:bg-[oklch(0.71_0.2_46.45)]/20 text-[oklch(0.71_0.2_46.45)] rounded-full border border-[oklch(0.71_0.2_46.45)]/30">
              Showing {allComments.length} items
            </span>
          </h2>

          <div className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm">
            {allComments.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                No comments found
              </div>
            ) : (
              <>
                {/* ================= DESKTOP TABLE ================= */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                      <tr>
                        <th className="px-4 py-3 text-left">Blog</th>
                        <th className="px-4 py-3 text-left">User</th>
                        <th className="px-4 py-3 text-left">Comment</th>
                        <th className="px-4 py-3 text-center">View</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                      {allComments.map((comment) => {
                        const blogId = comment.blog?._id;
                        const isValidBlogId =
                          blogId && blogId !== "undefined";

                        return (
                          <tr
                            key={comment._id}
                            className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={getCorrectImageUrl(comment.blog)}
                                  alt={comment.blog?.title}
                                  className="w-10 h-10 rounded-md object-cover border border-gray-100 dark:border-slate-700"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://placehold.co/100x100/6366f1/white?text=No+Image";
                                  }}
                                />
                                <span className="truncate max-w-[160px] font-medium text-gray-800 dark:text-gray-200">
                                  {comment.blog?.title || "Unknown Blog"}
                                </span>
                              </div>
                            </td>

                            {/* ✅ USER — CLICKABLE */}
                            <td className="px-4 py-3">
                              <button
                                onClick={() =>
                                  handleUserClick(comment.user)
                                }
                                className="flex items-center gap-2 group cursor-pointer"
                              >
                                <img
                                  src={getProfileImage(
                                    comment.user?.profilePic
                                  )}
                                  alt={comment.user?.firstName || "user"}
                                  className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[oklch(0.71_0.2_46.45)]/40 transition-all"
                                  onError={(e) => {
                                    e.currentTarget.src = userimg;
                                  }}
                                />
                                <span className="text-gray-700 dark:text-gray-300 font-medium capitalize group-hover:text-[oklch(0.71_0.2_46.45)] transition-colors">
                                  {comment.user?.firstName || "Unknown"}{" "}
                                  {comment.user?.lastName || ""}
                                </span>
                              </button>
                            </td>

                            <td className="px-4 py-3">
                              <p className="text-gray-700 dark:text-gray-300 max-w-[300px] break-words">
                                {comment.text}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {comment.createdAt &&
                                  new Date(
                                    comment.createdAt
                                  ).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                              </p>
                            </td>

                            <td className="px-4 py-3 text-center">
                              {isValidBlogId ? (
                                <Link
                                  to={`/view-blog/${blogId}`}
                                  className="inline-flex items-center gap-1 text-[oklch(0.71_0.2_46.45)] hover:text-[oklch(0.65_0.2_46.45)] transition"
                                >
                                  <ExternalLink size={16} />
                                </Link>
                              ) : (
                                <span className="text-gray-400 text-xs">
                                  Blog deleted
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* ================= MOBILE CARDS ================= */}
                <div className="md:hidden divide-y divide-gray-200 dark:divide-slate-700">
                  {allComments.map((comment) => {
                    const blogId = comment.blog?._id;
                    const isValidBlogId =
                      blogId && blogId !== "undefined";

                    return (
                      <div
                        key={comment._id}
                        className="p-4 flex gap-3 items-start"
                      >
                        <img
                          src={getCorrectImageUrl(comment.blog)}
                          alt={comment.blog?.title}
                          className="w-12 h-12 rounded-md object-cover flex-shrink-0 border border-gray-100 dark:border-slate-700"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/100x100/6366f1/white?text=No+Image";
                          }}
                        />

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-white break-words line-clamp-2">
                            {comment.blog?.title || "Unknown Blog"}
                          </p>

                          {/* ✅ USER — CLICKABLE */}
                          <button
                            onClick={() => handleUserClick(comment.user)}
                            className="flex items-center gap-2 mt-1.5 group cursor-pointer"
                          >
                            <img
                              src={getProfileImage(comment.user?.profilePic)}
                              alt={comment.user?.firstName || "user"}
                              className="w-6 h-6 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[oklch(0.71_0.2_46.45)]/40 transition-all"
                              onError={(e) => {
                                e.currentTarget.src = userimg;
                              }}
                            />
                            <span className="text-xs text-gray-600 dark:text-gray-400 capitalize group-hover:text-[oklch(0.71_0.2_46.45)] transition-colors">
                              by {comment.user?.firstName || "Unknown"}{" "}
                              {comment.user?.lastName || ""}
                            </span>
                          </button>

                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 break-words">
                            {comment.text}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            {comment.createdAt &&
                              new Date(
                                comment.createdAt
                              ).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                          </p>
                        </div>

                        {isValidBlogId ? (
                          <Link
                            to={`/view-blog/${blogId}`}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition flex-shrink-0"
                          >
                            <ExternalLink size={16} />
                          </Link>
                        ) : (
                          <span className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 flex-shrink-0 text-gray-400">
                            <ExternalLink size={16} />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* ================= PAGINATION ================= */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3.5 border-t border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/40">
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium order-2 sm:order-1">
                    Page{" "}
                    <strong className="text-gray-800 dark:text-gray-200">
                      {page}
                    </strong>{" "}
                    of{" "}
                    <strong className="text-gray-800 dark:text-gray-200">
                      {totalPages}
                    </strong>
                  </span>

                  <div className="flex items-center gap-1.5 order-1 sm:order-2">
                    <button
                      disabled={page === 1}
                      onClick={() =>
                        setPage((prev) => Math.max(prev - 1, 1))
                      }
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <ChevronLeft size={16} />
                      <span className="hidden sm:inline">Prev</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((num, idx) =>
                        num === "..." ? (
                          <span
                            key={idx}
                            className="px-2 py-1 text-gray-400 text-xs sm:text-sm select-none"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={idx}
                            onClick={() => setPage(num)}
                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${
                              page === num
                                ? "bg-[oklch(0.71_0.2_46.45)] text-white shadow-sm shadow-[oklch(0.71_0.2_46.45)]/30"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 bg-transparent"
                            }`}
                          >
                            {num}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      disabled={page === totalPages}
                      onClick={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ✅ USER PROFILE MODAL */}
      <UserProfileModal
        isOpen={isModalOpen}
        user={selectedUser}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Comments;