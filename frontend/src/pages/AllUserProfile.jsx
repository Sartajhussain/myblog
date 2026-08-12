import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiBookOpen,
  FiMessageCircle,
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

  // SKELETON LOADER COMPONENT
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 md:px-10">
        {/* Header Skeleton */}
        <div className="pt-20 flex flex-col items-center mb-6">
          <div className="h-8 w-64 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-1/3 h-1 bg-gray-300 dark:bg-gray-700 mt-4 rounded"></div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-md h-10 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
        </div>

        {/* Cards Skeleton Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-10">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow animate-pulse"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-300 dark:bg-gray-700"></div>
              <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 md:px-10">
      {/* HEADER */}
      <h2 className="text-4xl pt-20 font-bold text-center text-gray-900 dark:text-white mb-6">
        Total Authors: {filteredUsers.length}
        <hr className="w-1/3 border-t-4 border-gray-600 mx-auto mt-4" />
      </h2>

      {/* SEARCH BAR */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search user by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full 
            border bg-white dark:bg-gray-800 
            text-gray-800 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* USERS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-10">
        {filteredUsers.map((user) => {
          return (
            <div
              key={user._id || user.id}
              onClick={() => handleUserClick(user)}
              className="flex flex-col items-center gap-2 p-4 
              bg-white dark:bg-gray-800 rounded-xl shadow 
              hover:shadow-lg transition cursor-pointer group"
            >
              <img
                src={getProfileImage(user.profilePic)}
                alt={user.firstName}
                loading="lazy"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 group-hover:border-blue-500 transition"
                onError={(e) => {
                  e.target.src = userimg;
                }}
              />

              <p className="text-base font-semibold text-center capitalize text-gray-900 dark:text-white mt-2">
                {user.firstName} {user.lastName}
              </p>
            </div>
          );
        })}
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