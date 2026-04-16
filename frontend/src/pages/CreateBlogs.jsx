import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setBlog } from "../redux/blogSlice";
import { API_BASE_URL } from "../utils/api";

const CreateBlogs = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ SAFE REDUX ACCESS
  const blogs = useSelector((store) => store.blog?.blog || []);

  const createBlogHandler = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedCategory = category.trim();

    // ✅ VALIDATION FIX
    if (!trimmedTitle || !trimmedCategory) {
      toast.error("Title and category are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE_URL}/api/v1/blog`,
        {
          title: trimmedTitle,
          category: trimmedCategory,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data?.success) {
        const newBlog = res.data.blog;

        // ✅ SAFE REDUX UPDATE
        dispatch(setBlog([newBlog, ...blogs]));

        toast.success("Blog Created Successfully");

        // ⚡ navigate after state update
        setTimeout(() => {
          navigate(`/dashboard/write-blog/${newBlog._id}`);
        }, 200);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("CREATE BLOG ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Error creating blog"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-24 pb-24 md:ml-72 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Let’s Create a Blog
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Share your thoughts, ideas, and stories with the world.
        </p>

        <form className="space-y-6" onSubmit={createBlogHandler}>

          {/* TITLE */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Blog Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-gray-700 text-black dark:text-white"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
            >
              <option value="">Select Category</option>
              <option value="tech">Technology</option>
              <option value="business">Business</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="education">Education</option>
            </select>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-black hover:bg-gray-800 flex items-center justify-center"
          >
            {loading ? "Loading..." : "Create Blog"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default CreateBlogs;