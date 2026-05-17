import { FiSearch } from "react-icons/fi";
import { getBlogImage } from "../utils/getBlogImage";
import { useState, useEffect, useRef } from "react";

const DesktopSearch = ({ search, setSearch, searchResults, handleClick }) => {
  const [imagesLoaded, setImagesLoaded] = useState({});
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setTimeout(() => {
          if (search) {
            // Keep search results but don't close
          }
        }, 100);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [search]);

  const handleImageLoad = (id) => {
    setImagesLoaded(prev => ({ ...prev, [id]: true }));
  };

  const handleImageError = (e, id) => {
    console.log(`Image failed to load for blog: ${id}`);
    e.target.src = "https://placehold.co/100x100?text=No+Image";
    setImagesLoaded(prev => ({ ...prev, [id]: false }));
  };

  return (
    <div className="relative w-full md:w-auto" ref={dropdownRef}>
      {/* Search Input - Smaller on mobile */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[140px] md:w-64 lg:w-80 pl-8 md:pl-10 pr-3 md:pr-4 py-1.5 md:py-2 text-xs md:text-sm border rounded-full focus:ring-2 focus:ring-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all duration-200"
        />
        <FiSearch className="absolute left-2.5 md:left-3 top-2 md:top-2.5 w-3.5 md:w-4 h-3.5 md:h-4 text-gray-500 dark:text-gray-400" />
      </div>

      {/* Search Results Dropdown - Full width on mobile */}
      {search && searchResults?.length > 0 && (
        <div className="absolute mt-2 z-50 left-0 right-0 md:left-0 md:right-auto w-full md:w-[400px] lg:w-[450px] bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-fade-in">
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {searchResults.slice(0, 5).map((item) => (
              <div
                key={item._id}
                onClick={() => handleClick(item._id)}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group"
              >
                {/* Blog Image */}
                <div className="relative flex-shrink-0">
                  <img
                    src={getBlogImage(item.thumbnail || item.image || item.coverImage)}
                    alt={item.title}
                    className="w-10 h-10 md:w-10 md:h-10 rounded-lg object-cover ring-1 ring-gray-200 dark:ring-gray-600 group-hover:ring-blue-500 transition-all duration-200"
                    onLoad={() => handleImageLoad(item._id)}
                    onError={(e) => handleImageError(e, item._id)}
                  />
                  {!imagesLoaded[item._id] && (
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  )}
                </div>
                
                {/* Blog Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </p>
                  <div className="hidden md:flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.author?.firstName} {item.author?.lastName}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.likes?.length || 0} likes
                    </span>
                  </div>
                </div>
                
                {/* Arrow indicator */}
                <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0" />
              </div>
            ))}
          </div>
          
          {/* View all results button */}
          {searchResults.length > 5 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800/50">
              <button 
                onClick={() => {
                  setSearch(search);
                }}
                className="w-full text-center text-xs md:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 py-2 transition-colors font-medium"
              >
                View all {searchResults.length} results →
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* No results found - Full width on mobile */}
      {search && searchResults?.length === 0 && (
        <div className="absolute mt-2 z-50 left-0 right-0 md:left-0 md:right-auto w-full md:w-[400px] bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 p-4 text-center animate-fade-in">
          <div className="flex flex-col items-center gap-2">
            <FiSearch className="w-6 h-6 md:w-8 md:h-8 text-gray-400 dark:text-gray-600" />
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
              No blogs found matching "<span className="font-semibold text-gray-700 dark:text-gray-300">{search}</span>"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ChevronRight Icon Component
const ChevronRight = ({ className }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default DesktopSearch;