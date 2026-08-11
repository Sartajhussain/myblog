import React from "react";

const Skeleton = ({ type = "text", count = 1, className = "" }) => {
  const items = Array.from({ length: count }, (_, index) => {
    if (type === "blogCard") {
      return (
        <div
          key={index}
          className="rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm"
        >
          <div className="h-60 bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="p-5 space-y-4">
            <div className="h-5 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="h-4 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-3 w-5/6 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>
            <div className="h-10 w-32 rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
        </div>
      );
    }

    if (type === "comment") {
      return (
        <div
          key={index}
          className="rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-5/6 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      );
    }

    if (type === "profile") {
      return (
        <div
          key={index}
          className="rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 space-y-5 animate-pulse"
        >
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-5/6 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      );
    }

    // ✅ Full blog detail page skeleton (matches ViewBlog layout)
    if (type === "blog") {
      return (
        <div
          key={index}
          className="flex justify-center bg-gray-50 dark:bg-gray-900 min-h-screen"
        >
          <div className="w-full max-w-6xl mt-8 py-10 px-4 md:px-10 space-y-10">
            {/* Back button */}
            <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />

            {/* Title */}
            <div className="space-y-3">
              <div className="h-8 md:h-10 w-full rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-8 md:h-10 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>

            {/* Author row */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-32 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="h-3 w-24 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              </div>
            </div>

            {/* Cover image */}
            <div className="w-full h-[300px] md:h-[500px] rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse" />

            {/* Content lines */}
            <div className="space-y-3">
              <div className="h-4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-4 w-5/6 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-4 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-4 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>

            {/* Like / comment / share row */}
            <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
              <div className="flex gap-5 items-center">
                <div className="h-5 w-12 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="h-5 w-12 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              </div>
              <div className="flex gap-5 items-center">
                <div className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ✅ Blog list/table skeleton (matches "My Blogs" dashboard page)
    if (type === "blogList") {
      return (
        <div
          key={index}
          className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-3 w-1/4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>
          </div>
          <div className="hidden md:block h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="hidden md:block h-4 w-16 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="h-4 w-4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
        </div>
      );
    }

    // ✅ NEW: Home hero carousel skeleton (matches Home page hero card layout)
    if (type === "homeHero") {
      return (
        <div
          key={index}
          className="rounded-2xl overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* LEFT CONTENT */}
            <div className="order-2 lg:order-1 p-6 md:p-8 lg:p-10 flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              </div>

              <div className="space-y-3">
                <div className="h-8 md:h-10 w-full rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="h-8 md:h-10 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              </div>

              <div className="h-4 w-40 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />

              <div className="space-y-2">
                <div className="h-4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="h-4 w-4/5 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              </div>

              <div className="flex items-center gap-4">
                <div className="h-4 w-16 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="h-4 w-16 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
              </div>

              <div className="h-10 w-36 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>

            {/* RIGHT IMAGE */}
            <div className="order-1 lg:order-2 h-64 lg:h-[450px] bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
        </div>
      );
    }

    return (
      <div
        key={index}
        className="h-4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"
      />
    );
  });

  return (
    <div className={`space-y-4 ${className}`}>{items}</div>
  );
};

export default Skeleton;