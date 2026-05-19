import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiMenu } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "/src/assets/favIcons.png";
import { logoutUser } from "../redux/authSlice.js";
import { toggleTheme } from "../redux/themeSlice.js";
import { API_BASE_URL } from "../utils/api";
import MobileBottomNav from "./MobileBottomNav";
import MobileSidebar from "./MobileSidebar";
import DesktopSearch from "./DesktopSearch";
import DesktopMenu from "./DesktopMenu";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { blog } = useSelector((store) => store.blog);
  const { user } = useSelector((store) => store.auth);
  const { theme } = useSelector((store) => store.theme);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const isActive = (path) => location.pathname === path;

  const searchResults = search.trim() === ""
    ? []
    : blog?.filter((b) => b.title?.toLowerCase().includes(search.toLowerCase()));

  const handleClick = (id) => {
    setSearch("");
    navigate(`/view-blog/${id}`);
  };

 const Logout = async () => {
  try {

    const { data } = await axios.post(
      `${API_BASE_URL}/api/v1/user/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    if (data.success) {

      dispatch(logoutUser());

      localStorage.clear();

      sessionStorage.clear();

      toast.success(data.message);

      navigate("/login");
    }

  } catch (error) {

    console.log(error);

    toast.error(
      error.response?.data?.message ||
      "Logout failed"
    );
  }
};
  return (
    <>
      {/* Navbar */}
      <div className="w-full fixed top-0 left-0 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-3">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center shrink-0"
            >
              <img
                src={logo}
                alt="Logo"
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
              />

              <span className="ml-2 text-lg sm:text-xl hidden sm:inline font-bold dark:text-white whitespace-nowrap">
                MyBlog
              </span>
            </Link>

            {/* Search */}
            <div className="flex-1 min-w-0">
              <DesktopSearch
                search={search}
                setSearch={setSearch}
                searchResults={searchResults}
                handleClick={handleClick}
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center shrink-0">
            <DesktopMenu
              user={user}
              theme={theme}
              Logout={Logout}
              navigate={navigate}
              dispatch={dispatch}
              toggleTheme={toggleTheme}
            />
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center shrink-0">
            <button
              onClick={() => setIsOpen(true)}
              className="p-1 rounded-md active:scale-95 transition"
            >
              <FiMenu className="w-7 h-7 dark:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Components */}
      <MobileBottomNav user={user} isActive={isActive} />
      <MobileSidebar isOpen={isOpen} setIsOpen={setIsOpen} user={user} theme={theme} Logout={Logout} />
    </>
  );
};

export default Navbar;