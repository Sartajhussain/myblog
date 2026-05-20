import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiInstagram,
  FiFacebook,
  FiLinkedin,
  FiGithub,
  FiSearch,
  FiBookOpen,
  FiMessageCircle,
  FiEye,
  FiHeart,
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

  // FETCH USERS
  const getUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_BASE_URL}/api/v1/user/all-users`,
        { withCredentials: true }
      );

      if (data.success) {
        setUsers(data.users || []);
        
        // Fetch blogs and comments for each user
        await fetchUserStats(data.users || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // FETCH USER'S BLOGS AND COMMENTS
  const fetchUserStats = async (usersList) => {
    const blogsMap = {};
    const commentsMap = {};

    for (const user of usersList) {
      try {
        // Fetch user's blogs
        const blogsRes = await axios.get(
          `${API_BASE_URL}/api/v1/blog/user/${user._id}`,
          { withCredentials: true }
        );
        
        if (blogsRes.data.success) {
          blogsMap[user._id] = blogsRes.data.blogs || [];
        } else {
          blogsMap[user._id] = [];
        }

        // Fetch user's comments
        const commentsRes = await axios.get(
          `${API_BASE_URL}/api/v1/comment/user/${user._id}`,
          { withCredentials: true }
        );
        
        if (commentsRes.data.success) {
          commentsMap[user._id] = commentsRes.data.comments || [];
        } else {
          commentsMap[user._id] = [];
        }
      } catch (error) {
        console.log(`Error fetching stats for user ${user._id}:`, error);
        blogsMap[user._id] = [];
        commentsMap[user._id] = [];
      }
    }

    setUserBlogs(blogsMap);
    setUserComments(commentsMap);
  };

  useEffect(() => {
    getUsers();
  }, []);

  // OPEN MODAL
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // SEARCH FILTER
  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // GET PROFILE IMAGE
  const getProfileImage = (profilePic) => {
    if (!profilePic || profilePic === "null" || profilePic === "undefined" || profilePic.trim() === "") {
      return userimg;
    }
    if (profilePic.startsWith("http")) {
      return profilePic;
    }
    return `${API_BASE_URL}/${profilePic}`;
  };

  // GET BLOG IMAGE
  const getBlogImage = (blog) => {
    const imagePath = blog?.thumbnail || blog?.image || blog?.coverImage;
    if (!imagePath || imagePath === "null" || imagePath === "undefined") {
      return "https://placehold.co/400x200/6366f1/white?text=No+Image";
    }
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    if (imagePath.startsWith("/uploads")) {
      return `${API_BASE_URL}${imagePath}`;
    }
    return `${API_BASE_URL}/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 md:px-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-10">
        {filteredUsers.map((user) => {
          const blogCount = userBlogs[user._id]?.length || 0;
          const commentCount = userComments[user._id]?.length || 0;
          
          return (
            <div
              key={user._id}
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

              {/* STATS - Blogs & Comments */}
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <FiBookOpen className="w-4 h-4" />
                  <span>{blogCount} Blogs</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <FiMessageCircle className="w-4 h-4" />
                  <span>{commentCount} Comments</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      <UserProfileModal
        isOpen={isModalOpen}
        user={selectedUser}
        userBlogs={userBlogs[selectedUser?._id] || []}
        userComments={userComments[selectedUser?._id] || []}
        onClose={() => setIsModalOpen(false)}
        onViewBlog={(blogId) => navigate(`/view-blog/${blogId}`)}
      />
    </div>
  );
};

export default AllUserProfile;