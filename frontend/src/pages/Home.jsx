import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Autoplay from "embla-carousel-autoplay";
import { Badge } from "../components/ui/badge";
import Skeleton from "../components/Skeleton";
import { getBlogImage } from "../utils/getBlogImage";
import RecentBlog from "../components/RecentBlog";
import { Card, CardContent } from "../components/ui/card";
import { setPublicBlogs } from "../redux/blogSlice";


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
  const dispatch = useDispatch();

  // ✅ PUBLIC BLOGS
  const { publicBlogs } = useSelector((state) => state.blog);

  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ CAROUSEL BLOGS
  const carouselBlogs = publicBlogs?.slice(0, 6) || [];

  // ✅ DATE FORMAT
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ✅ FETCH BLOGS
  const fetchBlogs = async () => {
    try {
      // ✅ REDUX CACHE
      if (publicBlogs?.length > 0) {
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
        dispatch(setPublicBlogs(data.blogs || []));
      }
    } catch (err) {
      console.log("FETCH BLOG ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ INITIAL FETCH
  useEffect(() => {
    fetchBlogs();
  }, []);

  // ✅ CAROUSEL SELECT
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

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

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative mt-5 w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 z-10">

        {/* BG */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-blue-950/20 rounded-3xl -z-10" />

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

                      {/* LEFT */}
                      <div className="order-2 lg:order-1 p-6 md:p-8 lg:p-10 flex flex-col justify-center">

                        {/* BADGE */}
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

                        {/* TITLE */}
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white capitalize leading-tight">
                          {item.title}
                        </h1>

                        {/* AUTHOR */}
                        <div className="flex items-center gap-2 mt-3 text-sm text-gray-600 dark:text-gray-400">

                          <User className="w-4 h-4" />

                          <span>
                            By {item.author?.firstName || "Unknown"}{" "}
                            {item.author?.lastName || ""}
                          </span>
                        </div>

                        {/* DESCRIPTION */}
                        <p className="mt-4 text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                          {item.subtitle ||
                            item.content?.substring(0, 120) ||
                            "Click to read this amazing blog post..."}
                        </p>

                        {/* STATS */}
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

                        {/* BUTTON */}
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
                      <div className="order-1 lg:order-2 relative h-64 lg:h-[450px] overflow-hidden group">

                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10 lg:hidden" />

                        <img
  src={
    getBlogImage(item.thumbnail || item.image || item.coverImage) ||
    "https://ui-avatars.com/api/?name=User"
  }
  alt={item.title}
  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 rounded-lg"
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src =
      "https://ui-avatars.com/api/?name=User";
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

        {/* COUNTER */}
        <div className="text-center mt-4 text-xs text-gray-400 dark:text-gray-600">
          {current + 1} / {carouselBlogs.length}
        </div>
      </section>

      {/* RECENT BLOGS */}
      {publicBlogs?.length === 0 ? (
        <p className="text-center py-10 text-gray-500 dark:text-gray-400">
          No Blog Found
        </p>
      ) : (
        <RecentBlog blogs={publicBlogs} />
      )}

      {/* USERS */}
      <AllUser />
    </>
  );
};

export default Home;