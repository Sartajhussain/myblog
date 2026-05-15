import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import BlogCard from "../components/blog/BlogCard";
import Skeleton from "../components/Skeleton";
import { API_BASE_URL } from "../utils/api";

const PublicFeed = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/v1/blog/feed`,
        { withCredentials: true }
      );

      if (data.success) {
        setBlogs(data.blogs || []);
      }
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

      <div className="max-w-3xl mx-auto space-y-10">

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Public Feed
        </h1>

        {loading ? (
          <div className="space-y-6">
            <Skeleton type="blogCard" count={4} />
          </div>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs found</p>
        ) : (
          blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
            />
          ))
        )}

      </div>
    </div>
  );
};

export default PublicFeed;