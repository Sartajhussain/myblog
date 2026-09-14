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

  // =====================================================
  // CREATE BLOG
  // =====================================================
  const createBlogHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    const trimmedTitle = title.trim();

    if (!trimmedTitle || !category) {
      toast.error("Title and category are required");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/blog`,
        {
          title: trimmedTitle,
          category,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        dispatch({
          type: "blog/setBlog",
          payload: [response.data.blog, ...blog],
        });

        toast.success("Blog Created Successfully");

        navigate(`/dashboard/write-blog/${response.data.blog._id}`);
      }
    } catch (error) {
      console.error("Create Blog Error:", error);

      toast.error(
        error?.response?.data?.message || "Error creating blog"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================
  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      {/* =====================================================
          BACKGROUND GLOW — same theme
      ===================================================== */}
      <div className="pointer-events-none absolute top-[-100px] left-[-100px] w-[450px] h-[450px] bg-[oklch(0.71_0.2_46.45)] opacity-[0.1] dark:opacity-[0.08] rounded-full blur-3xl animate-blob" />
      <div className="pointer-events-none absolute bottom-[-100px] right-[-100px] w-[450px] h-[450px] bg-[oklch(0.8_0.15_60)] opacity-[0.1] dark:opacity-[0.07] rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gray-400 dark:bg-gray-600 opacity-[0.08] dark:opacity-[0.06] rounded-full blur-3xl animate-blob animation-delay-4000" />

      {/* Grid Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* =====================================================
          FORM CARD
      ===================================================== */}
      <div className="relative z-10 w-full max-w-2xl border border-gray-200 dark:border-slate-800 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-xl p-5 sm:p-8 space-y-6">

        {/* HEADER */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Create Your Blog
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Type your blog topic and continue to the editor.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={createBlogHandler} className="space-y-6">
          {/* TITLE */}
          <div className="space-y-3">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              Blog Title <span className="text-rose-500">*</span>
            </label>

            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                placeholder="e.g. write your blog which you want..."
                className="w-full px-4 py-3 pr-20 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[oklch(0.71_0.2_46.45)] transition"
              />
            </div>
          </div>

          {/* CATEGORY */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              Category <span className="text-rose-500">*</span>
            </label>

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[oklch(0.71_0.2_46.45)] transition cursor-pointer"
            >
              <option value="">Select Category</option>
              <option value="Technology">Technology</option>
              <option value="others">Others</option>
              <option value="Generative AI">Generative AI</option>
              <option value="LLMs">LLMs</option>
              <option value="Business">Business</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Education">Education</option>
              <option value="Coding">Coding</option>
            </select>
          </div>

          {/* SUBMIT BUTTON — Orange accent */}
          <button
            type="submit"
            disabled={loading}
            className={`group relative w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ease-out flex items-center justify-center gap-2 overflow-hidden ${
              loading
                ? "bg-[oklch(0.71_0.2_46.45)]/40 text-white/70 cursor-not-allowed shadow-none border border-[oklch(0.71_0.2_46.45)]/30"
                : "bg-[oklch(0.71_0.2_46.45)] hover:bg-[oklch(0.65_0.2_46.45)] text-white border border-[oklch(0.71_0.2_46.45)] shadow-md hover:shadow-lg hover:shadow-[oklch(0.71_0.2_46.45)]/20 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2.5">
                <svg
                  className="animate-spin h-4 w-4 text-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Creating Blog...</span>
              </span>
            ) : (
              <>
                <span>Continue to Editor</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogs;