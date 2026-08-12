import React from "react";
import { 
  FiAward, 
  FiTrendingUp, 
  FiUsers, 
  FiBookOpen, 
  FiMessageSquare, 
  FiArrowRight, 
  FiStar 
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import userimg from "../assets/userprofile.png";

const AuthorHighlights = ({ users = [], userBlogs = {}, userComments = {}, onUserClick }) => {
  const navigate = useNavigate();

  // Helper function to safely get count
  const getBlogCount = (user) => {
    const userId = user._id || user.id;
    if (Array.isArray(user.blogs)) return user.blogs.length;
    if (typeof user.blogCount === "number") return user.blogCount;
    if (Array.isArray(userBlogs[userId])) return userBlogs[userId].length;
    return 0;
  };

  const getCommentCount = (user) => {
    const userId = user._id || user.id;
    if (Array.isArray(user.comments)) return user.comments.length;
    if (typeof user.commentCount === "number") return user.commentCount;
    if (Array.isArray(userComments[userId])) return userComments[userId].length;
    return 0;
  };

  // Calculate Overall Platform Stats
  const totalUsers = users.length;
  const totalBlogs = Object.values(userBlogs).reduce((acc, curr) => acc + (curr?.length || 0), 0);
  const totalComments = Object.values(userComments).reduce((acc, curr) => acc + (curr?.length || 0), 0);

  // Get Top 3 Authors based on total activity
  const topAuthors = [...users]
    .map((user) => ({
      ...user,
      activityScore: getBlogCount(user) * 2 + getCommentCount(user),
      blogsCount: getBlogCount(user),
      commentsCount: getCommentCount(user),
    }))
    .sort((a, b) => b.activityScore - a.activityScore)
    .slice(0, 3);

  return (
    <section className="mt-16 pt-12 pb-16 px-4 md:px-10 bg-gradient-to-b from-transparent via-gray-100/50 dark:via-gray-800/30 to-transparent rounded-3xl">
      
      {/* SECTION HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 mb-3">
          <FiStar className="text-yellow-500 fill-yellow-500" /> Community Spotlight
        </span>
        <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Top Contributors & Platform Insights
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Celebrating our most active authors and community engagement.
        </p>
      </div>

      {/* 1. PLATFORM STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-16 max-w-5xl mx-auto">
        
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800/80 backdrop-blur-md border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow-md transition group">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
            <FiUsers />
          </div>
          <h4 className="text-3xl font-black text-gray-900 dark:text-white">{totalUsers}+</h4>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Active Authors</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800/80 backdrop-blur-md border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow-md transition group">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
            <FiBookOpen />
          </div>
          <h4 className="text-3xl font-black text-gray-900 dark:text-white">{totalBlogs}+</h4>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Published Articles</p>
        </div>

        <div className="col-span-2 md:col-span-1 p-6 rounded-2xl bg-white dark:bg-gray-800/80 backdrop-blur-md border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow-md transition group">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
            <FiMessageSquare />
          </div>
          <h4 className="text-3xl font-black text-gray-900 dark:text-white">{totalComments}+</h4>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Discussions & Comments</p>
        </div>

      </div>

      {/* 2. TOP PERFORMING AUTHORS */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiAward className="text-yellow-500" /> Featured Authors of the Month
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topAuthors.map((author, index) => {
            const ranks = [
              { badge: "🥇 Rank 1", gradient: "from-amber-400 via-orange-500 to-yellow-500" },
              { badge: "🥈 Rank 2", gradient: "from-slate-300 via-gray-400 to-zinc-500" },
              { badge: "🥉 Rank 3", gradient: "from-amber-600 via-yellow-700 to-amber-800" },
            ];

            return (
              <div
                key={author._id || author.id}
                onClick={() => onUserClick && onUserClick(author)}
                className="relative p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group overflow-hidden"
              >
                {/* Glowing Background Accent */}
                <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${ranks[index].gradient} opacity-10 rounded-bl-full group-hover:scale-125 transition duration-500`} />

                {/* Rank Badge */}
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 mb-4">
                  {ranks[index].badge}
                </span>

                <div className="flex items-center gap-4">
                  <img
                    src={author.profilePic || userimg}
                    alt={author.firstName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 group-hover:border-blue-500 transition"
                    onError={(e) => { e.target.src = userimg; }}
                  />
                  <div>
                    <h5 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-500 transition capitalize">
                      {author.firstName} {author.lastName}
                    </h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Top Contributor
                    </p>
                  </div>
                </div>

                {/* Author Quick Stats */}
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/60 flex justify-between items-center text-xs text-gray-600 dark:text-gray-300">
                  <span className="flex items-center gap-1 font-medium">
                    <FiBookOpen className="text-blue-500" /> {author.blogsCount} Posts
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <FiMessageSquare className="text-emerald-500" /> {author.commentsCount} Comments
                  </span>
                  <FiArrowRight className="text-gray-400 group-hover:translate-x-1 group-hover:text-blue-500 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};

export default AuthorHighlights;