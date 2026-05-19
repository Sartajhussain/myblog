import React from "react";
import toast from "react-hot-toast";
import BlogCard from "../components/blog/BlogCard";
import Skeleton from "../components/Skeleton";

import { useSelector } from "react-redux";

const PublicFeed = () => {

  // ✅ REDUX DATA
  const { publicBlogs = [] } = useSelector(
    (state) => state.blog
  );

  const loading = false;

  return (
    <div className="min-h-screen mt-[30px] bg-gray-50 dark:bg-gray-900 px-4 py-10 relative">
      
      <div className="max-w-3xl mx-auto space-y-10">

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Public Feed
        </h1>

        {loading ? (
          <div className="space-y-6">
            <Skeleton
              type="blogCard"
              count={4}
            />
          </div>
        ) : publicBlogs.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No blogs found
          </p>
        ) : (
          publicBlogs.map((blog) => (
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