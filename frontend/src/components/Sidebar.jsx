import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  FaUser, 
  FaBlog, 
  FaComment, 
  FaPlus, 
  FaHome 
} from "react-icons/fa";

const Sidebar = () => {

  const { user } = useSelector(
    (store) => store.auth
  );

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
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Welcome back, {user?.firstName || "User"}!
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1">
        <ul className="space-y-2">

          {/* PROFILE */}
          <li>
            <NavLink
              to={user ? "/dashboard/profile" : "/login"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm md:text-base ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
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
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm md:text-base ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
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
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm md:text-base ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
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
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm md:text-base ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                }`
              }
            >
              <FaPlus size={18} />
              <span>Create Blogs</span>
            </NavLink>
          </li>

          {/* HOME - Optional */}
          <li className="pt-4 border-t border-gray-200 dark:border-slate-700">
            <NavLink
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm md:text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
            >
              <FaHome size={18} />
              <span>Home</span>
            </NavLink>
          </li>

        </ul>
      </nav>

      {/* User Avatar at Bottom - Optional */}
      {user && (
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.firstName?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.firstName} {user?.lastName}
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