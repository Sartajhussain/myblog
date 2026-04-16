import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Badge } from "../components/ui/badge";
import { useNavigate } from "react-router-dom";

const BlogSideBar = () => {
  const [email, setEmail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  const { blog = [] } = useSelector((store) => store.blog || {});
  const { user } = useSelector((state) => state.auth);

  console.log("BLOG DATA:", blog);

  // ✅ FIX: safe category extraction
  const categories = [...new Set(blog.map((item) => item.category).filter(Boolean))];

  // ✅ FIX: safe suggested blogs
  const suggestedBlogs = [...blog]
    .filter((b) => b?.thumbnail && b?.title)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  return (
    <div className="w-full md:w-[300px] bg-white dark:bg-gray-800 p-4 md:p-5 rounded-lg shadow md:block">

      {/* CATEGORIES */}
      <h2 className="text-lg md:text-xl font-semibold dark:text-white">
        Popular Categories
      </h2>

      <div className="flex flex-wrap gap-2 mt-4 md:mt-5">

        {categories.length > 0 ? (
          categories.map((item, index) => (
            <Badge
              key={index}
              onClick={() => setSelectedCategory(item)}
              className="cursor-pointer rounded-md px-3 py-1 dark:bg-white dark:text-black capitalize bg-black text-white"
            >
              {item}
            </Badge>
          ))
        ) : (
          <p className="text-sm text-gray-400">No categories found</p>
        )}

      </div>

      {/* SUBSCRIBE */}
      <div className="mt-8 md:mt-10">

        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
          Subscribe
        </h3>

        <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
          Get latest blog updates directly in your inbox.
        </p>

        <form className="flex flex-col gap-3">

          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900"
            required
          />

          <button
            type="submit"
            className="bg-black dark:bg-white px-5 py-2 rounded-lg text-white dark:text-black"
          >
            Subscribe
          </button>

        </form>
      </div>

      {/* SUGGESTED BLOG */}
      <div className="mt-8 md:mt-10">

        <h3 className="text-sm font-semibold dark:text-white mb-4">
          Suggested Blogs
        </h3>

        <div className="flex flex-col gap-3">

          {suggestedBlogs.length > 0 ? (
            suggestedBlogs.map((item) => (
              <div
                key={item._id}
                className="flex gap-3 items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded"
                onClick={() => {
                  if (user) {
                    navigate(`/view-blog/${item._id}`);
                  } else {
                    navigate("/login");
                  }
                }}
              >

                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-14 h-14 object-cover rounded"
                />

                <p className="text-sm font-medium line-clamp-2">
                  {item.title}
                </p>

              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">No suggested blogs</p>
          )}

        </div>

      </div>

    </div>
  );
};

export default BlogSideBar;