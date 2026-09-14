import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiBookOpen,
  FiMessageCircle,
  FiUsers,
} from "react-icons/fi";

import { API_BASE_URL } from "../utils/api";
import userimg from "../assets/userprofile.png";
import UserProfileModal from "../components/UserProfileModal";
import { useNavigate } from "react-router-dom";

const AllUserProfile = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [userBlogs, setUserBlogs] = useState({});
  const [userComments, setUserComments] = useState({});
  const [loading, setLoading] = useState(true);

  // FETCH USERS & STATS
  const getUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_BASE_URL}/api/v1/user/all-users`,
        { withCredentials: true }
      );

      if (data.success) {
        const fetchedUsers = data.users || data.data || [];
        setUsers(fetchedUsers);

        // Fetch extra stats concurrently
        await fetchUserStats(fetchedUsers);
      }
    } catch (error) {
      // Console removed
    } finally {
      setLoading(false);
    }
  };

  // FETCH USER'S BLOGS AND COMMENTS IN PARALLEL
  const fetchUserStats = async (usersList) => {
    const blogsMap = {};
    const commentsMap = {};

    await Promise.all(
      usersList.map(async (user) => {
        const userId = user._id || user.id;

        // Fetch Blogs
        try {
          const blogsRes = await axios.get(
            `${API_BASE_URL}/api/v1/blog/user/${userId}`,
            { withCredentials: true }
          );

          if (blogsRes.data.success) {
            blogsMap[userId] =
              blogsRes.data.blogs ||
              blogsRes.data.data ||
              blogsRes.data.userBlogs ||
              [];
          }
        } catch (err) {
          blogsMap[userId] = [];
        }

        // Fetch Comments
        try {
          const commentsRes = await axios.get(
            `${API_BASE_URL}/api/v1/comment/user/${userId}`,
            { withCredentials: true }
          );

          if (commentsRes.data.success) {
            commentsMap[userId] =
              commentsRes.data.comments ||
              commentsRes.data.data ||
              commentsRes.data.userComments ||
              [];
          }
        } catch (err) {
          commentsMap[userId] = [];
        }
      })
    );

    setUserBlogs(blogsMap);
    setUserComments(commentsMap);
  };

  useEffect(() => {
    // Component render hone par Page Top par jayega
    window.scrollTo(0, 0);
    getUsers();
  }, []);

  // OPEN MODAL
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // SEARCH FILTER
  const filteredUsers = users.filter((u) =>
    `${u.firstName || ""} ${u.lastName || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // GET PROFILE IMAGE
  const getProfileImage = (profilePic) => {
    if (
      !profilePic ||
      profilePic === "null" ||
      profilePic === "undefined" ||
      profilePic.trim() === ""
    ) {
      return userimg;
    }
    if (profilePic.startsWith("http")) {
      return profilePic;
    }
    return `${API_BASE_URL}/${profilePic}`;
  };

  // PROPER PRIORITY GETTERS FOR COUNTS
  const getBlogCount = (user) => {
    if (!user) return 0;
    const userId = user._id || user.id;

    if (Array.isArray(user.blogs) && user.blogs.length > 0) {
      return user.blogs.length;
    }
    if (typeof user.blogCount === "number") {
      return user.blogCount;
    }
    if (Array.isArray(userBlogs[userId]) && userBlogs[userId].length > 0) {
      return userBlogs[userId].length;
    }

    return 0;
  };

  const getCommentCount = (user) => {
    if (!user) return 0;
    const userId = user._id || user.id;

    if (Array.isArray(user.comments) && user.comments.length > 0) {
      return user.comments.length;
    }
    if (typeof user.commentCount === "number") {
      return user.commentCount;
    }
    if (Array.isArray(userComments[userId]) && userComments[userId].length > 0) {
      return userComments[userId].length;
    }

    return 0;
  };

  // =====================================================
  // BACKGROUND GLOW — same theme as Home/About/Contact/Footer
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

  // SKELETON LOADER COMPONENT
  if (loading) {
    return (
      <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden py-10 px-4 md:px-10">
        <BackgroundGlow />

        <div className="relative z-10">
          {/* Header Skeleton */}
          <div className="pt-20 flex flex-col items-center mb-10">
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded mt-4 animate-pulse"></div>
          </div>

          {/* Search Bar Skeleton */}
          <div className="flex justify-center mb-10">
            <div className="w-full max-w-md h-11 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>

          {/* Cards Skeleton Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-10">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-800/40 animate-pulse"
              >
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden py-10 px-4 md:px-10">
      <BackgroundGlow />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="pt-20 flex flex-col items-center text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[oklch(0.6_0.2_46.45)] bg-[oklch(0.71_0.2_46.45)]/10 px-3 py-1 rounded-full">
            <FiUsers className="w-3.5 h-3.5" />
            Community
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Total Authors:{" "}
            <span className="bg-gradient-to-r from-[oklch(0.71_0.2_46.45)] to-[oklch(0.8_0.15_60)] bg-clip-text text-transparent">
              {filteredUsers.length}
            </span>
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-md">
            Browse every writer contributing to the kingdom of stories.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="flex justify-center mb-10">
          <div className="relative w-full max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search user by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full
              border border-gray-200 dark:border-gray-700
              bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm
              text-sm text-gray-800 dark:text-white
              outline-none focus:ring-2 focus:ring-[oklch(0.71_0.2_46.45)]/40 focus:border-[oklch(0.71_0.2_46.45)]/50
              transition"
            />
          </div>
        </div>

        {/* USERS GRID */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-10">
            {filteredUsers.map((user) => {
              const blogCount = getBlogCount(user);
              const commentCount = getCommentCount(user);

              return (
                <div
                  key={user._id || user.id}
                  onClick={() => handleUserClick(user)}
                  className="group relative flex flex-col items-center gap-2 p-5
                  rounded-2xl border border-gray-100 dark:border-gray-800
                  bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm
                  shadow-sm hover:shadow-xl hover:-translate-y-1
                  transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* hover gradient wash */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-[oklch(0.71_0.2_46.45)]/[0.06] to-transparent" />

                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[oklch(0.71_0.2_46.45)] to-[oklch(0.8_0.15_60)] opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
                    <img
                      src={getProfileImage(user.profilePic)}
                      alt={user.firstName}
                      loading="lazy"
                      className="relative w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white dark:border-gray-900 shadow-md group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = userimg;
                      }}
                    />
                  </div>

                  <p className="relative text-sm md:text-base font-semibold text-center capitalize text-gray-900 dark:text-white mt-1">
                    {user.firstName} {user.lastName}
                  </p>

                  {/* STATS */}
                  <div className="relative flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <FiBookOpen className="w-3 h-3" />
                      {blogCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiMessageCircle className="w-3 h-3" />
                      {commentCount}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16 md:py-20 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/30 mb-10">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[oklch(0.71_0.2_46.45)]/10 text-[oklch(0.6_0.2_46.45)] mb-3">
              <FiUsers className="w-6 h-6" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              No authors found
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Try a different search term.
            </p>
          </div>
        )}
      </div>

      {/* MODAL */}
      <UserProfileModal
        isOpen={isModalOpen}
        user={selectedUser}
        userBlogs={
          Array.isArray(selectedUser?.blogs) && selectedUser.blogs.length > 0
            ? selectedUser.blogs
            : userBlogs[selectedUser?._id || selectedUser?.id] || []
        }
        userComments={
          Array.isArray(selectedUser?.comments) && selectedUser.comments.length > 0
            ? selectedUser.comments
            : userComments[selectedUser?._id || selectedUser?.id] || []
        }
        onClose={() => setIsModalOpen(false)}
        onViewBlog={(blogId) => navigate(`/view-blog/${blogId}`)}
      />
    </div>
  );
};

export default AllUserProfile;