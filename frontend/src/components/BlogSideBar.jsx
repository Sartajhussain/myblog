import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Badge } from "../components/ui/badge";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../utils/api";
import { setPublicBlogs } from "../redux/blogSlice";

const BlogSideBar = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [suggestedBlogs, setSuggestedBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // ✅ REDUX se blogs lo
  const { publicBlogs } = useSelector((state) => state.blog);
  
  // ✅ Agar Redux me blogs nahi hai toh DB se fetch karo
  useEffect(() => {
    if (publicBlogs && publicBlogs.length > 0) {
      // Redux me already blogs hai
      console.log("✅ Sidebar: Using blogs from Redux:", publicBlogs.length);
      processBlogs(publicBlogs);
    } else {
      // Redux me nahi hai, DB se fetch karo
      console.log("🔄 Sidebar: No blogs in Redux, fetching from DB...");
      fetchBlogsFromDB();
    }
  }, [publicBlogs]);

  // ✅ Process blogs - extract categories and suggested
  const processBlogs = (blogs) => {
    const publishedBlogs = blogs.filter(blog => blog?.isPublished === true);
    
    // Extract unique categories
    const uniqueCategories = [...new Set(
      publishedBlogs.map((item) => item?.category).filter(Boolean)
    )];
    setCategories(uniqueCategories);
    
    // Set suggested blogs (random 4)
    const randomBlogs = [...publishedBlogs]
      .filter((b) => b?._id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    setSuggestedBlogs(randomBlogs);
  };

  // ✅ FETCH BLOGS FROM DB AND UPDATE REDUX
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
          (blog) => blog.isPublished === true
        );
        
        console.log(`✅ Sidebar: ${publishedBlogs.length} blogs fetched from DB`);
        
        // ✅ Update Redux store
        dispatch(setPublicBlogs(publishedBlogs));
        
        // Process blogs
        processBlogs(publishedBlogs);
      } else {
        console.error("❌ Sidebar: API returned success false");
      }
    } catch (error) {
      console.error("❌ Sidebar fetch error:", error);
      toast.error("Failed to load blogs");
    } finally {
      setSidebarLoading(false);
    }
  };

  /* =======================
     SUBSCRIBE
  ======================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Email required");

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE_URL}/api/v1/subscribe`,
        { email },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Subscribed successfully 🎉");
        setEmail("");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error subscribing"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     GET CORRECT IMAGE URL
  ======================= */
  const getCorrectImageUrl = (blog) => {
    const imagePath = blog?.thumbnail || blog?.image || blog?.coverImage;
    
    if (!imagePath || imagePath === "null" || imagePath === "undefined") {
      return "https://placehold.co/100x100/6366f1/white?text=No+Image";
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/uploads') || imagePath.startsWith('uploads')) {
      return `${API_BASE_URL}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
    }
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(blog?.title || 'Blog')}&background=6366f1&color=fff&size=100`;
  };

  /* =======================
     HANDLE CATEGORY CLICK
  ======================= */
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    
    const filteredBlogs = publicBlogs.filter(blog => blog?.category === category && blog?.isPublished === true);
    const randomFilteredBlogs = [...filteredBlogs]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    setSuggestedBlogs(randomFilteredBlogs);
  };

  /* =======================
     RESET TO ALL BLOGS
  ======================= */
  const resetToAllBlogs = () => {
    setSelectedCategory("");
    const randomBlogs = [...publicBlogs]
      .filter((b) => b?._id && b?.isPublished === true)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    setSuggestedBlogs(randomBlogs);
  };

  // ✅ Loading state
  if (sidebarLoading && publicBlogs.length === 0) {
    return (
      <div className="w-full md:w-[300px] bg-white dark:bg-gray-800 p-4 md:p-5 rounded-lg shadow md:block">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex gap-3">
              <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-[300px] bg-white dark:bg-gray-800 p-4 md:p-5 rounded-lg shadow md:block">

      {/* CATEGORY SECTION */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg md:text-xl font-semibold dark:text-white">
          Popular Categories
        </h2>
        {selectedCategory && (
          <button 
            onClick={resetToAllBlogs}
            className="text-xs text-blue-500 hover:text-blue-700"
          >
            Reset
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-4 md:mt-5">
        {categories.length > 0 ? (
          categories.map((item, index) => (
            <Badge
              key={index}
              onClick={() => handleCategoryClick(item)}
              className={`cursor-pointer rounded-md px-3 py-1 capitalize transition
              ${
                selectedCategory === item
                  ? "bg-gray-200 text-black dark:bg-gray-700 dark:text-white"
                  : "bg-black text-white dark:bg-white dark:text-black hover:opacity-80"
              }`}
            >
              {item}
            </Badge>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No categories found
          </p>
        )}
      </div>

      {/* SUBSCRIBE SECTION */}
      <div className="mt-8 md:mt-10">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
          Subscribe Newsletter
        </h3>

        <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
          Get latest updates in your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 transition px-5 py-2 rounded-lg text-white dark:text-black font-medium"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>

      {/* SUGGESTED BLOGS SECTION */}
      <div className="mt-8 md:mt-10">
        <h3 className="text-sm font-semibold dark:text-white mb-4">
          {selectedCategory ? `Suggested ${selectedCategory} Blogs` : "Suggested Blogs"}
        </h3>

        <div className="flex flex-col gap-3">
          {suggestedBlogs.length > 0 ? (
            suggestedBlogs.map((item) => (
              <div
                key={item._id}
                className="flex gap-3 items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded transition"
                onClick={() => {
                  if (user) navigate(`/view-blog/${item._id}`);
                  else navigate("/login");
                }}
              >
                <img
                  src={getCorrectImageUrl(item)}
                  alt={item?.title}
                  className="w-14 h-14 object-cover rounded"
                  onError={(e) => {
                    console.error(`Image failed for: ${item?.title}`);
                    e.currentTarget.src = "https://placehold.co/100x100/6366f1/white?text=Error";
                  }}
                />

                <div className="flex flex-col flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
                    {item?.title}
                  </p>

                  <div className="text-[11px] text-gray-500 dark:text-gray-400 flex gap-2 mt-1">
                    <span>
                      {item?.author?.firstName || "Unknown"}
                    </span>
                    <span>•</span>
                    <span>
                      {item?.createdAt ? new Date(item?.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      }) : "No date"}
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

      {/* REFRESH BUTTON */}
      <button
        onClick={fetchBlogsFromDB}
        disabled={sidebarLoading}
        className="mt-6 w-full text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50"
      >
        {sidebarLoading ? "Loading..." : "🔄 Refresh suggestions"}
      </button>
    </div>
  );
};

export default BlogSideBar;