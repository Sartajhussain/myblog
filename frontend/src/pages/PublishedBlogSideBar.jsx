import React, { useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import { getBlogImage } from "../utils/getBlogImage";

const PublishedBlogSideBar = ({ blogs, setCategoryFilter }) => {
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState("");

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

  // 🔥 FIXED IMAGE FUNCTION - Using getBlogImage utility
  const getImage = (img) => {
    if (!img || img === "null" || img === "undefined" || img === "") {
      return "https://placehold.co/100x100?text=No+Image";
    }
    return getBlogImage(img);
  };

  return (
    <aside className="space-y-8 lg:sticky lg:top-24 h-fit">

      {/* CATEGORY DROPDOWN */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border dark:border-gray-700">

        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          Filter by Category
        </h2>

        <select
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

      </div>

      {/* POPULAR POSTS */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border dark:border-gray-700">

        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Popular Posts
        </h2>

        <div className="space-y-4">
          {popularPosts.map((post) => (
            <div
              key={post._id}
              className="flex gap-3 items-center cursor-pointer"
              onClick={() => navigate(`/view-blog/${post._id}`)}
            >

              {/* ✅ FIXED IMAGE - Now using getBlogImage utility */}
              <img
                src={getImage(post.thumbnail || post.image || post.coverImage)}
                alt={post.title}
                className="w-14 h-14 object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/100x100?text=No+Image";
                }}
              />

              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {post.title}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* TRENDING TAGS */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border dark:border-gray-700">

        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Trending Tags
        </h2>

        <div className="flex flex-wrap gap-2">
          {categories.slice(1).map((tag, index) => (
            <span
              key={index}
              onClick={() => {
                setCategoryFilter(tag);
                setActiveTag(tag);
              }}
              className={`text-xs px-3 py-1 rounded-full cursor-pointer transition
        ${activeTag === tag
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-black hover:text-white"
                }
      `}
            >
              {tag}
            </span>
          ))}
        </div>

      </div>

    </aside>
  );
};

export default PublishedBlogSideBar;