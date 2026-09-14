import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublishedBlogSideBar from "./PublishedBlogSideBar";
import Pagination from "./Pagination";
import Skeleton from "../components/Skeleton";
import { getBlogImage } from "../utils/getBlogImage";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";
import { setPublicBlogs } from "../redux/blogSlice";
import { Calendar, ArrowRight, FileText } from "lucide-react";

const Blogs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ REDUX
  const { publicBlogs = [] } = useSelector((state) => state.blog);

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const blogsPerPage = 6;

  // ✅ RESET TO PAGE 1 WHENEVER CATEGORY CHANGES
  // (fixes: switching category while on page 2+ showed "No blogs found"
  // because currentPage stayed out of range for the new, shorter list)
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter]);

  // ✅ FETCH BLOGS
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          `${API_BASE_URL}/api/v1/blog/feed`,
          {
            withCredentials: true,
          }
        );

        if (data?.success) {
          dispatch(setPublicBlogs(data.blogs || data.feed || []));
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [dispatch]);

  // ✅ IMAGE HELPER
  const getImage = (img) => {
    if (!img || img === "null" || img === "undefined" || img === "") {
      return null;
    }
    return getBlogImage(img);
  };

  // ✅ FILTER BLOGS
  const filteredBlogs =
    categoryFilter === "All"
      ? publicBlogs
      : publicBlogs.filter((b) => b.category === categoryFilter);

  // ✅ PAGINATION
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(
    indexOfFirstBlog,
    indexOfLastBlog
  );

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handleReadMore = (id) => {
    navigate(`/view-blog/${id}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 mt-13 px-4 md:px-8 py-10 transition-colors duration-300">

      {/* =====================================================
          BACKGROUND GLOW — same theme as About/Contact/Footer/AllUser
      ===================================================== */}

      <div className="pointer-events-none absolute top-[-100px] left-[-100px] w-[450px] h-[450px] bg-[oklch(0.71_0.2_46.45)] opacity-[0.1] dark:opacity-[0.08] rounded-full blur-3xl animate-blob" />
      <div className="pointer-events-none absolute bottom-[-100px] right-[-100px] w-[450px] h-[450px] bg-[oklch(0.8_0.15_60)] opacity-[0.1] dark:opacity-[0.07] rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gray-400 dark:bg-gray-600 opacity-[0.08] dark:opacity-[0.06] rounded-full blur-3xl animate-blob animation-delay-4000" />
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
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* BLOG SECTION */}
        <div className="lg:col-span-3 order-2 lg:order-1">

          {/* HEADER */}
          <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Published Blogs
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {filteredBlogs.length} {filteredBlogs.length === 1 ? "post" : "posts"}
                {categoryFilter !== "All" && (
                  <span className="capitalize"> in "{categoryFilter}"</span>
                )}
              </p>
            </div>
          </div>

          {loading ? (
            <Skeleton
              type="blogCard"
              count={6}
              className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6"
            />
          ) : currentBlogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/30">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[oklch(0.71_0.2_46.45)]/10 text-[oklch(0.6_0.2_46.45)] mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                No blogs found
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Try a different category.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentBlogs.map((item) => {
                const img = getImage(
                  item.thumbnail || item.image || item.coverImage
                );

                return (
                  <div
                    key={item._id}
                    onClick={() => handleReadMore(item._id)}
                    className="flex flex-col rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/60 overflow-hidden group cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {/* IMAGE */}
                    <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {img ? (
                        <img
                          src={img}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/600x400?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                          <FileText className="w-8 h-8" />
                        </div>
                      )}

                      {item.category && (
                        <span className="absolute top-3 left-3 text-[11px] font-medium capitalize px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-sm">
                          {item.category}
                        </span>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex flex-col flex-1 p-5">
                      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-2">
                        <span className="truncate">
                          {item.author?.firstName || "Admin"} {item.author?.lastName || ""}
                        </span>
                        <span className="flex items-center gap-1 flex-shrink-0">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.createdAt || Date.now()).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>

                      <h2 className="text-base font-semibold line-clamp-2 text-gray-900 dark:text-white leading-snug">
                        {item.title}
                      </h2>

                      {item.subtitle && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1.5">
                          {item.subtitle}
                        </p>
                      )}

                      <div className="mt-auto pt-4 flex items-center gap-1.5 text-sm font-medium text-[oklch(0.6_0.2_46.45)]">
                        Read more
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="order-1 lg:order-2">
          <PublishedBlogSideBar
            blogs={publicBlogs}
            setCategoryFilter={setCategoryFilter}
          />
        </div>
      </div>
    </div>
  );
};

export default Blogs;