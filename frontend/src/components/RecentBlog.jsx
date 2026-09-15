import React from "react";
import { useNavigate } from "react-router-dom";
import BlogList from "./BlogList";
import BlogSideBar from "./BlogSideBar";
import { getBlogImageUrl } from "../utils/profileImage";
import { Sparkles, ArrowRight, BookOpenText } from "lucide-react";

const RecentBlog = ({ blogs = [] }) => {
  const navigate = useNavigate();

  // ✅ Process blogs with correct image URLs
  const processedBlogs = blogs.map((blog) => ({
    ...blog,
    imageUrl: getBlogImageUrl(blog),
  }));

  const visibleBlogs = processedBlogs.slice(0, 5);

  return (
    <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* =====================================================
          BACKGROUND GLOW — same theme as About/Contact/Footer/Blogs
      ===================================================== */}

      {/* Orange glow — top-left */}
      <div className="pointer-events-none absolute top-[-100px] left-[-100px] w-[450px] h-[450px] bg-[oklch(0.71_0.2_46.45)] opacity-[0.1] dark:opacity-[0.08] rounded-full blur-3xl animate-blob" />

      {/* Orange lighter — bottom-right */}
      <div className="pointer-events-none absolute bottom-[-100px] right-[-100px] w-[450px] h-[450px] bg-[oklch(0.8_0.15_60)] opacity-[0.1] dark:opacity-[0.07] rounded-full blur-3xl animate-blob animation-delay-2000" />

      {/* Subtle gray — center */}
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
          MAIN CONTENT
      ===================================================== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-12 md:py-16">
        {/* SECTION HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-12">
          <div className="text-center sm:text-left mx-auto sm:mx-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[oklch(0.6_0.2_46.45)] bg-[oklch(0.71_0.2_46.45)]/10 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Fresh off the press
            </span>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              Welcome to the{" "}
              <span className="bg-gradient-to-r from-[oklch(0.71_0.2_46.45)] to-[oklch(0.8_0.15_60)] bg-clip-text text-transparent">
                Kingdom
              </span>{" "}
              of Stories
            </h2>
            <p className="mt-3 text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-xl">
              Handpicked, recently published posts from our community of writers.
            </p>
          </div>

          <button
            onClick={() => navigate("/blogs")}
            className="hidden sm:inline-flex flex-shrink-0 items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm hover:border-[oklch(0.71_0.2_46.45)]/50 hover:text-[oklch(0.6_0.2_46.45)] transition-all duration-300"
          >
            View all posts
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* MAIN SECTION */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          {/* BLOG LIST */}
          <div className="flex-1 w-full min-w-0">
            {visibleBlogs.length > 0 ? (
              <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-gray-800/30 backdrop-blur-sm overflow-hidden shadow-sm">
                {visibleBlogs.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="px-4 sm:px-6 py-2 hover:bg-white/80 dark:hover:bg-gray-800/60 transition-colors duration-300"
                  >
                    <BlogList
                      blog={{
                        ...item,
                        thumbnail: getBlogImageUrl(item),
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16 md:py-20 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/30">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[oklch(0.71_0.2_46.45)]/10 text-[oklch(0.6_0.2_46.45)] mb-3">
                  <BookOpenText className="w-6 h-6" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  No blogs available yet
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Check back soon for new stories.
                </p>
              </div>
            )}

            {/* Mobile "view all" */}
            <button
              onClick={() => navigate("/blogs")}
              className="sm:hidden w-full mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:opacity-90 transition-opacity"
            >
              View all posts
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* SIDEBAR */}
          <aside className="w-full lg:w-[320px] flex-shrink-0 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-gray-800/30 backdrop-blur-sm shadow-sm p-4 sm:p-5">
              <BlogSideBar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RecentBlog;