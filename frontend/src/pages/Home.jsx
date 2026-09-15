import React, { useEffect, useState } from "react";
import axios from "axios";
import Autoplay from "embla-carousel-autoplay";
import { Badge } from "../components/ui/badge";
import Skeleton from "../components/Skeleton";
import RecentBlog from "../components/RecentBlog";
import { Card, CardContent } from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";

import { API_BASE_URL } from "../utils/api";
import { getBlogImageFallback, getBlogImageUrl } from "../utils/profileImage";
import AllUser from "./AllUser";

import {
  ChevronRight,
  Heart,
  Eye,
  Calendar,
  User,
  BookOpen,
  Users,
  Sparkles,
  TrendingUp,
  Code,
  Briefcase,
  Palette,
  GraduationCap,
  ArrowRight,
  PenLine,
  MessageCircle,
  Zap,
  Star,
  Quote,
} from "lucide-react";

// ✅ Module-level cache
let cachedBlogs = null;

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const [blogs, setBlogs] = useState(cachedBlogs || []);
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(!cachedBlogs);
  const [error, setError] = useState(null);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const fetchBlogsFromDB = async (isBackgroundRefresh = false) => {
    try {
      if (!isBackgroundRefresh) setLoading(true);
      setError(null);

      const { data } = await axios.get(`${API_BASE_URL}/api/v1/blog/feed`, {
        withCredentials: true,
        timeout: 30000,
        headers: { "Content-Type": "application/json" },
      });

      if (data?.success) {
        const publishedBlogs = (data.blogs || []).filter(
          (blog) => blog.isPublished === true
        );
        setBlogs(publishedBlogs);
        cachedBlogs = publishedBlogs;
      } else {
        if (!isBackgroundRefresh) {
          setError("Failed to fetch blogs");
          setBlogs([]);
        }
      }
    } catch (err) {
      if (!isBackgroundRefresh) {
        setError(
          err.response?.data?.message || err.message || "Failed to load blogs"
        );
        setBlogs([]);
      }
      if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
        setTimeout(() => fetchBlogsFromDB(isBackgroundRefresh), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cachedBlogs) fetchBlogsFromDB(true);
    else fetchBlogsFromDB(false);
  }, []);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const refreshBlogs = () => fetchBlogsFromDB(false);

  useEffect(() => {
    window.refreshHomeBlogs = refreshBlogs;
    return () => delete window.refreshHomeBlogs;
  }, []);

  // =====================================================
  // BACKGROUND GLOW
  // =====================================================
  const BackgroundGlow = () => (
    <>
      <div className="pointer-events-none absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[oklch(0.71_0.2_46.45)] opacity-[0.1] dark:opacity-[0.08] rounded-full blur-3xl animate-blob" />
      <div className="pointer-events-none absolute top-[200px] right-[-120px] w-[450px] h-[450px] bg-[oklch(0.8_0.15_60)] opacity-[0.1] dark:opacity-[0.07] rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="pointer-events-none absolute top-[900px] left-[20%] w-[400px] h-[400px] bg-gray-400 dark:bg-gray-600 opacity-[0.1] dark:opacity-[0.08] rounded-full blur-3xl animate-blob animation-delay-4000" />
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

  // =====================================================
  // SECTION HEADER — reusable
  // =====================================================
  const SectionHeader = ({ eyebrow, title, subtitle }) => (
    <div className="text-center mb-12 md:mb-14">
      <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-[oklch(0.71_0.2_46.45)] mb-3">
        {eyebrow}
      </span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );

  // ✅ LOADING
  if (loading) {
    return (
      <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
        <BackgroundGlow />
        <section className="relative pt-20 md:pt-28 w-full max-w-7xl mx-auto px-4 md:px-6 z-10">
          <Skeleton type="homeHero" count={1} />
        </section>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton type="blogCard" count={3} className="contents space-y-0" />
          </div>
        </div>
      </div>
    );
  }

  // ✅ ERROR
  if (error) {
    return (
      <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10 overflow-x-hidden">
        <BackgroundGlow />
        <div className="relative max-w-7xl mx-auto text-center z-10 pt-20">
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

  // ✅ DATA
  const publishedBlogs = blogs.filter((blog) => blog?.isPublished === true);
  const carouselBlogs = publishedBlogs.slice(0, 6);

  const totalBlogs = publishedBlogs.length;
  const totalAuthors = new Set(
    publishedBlogs.map((b) => b.author?._id).filter(Boolean)
  ).size;
  const totalCategories = new Set(
    publishedBlogs.map((b) => b.category).filter(Boolean)
  ).size;
  const totalLikes = publishedBlogs.reduce(
    (sum, b) => sum + (b.likes?.length || 0),
    0
  );

  const categoryMap = publishedBlogs.reduce((acc, blog) => {
    if (blog.category) {
      acc[blog.category] = (acc[blog.category] || 0) + 1;
    }
    return acc;
  }, {});

  const categories = Object.entries(categoryMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const categoryIcons = {
    Technology: Code,
    Coding: Code,
    Business: Briefcase,
    Lifestyle: Palette,
    Education: GraduationCap,
    "Generative AI": Sparkles,
    LLMs: Sparkles,
    others: BookOpen,
  };

  const trendingBlogs = [...publishedBlogs]
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 3);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <BackgroundGlow />

      {/* =====================================================
          HERO INTRO
      ===================================================== */}
      <section className="relative z-10 pt-20 md:pt-28 pb-12 md:pb-16 w-full max-w-7xl mx-auto px-4 md:px-6 text-center">
        {/* BADGE */}
        <div className="anim-fadeUp anim-float inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[oklch(0.71_0.2_46.45)]/10 border border-[oklch(0.71_0.2_46.45)]/20 text-xs md:text-sm font-semibold text-[oklch(0.71_0.2_46.45)] mb-5">
          <Sparkles className="anim-sparkle w-3.5 h-3.5" />
          Stories worth your time
        </div>

        {/* HEADING */}
        <h1 className="anim-fadeUp delay-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1] max-w-4xl mx-auto">
          Where Ideas Find{" "}
          <span className="shine-text underline-grow">Their Voice</span>
        </h1>

        {/* PARAGRAPH */}
        <p className="anim-fadeUp delay-200 mt-5 text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Discover insightful blogs, tutorials, and stories from developers,
          designers, and creators around the world.
        </p>

        {/* BUTTONS */}
        <div className="anim-fadeUp delay-300 flex flex-wrap items-center justify-center gap-3 mt-8">
          {/* Primary */}
          <button
            onClick={() => navigate("/blogs")}
            className="btn-lift group inline-flex items-center gap-2 bg-[oklch(0.71_0.2_46.45)] hover:bg-[oklch(0.65_0.2_46.45)] text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg shadow-[oklch(0.71_0.2_46.45)]/20 hover:shadow-xl"
          >
            <BookOpen className="w-4 h-4" />
            Start Reading
            <ArrowRight className="arrow-slide w-4 h-4" />
          </button>

          {/* Secondary */}
          <button
            onClick={() =>
              navigate(user ? "/dashboard/create-blogs" : "/signup")
            }
            className="btn-lift inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-[oklch(0.71_0.2_46.45)] text-gray-900 dark:text-white px-6 py-3 rounded-full font-semibold text-sm"
          >
            <PenLine className="w-4 h-4" />
            Start Writing
          </button>
        </div>
      </section>

      {/* =====================================================
          HERO CAROUSEL
      ===================================================== */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
  {carouselBlogs.length > 0 ? (
    <>
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "center" }}
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
            <CarouselItem key={item._id} className="basis-full pl-0">
              <Card className="rounded-2xl overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl transition-all duration-500 p-0">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    {/* TEXT SIDE */}
                    <div className="order-2 lg:order-1 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className="bg-gradient-to-r from-[oklch(0.71_0.2_46.45)] to-[oklch(0.8_0.15_60)] text-white border-0 px-3 py-1">
                          Featured
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.createdAt
                            ? formatDate(item.createdAt)
                            : "No Date"}
                        </span>
                      </div>

                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white capitalize leading-tight">
                        {item.title}
                      </h2>

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
                        onClick={() => navigate(`/view-blog/${item._id}`)}
                        className="group relative mt-6 w-fit bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          Read Article
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.71_0.2_46.45)] to-[oklch(0.8_0.15_60)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </button>
                    </div>

                    {/* IMAGE SIDE — flush, no gray bg behind */}
                    <div className="order-1 lg:order-2 relative h-64 lg:h-full lg:min-h-[450px] overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={getBlogImageUrl(item)}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getBlogImageFallback(
                            item?.title || "Blog"
                          );
                        }}
                      />
                      {/* Mobile bottom fade only */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10 lg:hidden" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex justify-center gap-2 mt-8">
        {carouselBlogs.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`group relative transition-all duration-300 rounded-full ${
              current === index
                ? "w-8 h-2 bg-gradient-to-r from-[oklch(0.71_0.2_46.45)] to-[oklch(0.8_0.15_60)]"
                : "w-2 h-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
            }`}
          >
            <span
              className={`absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${
                current === index
                  ? "text-[oklch(0.71_0.2_46.45)]"
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
        className="px-4 py-2 bg-[oklch(0.71_0.2_46.45)] text-white rounded-lg hover:bg-[oklch(0.65_0.2_46.45)] transition"
      >
        Refresh
      </button>
    </div>
  )}
</section>

      {/* =====================================================
          FEATURES
      ===================================================== */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <SectionHeader
          eyebrow="Why Choose Us"
          title="Everything You Need to Share"
          subtitle="A modern platform designed for writers, developers, and creators."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {[
            {
              icon: PenLine,
              title: "Write Freely",
              desc: "Rich editor with markdown support — write without limits.",
            },
            {
              icon: Users,
              title: "Reach Readers",
              desc: "Get your stories in front of a growing community.",
            },
            {
              icon: MessageCircle,
              title: "Engage & Discuss",
              desc: "Receive feedback and build conversations around ideas.",
            },
            {
              icon: Zap,
              title: "Fast & Modern",
              desc: "Lightning-fast performance with clean, modern design.",
            },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div
              key={i}
              className="group relative p-6 rounded-2xl bg-white/80 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 hover:border-[oklch(0.71_0.2_46.45)] hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[oklch(0.71_0.2_46.45)]/10 group-hover:bg-[oklch(0.71_0.2_46.45)]/20 flex items-center justify-center mb-5 transition-colors">
                <Icon className="w-5 h-5 text-[oklch(0.71_0.2_46.45)]" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          <StatCard
            icon={<BookOpen className="w-5 h-5" />}
            value={totalBlogs}
            label="Published Blogs"
          />
          <StatCard
            icon={<Users className="w-5 h-5" />}
            value={totalAuthors}
            label="Active Authors"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            value={totalCategories}
            label="Categories"
          />
          <StatCard
            icon={<Heart className="w-5 h-5" />}
            value={totalLikes}
            label="Total Likes"
          />
        </div>
      </section>

      {/* =====================================================
          TRENDING
      ===================================================== */}
      {trendingBlogs.length > 0 && (
        <section className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-14 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.15em] uppercase text-[oklch(0.71_0.2_46.45)] mb-3">
                <TrendingUp className="w-3.5 h-3.5" />
                Hot Right Now
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                Trending Blogs
              </h2>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-3">
                Most-loved stories this week.
              </p>
            </div>

            <button
              onClick={() => navigate("/blogs")}
              className="group inline-flex items-center gap-2 text-sm font-medium text-[oklch(0.71_0.2_46.45)] hover:gap-3 transition-all self-start md:self-auto"
            >
              View all
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingBlogs.map((blog, index) => (
              <div
                key={blog._id}
                onClick={() => navigate(`/view-blog/${blog._id}`)}
                className="group relative rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-[oklch(0.71_0.2_46.45)] hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-[oklch(0.71_0.2_46.45)] text-white flex items-center justify-center font-bold text-sm shadow-lg">
                  {index + 1}
                </div>

                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getBlogImageUrl(blog)}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getBlogImageFallback(
                        blog?.title || "Blog"
                      );
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <div className="p-5">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[oklch(0.71_0.2_46.45)] transition-colors">
                    {blog.title}
                  </h3>

                  <div className="flex items-center justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="truncate">
                      {blog.author?.firstName} {blog.author?.lastName}
                    </span>
                    <span className="flex items-center gap-1 text-red-500 font-medium shrink-0">
                      <Heart className="w-3.5 h-3.5" />
                      {blog.likes?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          CATEGORIES
      ===================================================== */}
      {categories.length > 0 && (
        <section className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <SectionHeader
            eyebrow="Explore Topics"
            title="Browse by Category"
            subtitle="Discover blogs across different topics written by our community."
          />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.name] || BookOpen;
              return (
                <button
                  key={cat.name}
                  onClick={() =>
                    navigate(`/search?q=${encodeURIComponent(cat.name)}`)
                  }
                  className="group relative p-6 rounded-2xl bg-white/80 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 hover:border-[oklch(0.71_0.2_46.45)] hover:shadow-lg transition-all duration-300 text-left overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.71_0.2_46.45)]/0 to-[oklch(0.71_0.2_46.45)]/0 group-hover:from-[oklch(0.71_0.2_46.45)]/5 group-hover:to-[oklch(0.8_0.15_60)]/5 transition-all duration-300" />

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-[oklch(0.71_0.2_46.45)]/10 group-hover:bg-[oklch(0.71_0.2_46.45)]/20 flex items-center justify-center mb-5 transition-colors">
                      <span className="text-[oklch(0.71_0.2_46.45)]">
                        <Icon className="w-5 h-5" />
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize group-hover:text-[oklch(0.71_0.2_46.45)] transition-colors">
                      {cat.name}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {cat.count} {cat.count === 1 ? "blog" : "blogs"}
                    </p>
                  </div>

                  <ChevronRight className="absolute top-6 right-6 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* =====================================================
          TESTIMONIALS
      ===================================================== */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <SectionHeader
          eyebrow="Loved by Writers"
          title="What Our Community Says"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Priya Sharma",
              role: "Tech Writer",
              quote:
                "The cleanest blogging platform I've used. The editor is fast and the community is supportive.",
            },
            {
              name: "Rahul Verma",
              role: "Full-Stack Developer",
              quote:
                "I share my coding tutorials here. The reading experience is excellent and the engagement is real.",
            },
            {
              name: "Aisha Khan",
              role: "UI/UX Designer",
              quote:
                "Beautiful design, thoughtful features. My design articles finally reach the right audience.",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="relative p-6 rounded-2xl bg-white/80 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200 dark:border-gray-700"
            >
              <Quote className="w-8 h-8 text-[oklch(0.71_0.2_46.45)]/20 mb-4" />

              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                "{t.quote}"
              </p>

              <div className="flex gap-0.5 mt-5">
                {[...Array(5)].map((_, s) => (
                  <Star
                    key={s}
                    className="w-3.5 h-3.5 fill-[oklch(0.71_0.2_46.45)] text-[oklch(0.71_0.2_46.45)]"
                  />
                ))}
              </div>

              <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
                <div className="w-10 h-10 rounded-full bg-[oklch(0.71_0.2_46.45)]/10 flex items-center justify-center text-[oklch(0.71_0.2_46.45)] font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[oklch(0.71_0.2_46.45)] to-[oklch(0.8_0.15_60)] p-10 md:p-16 text-center shadow-2xl">
          <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute bottom-[-40px] left-[-40px] w-40 h-40 bg-white/10 rounded-full" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold text-white mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Never Miss a Story
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
              Join Our Reading Community
            </h2>

            <p className="text-white/90 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Get the latest blogs, tutorials, and insights delivered straight
              to your inbox. Subscribe to stay ahead.
            </p>

            <button
              onClick={() => navigate("/blogs")}
              className="group inline-flex items-center gap-3 bg-white text-gray-900 hover:bg-gray-100 px-7 py-3.5 rounded-full font-semibold text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <BookOpen className="w-4 h-4" />
              Explore All Blogs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-white/70 text-xs mt-6">
              Or subscribe using the newsletter form in the footer ↓
            </p>
          </div>
        </div>
      </section>

      {/* RECENT BLOGS */}
      <section className="relative z-10 py-12 md:py-16">
        {publishedBlogs?.length === 0 ? (
          <p className="text-center py-10 text-gray-500 dark:text-gray-400">
            No Blog Found
          </p>
        ) : (
          <RecentBlog blogs={publishedBlogs} />
        )}
      </section>

      {/* USERS */}
      <section className="relative z-10 ">
        <AllUser />
      </section>
    </div>
  );
};

// =====================================================
// STAT CARD — reusable
// =====================================================
const StatCard = ({ icon, value, label }) => (
  <div className="group relative p-6 rounded-2xl bg-white/80 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 hover:border-[oklch(0.71_0.2_46.45)] hover:shadow-lg transition-all duration-300 text-center">
    <div className="w-12 h-12 mx-auto mb-5 rounded-xl bg-[oklch(0.71_0.2_46.45)]/10 group-hover:bg-[oklch(0.71_0.2_46.45)]/20 flex items-center justify-center transition-colors">
      <span className="text-[oklch(0.71_0.2_46.45)]">{icon}</span>
    </div>

    <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
      {value}
      <span className="text-[oklch(0.71_0.2_46.45)]">+</span>
    </p>

    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
      {label}
    </p>
  </div>
);

export default Home;