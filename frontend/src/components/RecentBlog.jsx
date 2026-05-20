import React from "react";
import BlogList from "./BlogList";
import BlogSideBar from "./BlogSideBar";
import { API_BASE_URL } from "../utils/api";

const RecentBlog = ({ blogs = [] }) => {
  
  // ✅ Function to fix image URLs - same as Home component
  const getCorrectImageUrl = (blog) => {
    // Try all possible image fields
    const imagePath = blog.thumbnail || blog.image || blog.coverImage;
    
    if (!imagePath) {
      return "https://placehold.co/600x400/6366f1/white?text=Blog+Image";
    }
    
    // If it's already a full URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a local path from backend
    if (imagePath.startsWith('/uploads') || imagePath.startsWith('uploads')) {
      return `${API_BASE_URL}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
    }
    
    // Default fallback
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.title || 'Blog')}&background=6366f1&color=fff&size=400`;
  };

  // ✅ Process blogs with correct image URLs
  const processedBlogs = blogs.map(blog => ({
    ...blog,
    imageUrl: getCorrectImageUrl(blog)
  }));

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-600 transition-colors duration-300">

      {/* TITLE */}
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 text-center py-10">
        Welcome ✨ The People of the Kingdom

        <hr className="w-2/3 md:w-1/3 border-t-4 border-gray-900 mx-auto mt-4" />
      </h2>

      {/* MAIN SECTION */}
      <div className="w-full md:max-w-7xl mx-auto px-4 md:px-20 py-10 flex flex-col md:flex-row gap-4 md:gap-10">

        {/* BLOG LIST */}
        <div className="flex-1">
          {blogs && blogs.length > 0 ? (
            blogs.slice(0, 4).map((item, index) => (
              <BlogList 
                key={item._id || index} 
                blog={{
                  ...item,
                  thumbnail: getCorrectImageUrl(item) // Pass fixed image URL
                }} 
              />
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-10">No blogs available</p>
          )}
        </div>

        {/* SIDEBAR */}
        <BlogSideBar />

      </div>

    </div>
  );
};

export default RecentBlog;