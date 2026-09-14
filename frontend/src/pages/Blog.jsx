import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setMyBlogs } from "../redux/blogSlice";
import { API_BASE_URL } from "../utils/api";
import {
  FiEdit,
  FiTrash,
  FiEye,
  FiPlus,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import toast from "react-hot-toast";
import Skeleton from "../components/Skeleton";

const Blog = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ REDUX
  const { myBlogs = [] } = useSelector((store) => store.blog);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(myBlogs.length === 0);

  // =====================================================
  // ✅ AUTO SCROLL TO TOP — on search / filter / mount
  // =====================================================
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [search, filter]);

  const refreshMyBlogs = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/v1/blog/my-blogs`,
        { withCredentials: true }
      );

      if (data?.success) {
        dispatch(setMyBlogs(data.blogs || []));
      }
    } catch (err) {
      console.log("refresh error", err);
    }
  };

  // ✅ FETCH BLOGS
  useEffect(() => {
    const fetchBlogs = async (isBackgroundRefresh) => {
      try {
        if (!isBackgroundRefresh) {
          setLoading(true);
        }

        const { data } = await axios.get(
          `${API_BASE_URL}/api/v1/blog/my-blogs`,
          {
            withCredentials: true,
            headers: {
              "Cache-Control": "no-cache",
            },
          }
        );

        if (data?.success) {
          dispatch(setMyBlogs(data.blogs || []));
        }
      } catch (error) {
        console.log(error);
        if (!isBackgroundRefresh) {
          toast.error("Failed to load blogs");
        }
      } finally {
        setLoading(false);
      }
    };

    const hasCachedData = myBlogs.length > 0;
    fetchBlogs(hasCachedData);
  }, []);

  // ✅ FILTER BLOGS
  const filteredBlogs = myBlogs?.filter((b) => {
    const matchesSearch = b.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "published" && b.isPublished) ||
      (filter === "draft" && !b.isPublished);

    return matchesSearch && matchesFilter;
  });

  // ✅ DELETE BLOG
  const deleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const { data } = await axios.delete(
        `${API_BASE_URL}/api/v1/blog/${blogId}`,
        { withCredentials: true }
      );

      if (data.success) {
        dispatch(setMyBlogs(myBlogs.filter((b) => b._id !== blogId)));
        toast.success("Blog deleted successfully");

        setTimeout(() => {
          refreshMyBlogs();
        }, 300);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete blog");
    }
  };

  // ✅ PUBLISH BLOG
  const publishBlog = async (blogId) => {
    try {
      const { data } = await axios.patch(
        `${API_BASE_URL}/api/v1/blog/${blogId}/publish`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        dispatch(
          setMyBlogs(
            myBlogs.map((b) =>
              b._id === blogId
                ? { ...b, isPublished: data.blog.isPublished }
                : b
            )
          )
        );

        toast.success(
          data.blog.isPublished ? "Blog published" : "Blog unpublished"
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update blog status");
    }
  };

  // ✅ BLOG IMAGE
  const getBlogImageUrl = (thumbnail) => {
    if (
      !thumbnail ||
      thumbnail === "null" ||
      thumbnail === "undefined" ||
      thumbnail === ""
    ) {
      return "https://placehold.co/100x100?text=No+Image";
    }

    if (thumbnail.startsWith("http://") || thumbnail.startsWith("https://")) {
      return thumbnail;
    }

    if (thumbnail.startsWith("/uploads")) {
      return `${API_BASE_URL}${thumbnail}`;
    }

    if (thumbnail.startsWith("uploads")) {
      return `${API_BASE_URL}/${thumbnail}`;
    }

    return `${API_BASE_URL}/${thumbnail.replace(/^\/+/, "")}`;
  };

  // =====================================================
  // BACKGROUND GLOW — same theme (reusable)
  // =====================================================
  const BackgroundGlow = () => (
    <>
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
    </>
  );

  // ✅ LOADING
  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 p-6 md:p-8">
        <BackgroundGlow />

        <div className="relative z-10">
          <div className="h-8 w-40 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse mb-6" />
          <Skeleton type="blogList" count={5} className="space-y-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 p-6 md:p-8 transition-colors duration-300">
      <BackgroundGlow />

      <div className="relative z-10">
        {/* HEADER */}
        <div className="flex flex-col mt-4 md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            My Blogs
          </h1>

          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigate("/dashboard/create-blogs");
            }}
            className="flex items-center gap-2 bg-[oklch(0.71_0.2_46.45)] hover:bg-[oklch(0.65_0.2_46.45)] text-white px-4 py-2 rounded-lg transition shadow-sm"
          >
            <FiPlus />
            Create Blog
          </button>
        </div>

        {/* SEARCH & FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* SEARCH */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[oklch(0.71_0.2_46.45)] outline-none transition"
            />
          </div>

          {/* FILTER */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[oklch(0.71_0.2_46.45)] outline-none transition"
            >
              <option value="all">All Blogs</option>
              <option value="published">Published</option>
              <option value="draft">Pending</option>
            </select>
          </div>
        </div>

        {/* BLOGS LIST */}
        {filteredBlogs?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No blogs found. Create your first blog!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* DESKTOP */}
            <div className="hidden md:block bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Blog
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredBlogs.map((b) => (
                      <tr
                        key={b._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                      >
                        {/* BLOG */}
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <img
                              className="w-10 h-10 object-cover rounded-md"
                              src={getBlogImageUrl(
                                b?.thumbnail || b?.image || b?.coverImage
                              )}
                              alt={b.title}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://placehold.co/100x100?text=No+Image";
                              }}
                            />

                            <div>
                              <p
                                onClick={() =>
                                  navigate(`/view-blog/${b._id}`)
                                }
                                className="text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer hover:underline line-clamp-1"
                              >
                                {b.title}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              b.isPublished
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            }`}
                          >
                            {b.isPublished ? "Published" : "Pending"}
                          </span>
                        </td>

                        {/* DATE */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() =>
                                navigate(`/dashboard/write-blog/${b._id}`)
                              }
                              className="text-[oklch(0.71_0.2_46.45)] hover:text-[oklch(0.65_0.2_46.45)] transition-colors duration-200"
                              title="Edit"
                            >
                              <FiEdit />
                            </button>

                            <button
                              onClick={() => navigate(`/view-blog/${b._id}`)}
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                              title="View"
                            >
                              <FiEye />
                            </button>

                            <button
                              onClick={() => publishBlog(b._id)}
                              className={`transition-colors duration-200 ${
                                b.isPublished
                                  ? "text-yellow-600 hover:text-yellow-800 dark:text-yellow-500 dark:hover:text-yellow-400"
                                  : "text-[oklch(0.71_0.2_46.45)] hover:text-[oklch(0.65_0.2_46.45)]"
                              }`}
                              title={b.isPublished ? "Unpublish" : "Publish"}
                            >
                              {b.isPublished ? "Unpublish" : "Publish"}
                            </button>

                            <button
                              onClick={() => deleteBlog(b._id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                              title="Delete"
                            >
                              <FiTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE */}
            <div className="md:hidden space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {filteredBlogs.map((b) => (
                <div
                  key={b._id}
                  className="flex items-center justify-between gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <img
                      src={getBlogImageUrl(
                        b?.thumbnail || b?.image || b?.coverImage
                      )}
                      alt={b.title}
                      className="w-10 h-10 rounded-md object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/100x100?text=No+Image";
                      }}
                    />

                    <div className="flex-1">
                      <p
                        onClick={() => navigate(`/view-blog/${b._id}`)}
                        className="text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer hover:underline line-clamp-1"
                      >
                        {b.title}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/write-blog/${b._id}`)
                      }
                      className="text-[oklch(0.71_0.2_46.45)] hover:text-[oklch(0.65_0.2_46.45)] transition-colors duration-200"
                    >
                      <FiEdit />
                    </button>

                    <button
                      onClick={() => navigate(`/view-blog/${b._id}`)}
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                    >
                      <FiEye />
                    </button>

                    <button
                      onClick={() => publishBlog(b._id)}
                      className={`text-sm transition-colors duration-200 ${
                        b.isPublished
                          ? "text-yellow-600 hover:text-yellow-800 dark:text-yellow-500 dark:hover:text-yellow-400"
                          : "text-[oklch(0.71_0.2_46.45)] hover:text-[oklch(0.65_0.2_46.45)]"
                      }`}
                    >
                      {b.isPublished ? "Unpub" : "Pub"}
                    </button>

                    <button
                      onClick={() => deleteBlog(b._id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                    >
                      <FiTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SCROLLBAR */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .dark .custom-scrollbar {
          scrollbar-color: #475569 transparent;
        }
      `}</style>
    </div>
  );
};

export default Blog;