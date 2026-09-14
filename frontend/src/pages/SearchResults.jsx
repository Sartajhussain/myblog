import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSearch, FiArrowLeft, FiEye, FiHeart } from "react-icons/fi";
import { API_BASE_URL } from "../utils/api";
import { getBlogImage } from "../utils/getBlogImage";
import Skeleton from "../components/Skeleton";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH BLOGS
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          `${API_BASE_URL}/api/v1/blog/feed`,
          { withCredentials: true }
        );

        if (data?.success) {
          const published = (data.blogs || []).filter(
            (b) => b.isPublished === true
          );

          // Filter by query (title, subtitle, category)
          const q = query.trim().toLowerCase();
          const filtered = q
            ? published.filter(
                (b) =>
                  b.title?.toLowerCase().includes(q) ||
                  b.subtitle?.toLowerCase().includes(q) ||
                  b.category?.toLowerCase().includes(q) ||
                  b.author?.firstName?.toLowerCase().includes(q) ||
                  b.author?.lastName?.toLowerCase().includes(q)
              )
            : published;

          setBlogs(filtered);
        }
      } catch (error) {
        console.error("Search results error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [query]);

  // ✅ SCROLL TO TOP
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 px-4 md:px-8 py-10 transition-colors duration-300">

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
          MAIN CONTENT
      ===================================================== */}
      <div className="relative z-10 max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8 mt-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
            aria-label="Go back"
          >
            <FiArrowLeft className="w-4 h-4 text-gray-700 dark:text-gray-200" />
          </button>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Search Results
            </h1>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {loading
                ? "Searching..."
                : `${blogs.length} result${blogs.length !== 1 ? "s" : ""} for `}
              {!loading && (
                <span className="font-semibold text-[oklch(0.71_0.2_46.45)]">
                  "{query}"
                </span>
              )}
            </p>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <Skeleton
            type="blogCard"
            count={6}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          />
        )}

        {/* EMPTY */}
        {!loading && blogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-5 rounded-full bg-[oklch(0.71_0.2_46.45)]/10 mb-4">
              <FiSearch className="w-8 h-8 text-[oklch(0.71_0.2_46.45)]" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              No blogs found
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
              We couldn't find any blogs matching{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                "{query}"
              </span>
              . Try different keywords.
            </p>
            <button
              onClick={() => navigate("/blogs")}
              className="mt-6 px-5 py-2.5 rounded-xl bg-[oklch(0.71_0.2_46.45)] hover:bg-[oklch(0.65_0.2_46.45)] text-white font-medium text-sm transition"
            >
              Browse All Blogs
            </button>
          </div>
        )}

        {/* BLOGS LIST */}
        {!loading && blogs.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                onClick={() => navigate(`/view-blog/${blog._id}`)}
                className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 dark:border-slate-700 flex flex-col"
              >
                {/* IMAGE */}
                <div className="relative overflow-hidden h-48">
                  <img
                    src={getBlogImage(
                      blog.thumbnail || blog.image || blog.coverImage
                    )}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/600x400?text=No+Image";
                    }}
                  />

                  {/* Category badge */}
                  {blog.category && (
                    <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-[oklch(0.71_0.2_46.45)] text-white shadow-sm">
                      {blog.category}
                    </span>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[oklch(0.71_0.2_46.45)] transition-colors">
                    {blog.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-2 flex-1">
                    {blog.subtitle || "Click to read more..."}
                  </p>

                  {/* META */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-slate-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      By {blog.author?.firstName || "Admin"}{" "}
                      {blog.author?.lastName || ""}
                    </span>

                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {formatDate(blog.createdAt)}
                    </span>
                  </div>

                  {/* STATS */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <FiHeart className="w-3.5 h-3.5 text-red-500" />
                      {blog.likes?.length || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiEye className="w-3.5 h-3.5" />
                      {blog.views?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;