import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBlogImage } from "../utils/getBlogImage";
import { Filter, Flame, Tag, Calendar } from "lucide-react";

const PublishedBlogSideBar = ({ blogs, setCategoryFilter }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");

  const publishedBlogs = blogs?.filter((b) => b.isPublished) || [];

  const categories = [
    "All",
    ...new Set(publishedBlogs.map((b) => b.category).filter(Boolean)),
  ];

  const popularPosts = [...publishedBlogs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 🔥 FIXED IMAGE FUNCTION
  const getImage = (img) => {
    if (!img || img === "null" || img === "undefined" || img === "") {
      return "https://placehold.co/100x100?text=No+Image";
    }
    return getBlogImage(img);
  };

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    setCategoryFilter(cat);
  };

  return (
    <aside className="space-y-6 lg:sticky lg:top-24 h-fit">

      {/* CATEGORY FILTER */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
          <Filter className="w-4 h-4 text-[oklch(0.6_0.2_46.45)]" />
          Filter by Category
        </h2>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat, index) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={index}
                onClick={() => handleCategorySelect(cat)}
                className={`text-xs font-medium capitalize px-3.5 py-1.5 rounded-full border transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-[oklch(0.71_0.2_46.45)] to-[oklch(0.8_0.15_60)] text-white border-transparent shadow-sm"
                    : "bg-transparent text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[oklch(0.71_0.2_46.45)]/50 hover:text-[oklch(0.6_0.2_46.45)]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* POPULAR POSTS */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
          <Flame className="w-4 h-4 text-[oklch(0.6_0.2_46.45)]" />
          Popular Posts
        </h2>

        {popularPosts.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No posts yet.
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {popularPosts.map((post) => (
              <div
                key={post._id}
                className="flex gap-3 items-center cursor-pointer group p-2 -mx-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors"
                onClick={() => navigate(`/view-blog/${post._id}`)}
              >
                <img
                  src={getImage(
                    post.thumbnail || post.image || post.coverImage
                  )}
                  alt={post.title}
                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/100x100?text=No+Image";
                  }}
                />

                <div className="min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-snug group-hover:text-[oklch(0.6_0.2_46.45)] transition-colors">
                    {post.title}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })
                      : "No date"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TRENDING TAGS */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
          <Tag className="w-4 h-4 text-[oklch(0.6_0.2_46.45)]" />
          Trending Tags
        </h2>

        {categories.length <= 1 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No tags yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.slice(1).map((tag, index) => {
              const isActive = activeCategory === tag;
              return (
                <span
                  key={index}
                  onClick={() => handleCategorySelect(tag)}
                  className={`text-xs px-3 py-1 rounded-full cursor-pointer transition-all duration-200 capitalize
                    ${
                      isActive
                        ? "bg-[oklch(0.71_0.2_46.45)] text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[oklch(0.71_0.2_46.45)] hover:text-white"
                    }
                  `}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};

export default PublishedBlogSideBar;