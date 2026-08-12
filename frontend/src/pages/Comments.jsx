import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Skeleton from "../components/Skeleton";

// ✅ Module-level cache — keyed by page number, survives unmount/remount
const commentsCache = {};

const Comments = () => {
  const { user } = useSelector((state) => state.auth);
  const cached = commentsCache[1];

  const [allComments, setAllComments] = useState(cached?.comments || []);
  const [totalPages, setTotalPages] = useState(cached?.totalPages || 1);
  const [loading, setLoading] = useState(!cached);
  const [page, setPage] = useState(1);

  // ✅ FUNCTION TO GET CORRECT IMAGE URL
  const getCorrectImageUrl = (blog) => {
    const imagePath = blog?.thumbnail || blog?.image || blog?.coverImage;

    if (!imagePath || imagePath === "null" || imagePath === "undefined" || imagePath === "") {
      return "https://placehold.co/100x100/6366f1/white?text=No+Image";
    }

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    if (imagePath.startsWith('/uploads')) {
      return `${API_BASE_URL}${imagePath}`;
    }

    if (imagePath.startsWith('uploads')) {
      return `${API_BASE_URL}/${imagePath}`;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(blog?.title || 'Blog')}&background=6366f1&color=fff&size=100`;
  };

  // ✅ FETCH COMMENTS FROM DB
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
        `${API_BASE_URL}/api/v1/comment/my-blogs?page=${targetPage}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const validComments = (res.data.comments || []).filter(
          (comment) => comment.blog?._id && comment.blog?._id !== "undefined"
        );

        const newTotalPages = res.data.totalPages || 1;

        setAllComments(validComments);
        setTotalPages(newTotalPages);

        commentsCache[targetPage] = {
          comments: validComments,
          totalPages: newTotalPages,
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

    window.scrollTo(0, 0);
  }, [page, user]);

  // ✅ LOADING STATE - FIXED SKELETON
  if (loading) {
    return (
      <div className="min-h-screen px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <div className="h-7 w-48 bg-gray-200 dark:bg-slate-700 rounded-lg mb-4 sm:mb-5 animate-pulse"></div>
        <div className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
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
    );
  }

  return (
    <div className="min-h-screen px-3 sm:px-4 md:px-6 py-4 sm:py-6">

      <h2 className="text-sm mt-10 sm:text-base md:text-lg font-semibold mb-4 sm:mb-5 text-gray-800 dark:text-white">
        All Blog's Comments ({allComments.length})
      </h2>

      <div className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">

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
                    const isValidBlogId = blogId && blogId !== "undefined";

                    return (
                      <tr key={comment._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={getCorrectImageUrl(comment.blog)}
                              alt={comment.blog?.title}
                              className="w-10 h-10 rounded-md object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/100x100/6366f1/white?text=No+Image";
                              }}
                            />
                            <span className="truncate max-w-[160px] font-medium">
                              {comment.blog?.title || "Unknown Blog"}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          {comment.user?.firstName || "Unknown"} {comment.user?.lastName || ""}
                        </td>

                        <td className="px-4 py-3">
                          <p className="text-gray-700 dark:text-gray-300 max-w-[300px] break-words">
                            {comment.text}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {comment.createdAt && new Date(comment.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </p>
                        </td>

                        <td className="px-4 py-3 text-center">
                          {isValidBlogId ? (
                            <Link
                              to={`/view-blog/${blogId}`}
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <ExternalLink size={16} />
                            </Link>
                          ) : (
                            <span className="text-gray-400 text-xs">Blog deleted</span>
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
                const isValidBlogId = blogId && blogId !== "undefined";

                return (
                  <div key={comment._id} className="p-4 flex gap-3 items-start">

                    <img
                      src={getCorrectImageUrl(comment.blog)}
                      alt={comment.blog?.title}
                      className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/100x100/6366f1/white?text=No+Image";
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-white break-words line-clamp-2">
                        {comment.blog?.title || "Unknown Blog"}
                      </p>

                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        by {comment.user?.firstName || "Unknown"} {comment.user?.lastName || ""}
                      </p>

                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 break-words">
                        {comment.text}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {comment.createdAt && new Date(comment.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>

                    {isValidBlogId ? (
                      <Link
                        to={`/view-blog/${blogId}`}
                        className="p-2 rounded-md bg-gray-100 dark:bg-slate-700 flex-shrink-0"
                      >
                        <ExternalLink size={16} />
                      </Link>
                    ) : (
                      <span className="p-2 rounded-md bg-gray-100 dark:bg-slate-700 flex-shrink-0 text-gray-400">
                        <ExternalLink size={16} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ================= PAGINATION ================= */}
            {totalPages > 1 && (
              <div className="flex justify-center py-4">
                <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-gray-200 dark:border-slate-700">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="p-1 rounded-full disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {page} / {totalPages}
                  </span>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="p-1 rounded-full disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Comments;