import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { API_BASE_URL } from "../utils/api";
import {
  getBlogImageFallback,
  getBlogImageUrl,
} from "../utils/profileImage";

import { setPublicBlogs } from "../redux/blogSlice";

import {
  Tag,
  Sparkles,
  RefreshCw,
  X,
  Calendar,
  User as UserIcon,
} from "lucide-react";

import Newsletter from "./Newsletter";

const BlogSideBar = () => {
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [suggestedBlogs, setSuggestedBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { publicBlogs } = useSelector((state) => state.blog);

  // =====================================================
  // GET BLOGS FROM REDUX OR DATABASE
  // =====================================================

  useEffect(() => {
    if (publicBlogs && publicBlogs.length > 0) {
      

      processBlogs(publicBlogs);
    } else {
      console.log(
        "🔄 Sidebar: No blogs in Redux, fetching from DB..."
      );

      fetchBlogsFromDB();
    }
  }, [publicBlogs]);

  // =====================================================
  // PROCESS BLOGS
  // =====================================================

  const processBlogs = (blogs) => {
    const publishedBlogs = blogs.filter(
      (blog) => blog?.isPublished === true
    );

    // Get unique categories
    const uniqueCategories = [
      ...new Set(
        publishedBlogs
          .map((item) => item?.category)
          .filter(Boolean)
      ),
    ];

    setCategories(uniqueCategories);

    // Random suggested blogs
    const randomBlogs = [...publishedBlogs]
      .filter((blog) => blog?._id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    setSuggestedBlogs(randomBlogs);
  };

  // =====================================================
  // FETCH BLOGS FROM DATABASE
  // =====================================================

  const fetchBlogsFromDB = async () => {
    try {
      setSidebarLoading(true);

      console.log("🔄 Sidebar: Fetching blogs from DB...");

      const { data } = await axios.get(
        `${API_BASE_URL}/api/v1/blog/feed`,
        {
          withCredentials: true,
          timeout: 30000,
        }
      );

      if (data?.success) {
        const publishedBlogs = (data.blogs || []).filter(
          (blog) => blog?.isPublished === true
        );

        console.log(
          `✅ Sidebar: ${publishedBlogs.length} blogs fetched from DB`
        );

        // Save blogs in Redux
        dispatch(setPublicBlogs(publishedBlogs));

        // Process blogs for sidebar
        processBlogs(publishedBlogs);
      } else {
        console.error(
          "❌ Sidebar: API returned success false"
        );
      }
    } catch (error) {
      console.error("❌ Sidebar fetch error:", error);

      toast.error("Failed to load blogs");
    } finally {
      setSidebarLoading(false);
    }
  };

  // =====================================================
  // HANDLE CATEGORY CLICK
  // =====================================================

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    const filteredBlogs = publicBlogs.filter(
      (blog) =>
        blog?.category === category &&
        blog?.isPublished === true
    );

    const randomFilteredBlogs = [...filteredBlogs]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    setSuggestedBlogs(randomFilteredBlogs);
  };

  // =====================================================
  // RESET TO ALL BLOGS
  // =====================================================

  const resetToAllBlogs = () => {
    setSelectedCategory("");

    const randomBlogs = [...publicBlogs]
      .filter(
        (blog) =>
          blog?._id &&
          blog?.isPublished === true
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    setSuggestedBlogs(randomBlogs);
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (sidebarLoading && publicBlogs.length === 0) {
    return (
      <div className="w-full">
        <div className="animate-pulse space-y-8">
          {/* Categories Skeleton */}
          <div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/5 mb-4"></div>

            <div className="flex flex-wrap gap-2">
              <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>

              <div className="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>

              <div className="h-7 w-14 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>

          {/* Newsletter Skeleton */}
          <div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>

            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-full mb-2"></div>

            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-full"></div>
          </div>

          {/* Suggested Blogs Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex gap-3"
              >
                <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>

                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>

                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col divide-y divide-gray-200 dark:divide-gray-800">

      {/* =====================================================
          CATEGORY SECTION
      ===================================================== */}

      <div className="py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            <Tag className="w-4 h-4 text-[oklch(0.6_0.2_46.45)]" />

            Popular Categories
          </h2>

          {selectedCategory && (
            <button
              onClick={resetToAllBlogs}
              className="flex items-center gap-1 text-xs font-medium text-[oklch(0.6_0.2_46.45)] hover:opacity-75 transition"
            >
              <X className="w-3 h-3" />

              Reset
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.length > 0 ? (
            categories.map((item) => {
              const isActive =
                selectedCategory === item;

              return (
                <button
                  key={item}
                  onClick={() =>
                    handleCategoryClick(item)
                  }
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-all duration-300 border ${
                    isActive
                      ? "bg-gradient-to-r from-[oklch(0.71_0.2_46.45)] to-[oklch(0.8_0.15_60)] text-white border-transparent shadow-sm"
                      : "bg-transparent text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[oklch(0.71_0.2_46.45)]/50 hover:text-[oklch(0.6_0.2_46.45)]"
                  }`}
                >
                  {item}
                </button>
              );
            })
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No categories found
            </p>
          )}
        </div>
      </div>

      {/* =====================================================
          SUBSCRIBE NEWSLETTER
          UI SAME AS ORIGINAL SIDEBAR
      ===================================================== */}

      <div className="py-6">
        <Newsletter />
      </div>

      {/* =====================================================
          SUGGESTED BLOGS SECTION
      ===================================================== */}

      <div className="py-6">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
          <Sparkles className="w-4 h-4 text-[oklch(0.6_0.2_46.45)]" />

          {selectedCategory
            ? `Suggested ${selectedCategory}`
            : "Suggested Blogs"}
        </h3>

        <div className="flex flex-col gap-1">
          {suggestedBlogs.length > 0 ? (
            suggestedBlogs.map((item) => (
              <div
                key={item._id}
                className="flex gap-3 items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/60 p-2 -mx-2 rounded-xl transition-colors duration-200"
                onClick={() => {
                  if (user) {
                    navigate(`/view-blog/${item._id}`);
                  } else {
                    navigate("/login");
                  }
                }}
              >
                <img
                  src={getBlogImageUrl(item)}
                  alt={item?.title}
                  className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.onerror = null;

                    e.currentTarget.src =
                      getBlogImageFallback(
                        item?.title || "Blog"
                      );
                  }}
                />

                <div className="flex flex-col flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug">
                    {item?.title}
                  </p>

                  <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1">
                      <UserIcon className="w-3 h-3" />

                      {item?.author?.firstName ||
                        "Unknown"}
                    </span>

                    <span>•</span>

                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />

                      {item?.createdAt
                        ? new Date(
                            item.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                            }
                          )
                        : "No date"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No blogs available in this category
            </p>
          )}
        </div>
      </div>

      {/* =====================================================
          REFRESH BUTTON
      ===================================================== */}

      <div className="py-6">
        <button
          onClick={fetchBlogsFromDB}
          disabled={sidebarLoading}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-[oklch(0.6_0.2_46.45)] disabled:opacity-50 transition-colors"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${
              sidebarLoading
                ? "animate-spin"
                : ""
            }`}
          />

          {sidebarLoading
            ? "Loading..."
            : "Refresh suggestions"}
        </button>
      </div>
    </div>
  );
};

export default BlogSideBar;