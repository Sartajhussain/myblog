import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";

const CreateBlogs = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // AI states
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Prevent old API response from overwriting latest response
  const requestIdRef = useRef(0);

  const blog = useSelector((store) => store.blog.blog || []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // =====================================================
  // APPLY AI TITLE
  // =====================================================

  const handleApplySuggestion = (suggestion) => {
    setTitle(suggestion);
    setAiSuggestions([]);

    toast.success("AI Title applied!", {
      id: "ai-title",
      duration: 1500,
    });
  };

  // =====================================================
  // AI TITLE SUGGESTIONS
  // =====================================================

  useEffect(() => {
    const currentTitle = title.trim();

    // Empty input
    if (!currentTitle) {
      setAiSuggestions([]);
      setAiLoading(false);
      return;
    }

    // Minimum characters
    if (currentTitle.length < 2) {
      setAiSuggestions([]);
      setAiLoading(false);
      return;
    }

    // Debounce
    const timer = setTimeout(async () => {
      const currentRequestId = ++requestIdRef.current;

      try {
        setAiLoading(true);

        const response = await axios.post(
          `${API_BASE_URL}/api/v1/ai/title-suggestions`,
          {
            title: currentTitle,
            category: category || "",
          },
          {
            withCredentials: true,
          }
        );

        // Ignore old response
        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        if (
          response.data?.success &&
          Array.isArray(response.data?.suggestions)
        ) {
          setAiSuggestions(response.data.suggestions);
        } else {
          setAiSuggestions([]);
        }
      } catch (error) {
        console.error(
          "AI Title Suggestion Error:",
          error
        );

        setAiSuggestions([]);
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setAiLoading(false);
        }
      }
    }, 600);

    return () => {
      clearTimeout(timer);
    };
  }, [title, category]);

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

        navigate(
          `/dashboard/write-blog/${response.data.blog._id}`
        );
      }
    } catch (error) {
      console.error(
        "Create Blog Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Error creating blog"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="w-full  min-h-[calc(100vh-4rem)] flex items-center justify-center p-3 sm:p-6 md:p-8">
  <div className="w-full max-w-2xl border border-slate-200/80 dark:border-slate-800 dark:bg-gray-800 rounded-3xl shadow-xl p-5 sm:p-8 space-y-6">

    {/* HEADER */}

    <div className="space-y-2 ">
      {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-semibold">
        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        AI Assistant Ready
      </div> */}

      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
        Create Your Blog
      </h1>

      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        Type your blog topic and AI will suggest
        relevant SEO-friendly titles.
      </p>
    </div>

    {/* FORM */}

    <form
      onSubmit={createBlogHandler}
      className="space-y-6"
    >

      {/* TITLE */}

      <div className="space-y-3">
        <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
          Blog Title{" "}
          <span className="text-rose-500">*</span>
        </label>

        <div className="relative">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="e.g. write your blog which you want..."
            className="w-full px-4 py-3 pr-20 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-500 transition"
          />

          {/* AI LOADING */}

          {aiLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
              <svg
                className="animate-spin h-4 w-4"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>

              <span className="text-[10px] font-semibold">
                AI
              </span>
            </div>
          )}
        </div>

        {/* AI SUGGESTIONS */}

        {(aiLoading || aiSuggestions.length > 0) && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                ✨ AI Title Suggestions
              </span>

              {aiLoading && (
                <span className="text-[10px] text-purple-500">
                  Generating...
                </span>
              )}
            </div>

            {/* LOADING */}

            {aiLoading && aiSuggestions.length === 0 && (
              <div className="space-y-2">
                <div className="h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 animate-pulse" />

                <div className="h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 animate-pulse" />

                <div className="h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 animate-pulse" />
              </div>
            )}

            {/* RESULTS */}

            {!aiLoading && aiSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {aiSuggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion}-${index}`}
                    type="button"
                    onClick={() =>
                      handleApplySuggestion(suggestion)
                    }
                    className="text-left text-[11px] px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition duration-200"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CATEGORY */}

      <div className="space-y-2">
        <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
          Category{" "}
          <span className="text-rose-500">*</span>
        </label>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
          className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-500 transition cursor-pointer"
        >
          <option value="">
            Select Category
          </option>

          <option value="Technology">
            Technology
          </option>

          <option value="others">
            Others
          </option>

          <option value="Generative AI">
            Generative AI
          </option>

          <option value="LLMs">
            LLMs
          </option>

          <option value="Business">
            Business
          </option>

          <option value="Lifestyle">
            Lifestyle
          </option>

          <option value="Education">
            Education
          </option>

          <option value="Coding">
            Coding
          </option>
        </select>
      </div>

      {/* SUBMIT */}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
          loading
            ? "bg-slate-400 dark:bg-slate-700 cursor-not-allowed shadow-none"
            : "dark:bg-black hover:opacity-95 active:scale-[0.99] shadow-purple-500/25"
        }`}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-white"
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

            Creating Blog...
          </span>
        ) : (
          "Continue to Editor →"
        )}
      </button>
    </form>
  </div>
</div>
  );
};

export default CreateBlogs;