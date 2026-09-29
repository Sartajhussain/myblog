import { FiSearch, FiChevronRight } from "react-icons/fi";
import { getBlogImage } from "../utils/getBlogImage";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const DesktopSearch = ({
  search,
  setSearch,
  searchResults = [],
  handleClick,
}) => {
  const navigate = useNavigate();
  const [imagesLoaded, setImagesLoaded] = useState({});
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSearch]);

  const handleImageLoad = (id) => {
    setImagesLoaded((prev) => ({ ...prev, [id]: true }));
  };

  const handleImageError = (e, id) => {
    e.target.src = "https://placehold.co/100x100?text=No+Image";
    setImagesLoaded((prev) => ({ ...prev, [id]: true }));
  };

  const handleViewAll = () => {
    const q = search.trim();
    setSearch("");
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="relative w-full md:w-auto" ref={dropdownRef}>
      {/* ============================================
          SEARCH INPUT — MODERN + THIN BORDER
      ============================================ */}
      <div className="relative ml-10 md:ml-0 group">
        {/* Soft glow behind input on focus */}
        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[oklch(0.71_0.2_46.45)]/0 via-[oklch(0.71_0.2_46.45)]/20 to-[oklch(0.8_0.15_60)]/0 opacity-0 group-focus-within:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />

        <input
          type="text"
          placeholder="Search blogs by author, title, category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            relative
            w-[180px] md:w-64 lg:w-80
            pl-8 md:pl-10 pr-3 md:pr-4 py-1.5 md:py-2
            text-xs md:text-sm
            rounded-full
            bg-white/70 dark:bg-gray-800/70
            backdrop-blur-xl
            border border-gray-200/80 dark:border-gray-700/60
            text-gray-900 dark:text-white
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            shadow-sm
            hover:border-gray-300 dark:hover:border-gray-600
            focus:outline-none
            focus:border-[oklch(0.71_0.2_46.45)]/60
            focus:bg-white dark:focus:bg-gray-800
            focus:shadow-md
            focus:shadow-[oklch(0.71_0.2_46.45)]/10
            transition-all duration-300
          "
        />

        <FiSearch
          className="
            absolute left-2.5 md:left-3 top-2 md:top-2.5
            w-3.5 md:w-4 h-3.5 md:h-4
            text-gray-500 dark:text-gray-400
            group-focus-within:text-[oklch(0.71_0.2_46.45)]
            transition-colors duration-300
            pointer-events-none
          "
        />
      </div>

      {/* ============================================
          RESULTS DROPDOWN — MODERN GLASS
      ============================================ */}
      {search?.trim() && searchResults?.length > 0 && (
        <div
          className="
            absolute mt-2 z-50 top-full
            left-1/2 md:left-auto md:right-0
            -translate-x-1/2 md:translate-x-0
            w-[92vw] md:w-[400px] lg:w-[450px]
            max-w-[calc(100vw-1rem)]
            bg-white/80 dark:bg-gray-900/80
            backdrop-blur-2xl
            shadow-2xl shadow-black/10 dark:shadow-black/40
            rounded-2xl overflow-hidden
            border border-white/40 dark:border-gray-700/50
            ring-1 ring-black/5 dark:ring-white/5
            animate-fade-in
          "
        >
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {searchResults.slice(0, 5).map((item) => (
              <div
                key={item._id}
                onClick={() => handleClick(item._id)}
                className="
                  flex items-start gap-3 p-3 cursor-pointer
                  hover:bg-[oklch(0.71_0.2_46.45)]/8 dark:hover:bg-[oklch(0.71_0.2_46.45)]/10
                  transition-all duration-200 group/item
                  border-b border-gray-100/60 dark:border-gray-800/60 last:border-0
                "
              >
                {/* IMAGE */}
                <div className="relative flex-shrink-0">
                  <img
                    src={getBlogImage(item.thumbnail || item.image || item.coverImage)}
                    alt={item.title}
                    className="
                      w-10 h-10 md:w-11 md:h-11 rounded-lg object-cover
                      ring-1 ring-gray-200/80 dark:ring-gray-700/60
                      group-hover/item:ring-[oklch(0.71_0.2_46.45)]/60
                      transition-all duration-200
                    "
                    onLoad={() => handleImageLoad(item._id)}
                    onError={(e) => handleImageError(e, item._id)}
                  />
                  {!imagesLoaded[item._id] && (
                    <div className="absolute inset-0 bg-gray-200/70 dark:bg-gray-700/70 rounded-lg animate-pulse" />
                  )}
                </div>

                {/* INFO */}
                <div className="flex-1 min-w-0">
                  {/* TITLE — mobile + desktop dono pe */}
                  <p
                    className="
                      text-xs md:text-sm font-semibold
                      text-gray-800 dark:text-gray-200
                      line-clamp-1
                      group-hover/item:text-[oklch(0.71_0.2_46.45)]
                      transition-colors
                    "
                  >
                    {item.title}
                  </p>

                  {/* ✅ MOBILE + DESKTOP — author, category, likes */}
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {/* AUTHOR */}
                    <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 truncate max-w-[90px] md:max-w-none">
                      {item.author?.firstName} {item.author?.lastName}
                    </span>

                    <span className="text-[10px] text-gray-400">•</span>

                    {/* CATEGORY BADGE */}
                    {item.category && (
                      <span className="text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-full bg-[oklch(0.71_0.2_46.45)]/10 text-[oklch(0.71_0.2_46.45)] font-medium capitalize whitespace-nowrap">
                        {item.category}
                      </span>
                    )}

                    <span className="text-[10px] text-gray-400">•</span>

                    {/* LIKES */}
                    <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {item.likes?.length || 0} likes
                    </span>
                  </div>
                </div>

                {/* ARROW */}
                <FiChevronRight
                  className="
                    w-4 h-4 mt-1 text-gray-400
                    group-hover/item:text-[oklch(0.71_0.2_46.45)]
                    opacity-0 group-hover/item:opacity-100
                    group-hover/item:translate-x-0.5
                    transition-all duration-200 flex-shrink-0
                  "
                />
              </div>
            ))}
          </div>

          {/* VIEW ALL */}
          {searchResults.length > 5 && (
            <div className="border-t border-gray-200/60 dark:border-gray-700/50 p-2 bg-gradient-to-b from-transparent to-[oklch(0.71_0.2_46.45)]/5">
              <button
                onClick={handleViewAll}
                className="
                  w-full text-center text-xs md:text-sm
                  text-[oklch(0.71_0.2_46.45)]
                  hover:text-[oklch(0.65_0.2_46.45)]
                  py-2 transition-colors font-medium
                "
              >
                View all {searchResults.length} results →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================
          NO RESULTS — MODERN GLASS
      ============================================ */}
      {search?.trim() && searchResults?.length === 0 && (
        <div
          className="
            absolute mt-2 z-50 top-full
            left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0
            w-[92vw] md:w-[400px] max-w-[calc(100vw-1rem)]
            bg-white/80 dark:bg-gray-900/80
            backdrop-blur-2xl
            shadow-2xl shadow-black/10 dark:shadow-black/40
            rounded-2xl overflow-hidden
            border border-white/40 dark:border-gray-700/50
            ring-1 ring-black/5 dark:ring-white/5
            p-4 text-center animate-fade-in
          "
        >
          <div className="flex flex-col items-center gap-2">
            <FiSearch className="w-6 h-6 md:w-8 md:h-8 text-gray-400 dark:text-gray-600" />
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
              No blogs found matching{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                "{search}"
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesktopSearch;