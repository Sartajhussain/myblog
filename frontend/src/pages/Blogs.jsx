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

const Blogs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ REDUX
  const { publicBlogs = [] } = useSelector(
    (state) => state.blog
  );

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const blogsPerPage = 6;

  // ✅ FETCH BLOGS
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // ✅ CACHE
        if (publicBlogs.length > 0) {
          setLoading(false);
          return;
        }

        setLoading(true);

        const { data } = await axios.get(
          `${API_BASE_URL}/api/v1/blog/feed`,
          {
            withCredentials: true,
          }
        );

        if (data?.success) {
          dispatch(
            setPublicBlogs(data.blogs || [])
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // ✅ IMAGE
  const getImage = (img) => {
    if (
      !img ||
      img === "null" ||
      img === "undefined" ||
      img === ""
    ) {
      return null;
    }

    return getBlogImage(img);
  };
      
  // ✅ FILTER BLOGS
  const filteredBlogs =
    categoryFilter === "All"
      ? publicBlogs
      : publicBlogs.filter(
          (b) => b.category === categoryFilter
        );

  // ✅ PAGINATION
  const indexOfLastBlog =
    currentPage * blogsPerPage;

  const indexOfFirstBlog =
    indexOfLastBlog - blogsPerPage;

  const currentBlogs = filteredBlogs.slice(
    indexOfFirstBlog,
    indexOfLastBlog
  );

  const totalPages = Math.ceil(
    filteredBlogs.length / blogsPerPage
  );

  const handleReadMore = (id) => {
    navigate(`/view-blog/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 mt-13 px-4 md:px-8 py-10 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* BLOG SECTION */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
            Published Blogs
          </h1>

          {loading ? (
            <Skeleton
              type="blogCard"
              count={6}
              className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6"
            />
          ) : currentBlogs.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No blogs found.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentBlogs.map((item) => (
                <div
                  key={item._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden group"
                >
                  {getImage(
                    item.thumbnail ||
                      item.image ||
                      item.coverImage
                  ) && (
                    <img
                      src={getImage(
                        item.thumbnail ||
                          item.image ||
                          item.coverImage
                      )}
                      alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.target.onerror = null;

                        e.target.src =
                          "https://placehold.co/600x400?text=No+Image";
                      }}
                    />
                  )}

                  <div className="p-5 space-y-3">
                    <div className="text-xs text-gray-500 flex justify-between">
                      Posted By{" "}
                      {item.author?.firstName}{" "}
                      {item.author?.lastName}

                      <span>
                        {new Date(
                          item.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>

                    <h2 className="text-lg font-semibold line-clamp-2 dark:text-white">
                      {item.title}
                    </h2>

                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {item.subtitle}
                    </p>

                    <button
                      onClick={() =>
                        handleReadMore(item._id)
                      }
                      className="mt-2 px-4 py-2 bg-black text-white rounded-lg text-sm"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>

        {/* SIDEBAR */}
        <div className="order-1 lg:order-2">
          <PublishedBlogSideBar
            blogs={publicBlogs}
            setCategoryFilter={
              setCategoryFilter
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Blogs;