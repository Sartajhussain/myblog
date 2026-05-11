import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";

const CreateBlogs = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const blog = useSelector((store) => store.blog.blog || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createBlogHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!title || !category) {
      toast.error("Title and category are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE_URL}/api/v1/blog`,
        { title, category },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data.success) {
        dispatch({ type: "blog/setBlog", payload: [res.data.blog, ...blog] });
        toast.success("Blog Created Successfully");
        navigate(`/dashboard/write-blog/${res.data.blog._id}`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error creating blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 md:ml-72">

      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">

        {/* HEADER */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Create Your Blog
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Share your ideas with the world in just a few clicks.
        </p>

        {/* FORM */}
        <form onSubmit={createBlogHandler} className="space-y-6">

          {/* TITLE */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Blog Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-black outline-none transition"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-black outline-none transition"
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
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-900"
            }`}
          >
            {loading ? "Creating..." : "Create Blog"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateBlogs;