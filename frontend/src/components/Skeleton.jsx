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
