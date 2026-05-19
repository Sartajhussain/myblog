import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {

  const { user } = useSelector(
    (store) => store.auth
  );

  return (
    <aside
      className="
        w-64 hidden md:block md:w-[300px] -z-0
        fixed left-0 top-0 min-h-screen
        bg-white dark:bg-slate-900
        border-r border-gray-200 dark:border-slate-700
        font-medium text-gray-800 dark:text-gray-200
        p-6 z-40 flex flex-col
        shadow-sm dark:shadow-none
        transition-colors duration-300
      "
    >

      {/* Logo / Title */}
      <h2
        className="
          text-2xl font-bold mb-3 mt-10
          text-gray-900 dark:text-white
        "
      >
        Dashboard
      </h2>

      {/* Menu */}
      <nav className="flex-1">
        <ul className="space-y-3">

          {/* PROFILE */}
          <li>
            <NavLink
              to={user ? "/dashboard/profile" : "/login"}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl transition-all duration-200 text-base ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800"
                }`
              }
            >
              Profile
            </NavLink>
          </li>

          {/* YOUR BLOGS */}
          <li>
            <NavLink
              to={user ? "/dashboard/blog" : "/login"}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl transition-all duration-200 text-base ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800"
                }`
              }
            >
              Your Blogs
            </NavLink>
          </li>

          {/* COMMENTS */}
          <li>
            <NavLink
              to={user ? "/dashboard/comments" : "/login"}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl transition-all duration-200 text-base ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800"
                }`
              }
            >
              Comments
            </NavLink>
          </li>

          {/* CREATE BLOGS */}
          <li>
            <NavLink
              to={user ? "/dashboard/create-blogs" : "/login"}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl transition-all duration-200 text-base ${
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-md"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800"
                }`
              }
            >
              Create Blogs
            </NavLink>
          </li>

        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;