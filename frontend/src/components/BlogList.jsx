import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const BlogList = ({ blog }) => {
  const { user } = useSelector((state) => state.auth);



  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition flex flex-col md:flex-row gap-4 p-3 mb-4">

      {/* BLOG IMAGE */}

      <img
        src={blog.thumbnail}
        alt={blog.title}
        className="w-full md:w-48 h-40 md:h-32 object-cover rounded-lg"
      />

      {/* BLOG CONTENT */}

      <div className="flex flex-col flex-1 justify-between">

        <div>
          <h2 className="text-sm md:text-base font-semibold capitalize text-gray-900 dark:text-gray-100 line-clamp-2">
            {blog.title}
          </h2>

          <p className="text-xs text-gray-600 dark:text-gray-300 capitalize line-clamp-2">
            {blog.subtitle}
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            {new Date(blog.createdAt).toDateString()}
          </p>
        </div>


        <div className="flex items-center justify-between mt-3">

          <button
            onClick={() => {
              if (user) {
                navigate(`/view-blog/${blog._id}`);
              } else {
                navigate("/login");
              }
            }}
            className="text-xs bg-black text-white px-3 py-2 rounded hover:bg-gray-900 transition"
          >
            Read More
          </button>

        </div>

      </div>

    </div>
  );
};

export default BlogList;