import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Autoplay from "embla-carousel-autoplay";
import { Badge } from "../components/ui/badge";
import Skeleton from "../components/Skeleton";
import RecentBlog from "../components/RecentBlog";
import { Card, CardContent } from "../components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";

import { API_BASE_URL } from "../utils/api";
import AllUser from "./AllUser";

import {
  ChevronRight,
  Heart,
  Eye,
  Calendar,
  User,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  // ✅ DIRECT STATE - No Redux dependency
  const [blogs, setBlogs] = useState([]);
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ DATE FORMAT
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ✅ FUNCTION TO GET CORRECT IMAGE URL
  const getCorrectImageUrl = (blog) => {
    const imagePath = blog.thumbnail || blog.image || blog.coverImage;
    
    if (!imagePath) {
      return "https://placehold.co/1200x800/6366f1/white?text=Blog+Image";
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/uploads') || imagePath.startsWith('uploads')) {
      return `${API_BASE_URL}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
    }
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.title || 'Blog')}&background=6366f1&color=fff&size=400`;
  };

  // ✅ FETCH BLOGS DIRECTLY FROM DB
  const fetchBlogsFromDB = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔄 Home: Fetching blogs directly from DB...");
      console.log("API URL:", `${API_BASE_URL}/api/v1/blog/feed`);

      const { data } = await axios.get(
        `${API_BASE_URL}/api/v1/blog/feed`,
        {
          withCredentials: true,
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log("📦 API Response:", data);

      if (data?.success) {
        const publishedBlogs = (data.blogs || []).filter(
          (blog) => blog.isPublished === true
        );

        console.log(`✅ Found ${publishedBlogs.length} published blogs`);
        
        // Debug: Log first blog to check structure
        if (publishedBlogs.length > 0) {
          console.log("📝 First blog sample:", {
            id: publishedBlogs[0]._id,
            title: publishedBlogs[0].title,
            category: publishedBlogs[0].category,
            author: publishedBlogs[0].author,
            thumbnail: publishedBlogs[0].thumbnail,
            image: publishedBlogs[0].image,
            coverImage: publishedBlogs[0].coverImage,
            isPublished: publishedBlogs[0].isPublished
          });
        }

        setBlogs(publishedBlogs);
      } else {
        console.error("❌ API returned success: false", data);
        setError("Failed to fetch blogs");
        setBlogs([]);
      }
    } catch (err) {
      console.error("❌ FETCH BLOG ERROR:", err);
      console.error("Error details:", {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status
      });
      
      setError(err.response?.data?.message || err.message || "Failed to load blogs");
      setBlogs([]);
      
      // Retry logic
      if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
        console.log("⏱️ Timeout, retrying in 2 seconds...");
        setTimeout(() => fetchBlogsFromDB(), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ INITIAL FETCH
  useEffect(() => {
    fetchBlogsFromDB();
  }, []);

  // ✅ CAROUSEL SELECT
  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // ✅ Manual refresh function
  const refreshBlogs = () => {
    console.log("🔄 Manual refresh triggered");
    fetchBlogsFromDB();
  };

  // ✅ Make refresh function available globally
  useEffect(() => {
    window.refreshHomeBlogs = refreshBlogs;
    return () => {
      delete window.refreshHomeBlogs;
    };
  }, []);

  // ✅ LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton type="blogCard" count={3} />
          <Skeleton type="blogCard" count={1} />
        </div>
      </div>
    );
  }

  // ✅ ERROR UI
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10 mt-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
              Error Loading Blogs
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <button
              onClick={refreshBlogs}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ FILTER PUBLISHED BLOGS
  const publishedBlogs = blogs.filter(blog => blog?.isPublished === true);
  const carouselBlogs = publishedBlogs.slice(0, 6);

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative mt-5 w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-blue-950/20 rounded-3xl -z-10" />

        {carouselBlogs.length > 0 ? (
          <>
            <Carousel
              setApi={setApi}
              opts={{
                loop: true,
                align: "center",
              }}
              plugins={[
                Autoplay({
                  delay: 5000,
                  stopOnInteraction: false,
                  stopOnMouseEnter: true,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-0">
                {carouselBlogs.map((item) => (
                  <CarouselItem
                    key={item._id}
                    className="basis-full pl-0"
                  >
                    <Card className="rounded-2xl overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl transition-all duration-500">
                      <CardContent className="p-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                          {/* LEFT CONTENT */}
                          <div className="order-2 lg:order-1 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-4">
                              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-3 py-1">
                                Featured
                              </Badge>
                              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {item.createdAt
                                  ? formatDate(item.createdAt)
                                  : "No Date"}
                              </span>
                            </div>

                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white capitalize leading-tight">
                              {item.title}
                            </h1>

                            <div className="flex items-center gap-2 mt-3 text-sm text-gray-600 dark:text-gray-400">
                              <User className="w-4 h-4" />
                              <span>
                                By {item.author?.firstName || "Unknown"}{" "}
                                {item.author?.lastName || ""}
                              </span>
                            </div>

                            <p className="mt-4 text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                              {item.subtitle ||
                                item.content?.substring(0, 120) ||
                                "Click to read this amazing blog post..."}
                            </p>

                            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Heart className="w-4 h-4 text-red-500" />
                                {item.likes?.length || 0} likes
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {item.views?.length || 0} views
                              </span>
                            </div>

                            <button
                              onClick={() =>
                                navigate(`/view-blog/${item._id}`)
                              }
                              className="group relative mt-6 w-fit bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg"
                            >
                              <span className="relative z-10 flex items-center gap-2">
                                Read Article
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </span>
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                          </div>

                          {/* RIGHT IMAGE */}
                          <div className="order-1 lg:order-2 relative h-64 lg:h-[450px] rounded-md overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10 lg:hidden" />
                            
                            <img
                              src={getCorrectImageUrl(item)}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110  rounded-md"
                              onError={(e) => {
                                console.error(`❌ Image failed to load for blog: ${item.title}`);
                                console.error(`   Attempted URL: ${getCorrectImageUrl(item)}`);
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = `https://placehold.co/1200x800/6366f1/white?text=${encodeURIComponent(item.title?.substring(0, 20) || 'Blog')}`;
                              }}
                              onLoad={() => {
                                console.log(`✅ Image loaded for: ${item.title}`);
                              }}
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* DOTS */}
            <div className="flex justify-center gap-2 mt-6">
              {carouselBlogs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`group relative transition-all duration-300 rounded-full ${
                    current === index
                      ? "w-8 h-2 bg-gradient-to-r from-purple-600 to-pink-600"
                      : "w-2 h-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${
                      current === index
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </span>
                </button>
              ))}
            </div>

            <div className="text-center mt-4 text-xs text-gray-400 dark:text-gray-600">
              {current + 1} / {carouselBlogs.length}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No published blogs yet. Check back soon!
            </p>
            <button
              onClick={refreshBlogs}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Refresh
            </button>
          </div>
        )}
      </section>

      {/* RECENT BLOGS */}
      {publishedBlogs?.length === 0 ? (
        <p className="text-center py-10 text-gray-500 dark:text-gray-400">
          No Blog Found
        </p>
      ) : (
        <RecentBlog blogs={publishedBlogs} />
      )}

      {/* USERS */}
      <AllUser />
    </>
  );
};

export default Home;