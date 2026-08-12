import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaBlog, 
  FaComment, 
  FaPlus, 
  FaHome 
} from "react-icons/fa";
import { getProfileImage } from "../utils/profileImage";
import userimg from "../assets/userprofile.png";

const Sidebar = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  // Exact profile picture check with fallback to local asset
  const avatarUrl =
    user?.profilePic ||
    user?.avatar ||
    user?.profileImage ||
    user?.profilePicture ||
    (getProfileImage ? getProfileImage(user?.profilePic) : null) ||
    userimg;

  return (
    <aside
      className="
        hidden md:flex md:w-64 lg:w-72
        fixed left-0 top-0 min-h-screen
        bg-white dark:bg-slate-900
        border-r border-gray-200 dark:border-slate-700
        p-5 lg:p-6 z-40 flex-col
        shadow-sm dark:shadow-none
        transition-colors duration-300
      "
    >
      {/* Logo / Title */}
      <div className="mb-8 mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h2>
        {/* <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Welcome back, {user?.firstName || "User"}!
        </p> */}
      </div>

      {/* Menu */}
      <nav className="flex-1">
        <ul className="space-y-2">

          {/* PROFILE */}
          <li>
            <NavLink
              to={user ? "/dashboard/profile" : "/login"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm md:text-base font-medium ${
                  isActive
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white"
                }`
              }
            >
              <FaUser size={18} />
              <span>Profile</span>
            </NavLink>
          </li>

          {/* YOUR BLOGS */}
          <li>
            <NavLink
              to={user ? "/dashboard/blog" : "/login"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm md:text-base font-medium ${
                  isActive
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white"
                }`
              }
            >
              <FaBlog size={18} />
              <span>Your Blogs</span>
            </NavLink>
          </li>

          {/* COMMENTS */}
          <li>
            <NavLink
              to={user ? "/dashboard/comments" : "/login"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm md:text-base font-medium ${
                  isActive
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white"
                }`
              }
            >
              <FaComment size={18} />
              <span>Comments</span>
            </NavLink>
          </li>

          {/* CREATE BLOGS */}
          <li>
            <NavLink
              to={user ? "/dashboard/create-blogs" : "/login"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm md:text-base font-medium ${
                  isActive
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white"
                }`
              }
            >
              <FaPlus size={18} />
              <span>Create Blogs</span>
            </NavLink>
          </li>

          {/* HOME */}
          <li className="pt-4 border-t border-gray-200 dark:border-slate-700">
            <NavLink
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white"
            >
              <FaHome size={18} />
              <span>Home</span>
            </NavLink>
          </li>

        </ul>
      </nav>

      {/* USER PROFILE SECTION */}
      {user && (
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-slate-700 cursor-pointer" onClick={() => navigate("/dashboard/profile")}>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-800/80 group">
            <div className="relative shrink-0">
              <img
                src={avatarUrl}
                alt={user?.firstName || "User"}
                onError={(e) => { 
                  e.target.onerror = null;
                  e.target.src = userimg;
                }}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-300 dark:ring-gray-600 group-hover:ring-gray-900 dark:group-hover:ring-white transition-all duration-200"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user?.firstName ? `${user?.firstName} ${user?.lastName || ""}` : user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      )}

    </aside>
  );
};

export default Sidebar;