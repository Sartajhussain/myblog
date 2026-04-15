import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import BlogCard from "../components/blog/BlogCard";

const PublicFeed = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/v1/blog/feed",
        { withCredentials: true }
      );

      if (data.success) setBlogs(data.blogs);
    } catch (err) {
      toast.error("Error fetching feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <div className="min-h-screen mt-[30px] bg-gray-50 dark:bg-gray-900 px-4 py-10 relative">

      {/* 🔥 Loading GIF Overlay */}
     {loading && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
    <div className="w-16 h-16 border-4 border-gray-300 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin"></div>
  </div>
)}

      <div className="max-w-3xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Public Feed
        </h1>

        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog}  />
        ))}
      </div>
    </div>
  );
};

export default PublicFeed;