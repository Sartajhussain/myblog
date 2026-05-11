import React, { useEffect, useState } from "react";

const GlobalLoader = ({ isLoading = true, className = "" }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setFadeOut(true);
    }
  }, [isLoading]);

  if (!isLoading && fadeOut) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-9999 bg-white dark:bg-gray-950 flex flex-col items-center justify-start pt-20 overflow-hidden transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      } ${className}`}
    >
      {/* Navbar Skeleton */}
      <div className="w-full px-4 md:px-8 py-4 border-b border-gray-200 dark:border-gray-800 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="flex gap-4">
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-6xl px-4 space-y-6">
        {/* Blog Card 1 */}
        <BlogCardSkeleton />

        {/* Blog Card 2 */}
        <BlogCardSkeleton />

        {/* Blog Card 3 */}
        <BlogCardSkeleton />
      </div>
    </div>
  );
};

const BlogCardSkeleton = () => {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Thumbnail Skeleton */}
      <div className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent dark:via-gray-700 animate-shimmer"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>

        {/* Subtitle */}
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>

        {/* Description Lines */}
        <div className="space-y-2 pt-2">
          <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        </div>

        {/* Author Section */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            <div className="h-2 w-16 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex gap-4">
            <div className="h-8 w-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            <div className="h-8 w-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-8 w-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            <div className="h-8 w-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
