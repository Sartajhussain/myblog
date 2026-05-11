import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setBlog } from "../redux/blogSlice";
import { API_BASE_URL } from "../utils/api";
import userimg from "../assets/userprofile.png";
import {
  FiEdit,
  FiTrash,
  FiEye,
  FiPlus,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import toast from "react-hot-toast";

const Blog = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { blog } = useSelector((store) => store.blog);
  const { user } = useSelector((store) => store.auth);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // ✅ FETCH BLOGS
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          `${API_BASE_URL}/api/v1/blog/my-blogs`,
          { withCredentials: true }
        );

        if (data.success) {
          dispatch(setBlog(data.blogs));
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [dispatch]);

  // ✅ FILTER BLOGS
  const filteredBlogs = blog?.filter((b) => {
    const matchesSearch = b.title?.toLowerCase().includes(search.toLowerCase());
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
        dispatch(setBlog(blog.filter((b) => b._id !== blogId)));
        toast.success("Blog deleted successfully");
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
          setBlog(
            blog.map((b) =>
              b._id === blogId ? { ...b, isPublished: data.blog.isPublished } : b
            )
          )
        );
        toast.success(data.blog.isPublished ? "Blog published" : "Blog unpublished");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update blog status");
    }
  };

  // ✅ HANDLE IMAGE ERROR
  const handleImageError = (e) => {
    e.target.src = userimg;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:ml-72 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          My Blogs
        </h1>

        <button
          onClick={() => navigate("/dashboard/create-blogs")}
          className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg transition"
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
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* FILTER */}
        <div className="relative">
          <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
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
          {/* TABLE VIEW (DESKTOP) */}
          <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
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
                  <tr key={b._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    {/* BLOG */}
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <img 
                        className="w-10 h-10 object-cover rounded-md"
                          src={
                            b?.thumbnail
                              ? b.thumbnail.startsWith("http")
                                ? b.thumbnail
                                : `${API_BASE_URL}/${b.thumbnail.replace(/^\/+/, "")}`
                              : userimg
                          }
                        />
                        <div>
                          <p
                            onClick={() => navigate(`/view-blog/${b._id}`)}
                            className="text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer hover:underline line-clamp-1"
                          >
                            {b.title}
                          </p>
                          {/* <span className="text-[11px] text-gray-400">#{b._id.slice(-6)}</span> */}
                        </div>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${b.isPublished
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          }`}
                      >
                        {b.isPublished ? "Published" : "pending"}
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
                          onClick={() => navigate(`/dashboard/write-blog/${b._id}`)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                          aria-label="Edit blog"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => navigate(`/view-blog/${b._id}`)}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                          aria-label="View blog"
                        >
                          <FiEye />
                        </button>
                        <button
                          onClick={() => publishBlog(b._id)}
                          className={`transition-colors duration-200 ${b.isPublished
                            ? "text-yellow-600 hover:text-yellow-900 dark:text-yellow-500 dark:hover:text-yellow-400"
                            : "text-green-600 hover:text-green-900 dark:text-green-500 dark:hover:text-green-400"
                            }`}
                        >
                          {b.isPublished ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          onClick={() => deleteBlog(b._id)}
                          className="text-red-600  hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                          aria-label="Delete blog"
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

          {/* CARD VIEW (MOBILE) */}
          <div className="md:hidden space-y-4">
            {filteredBlogs.map((b) => (
              <div
                key={b._id}
                className="flex items-center justify-between gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-all duration-200"
              >
                <div className="flex items-center gap-2 flex-1">
                  <img
                    src={
                      b?.thumbnail &&
                        b.thumbnail !== "null" &&
                        b.thumbnail !== "undefined"
                        ? `${API_BASE_URL}/${b.thumbnail}`
                        : userimg
                    }
                    alt={b.title}
                    className="w-10 h-10 rounded-md object-cover"
                    onError={handleImageError}
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
                    onClick={() => navigate(`/dashboard/write-blog/${b._id}`)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                    aria-label="Edit blog"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => navigate(`/view-blog/${b._id}`)}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                    aria-label="View blog"
                  >
                    <FiEye />
                  </button>
                  <button
                    onClick={() => publishBlog(b._id)}
                    className={`text-sm transition-colors duration-200 ${b.isPublished
                      ? "text-yellow-600 hover:text-yellow-900 dark:text-yellow-500 dark:hover:text-yellow-400"
                      : "text-green-600 hover:text-green-900 dark:text-green-500 dark:hover:text-green-400"
                      }`}
                  >
                    {b.isPublished ? "Unpub" : "Pub"}
                  </button>
                  <button
                    onClick={() => deleteBlog(b._id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                    aria-label="Delete blog"
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
  );
};

export default Blog;