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
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/logout`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(logoutUser());
        navigate("/");
        toast.success("Logged out successfully");
      }
    } catch (error) {
      console.log("Logout Error:", error);
      toast.error(error?.response?.data?.message || "Error logging out");
    }
  };

  return (
    <>
      {/* Navbar */}
      <div className="w-full fixed top-0 left-0 py-2 bg-white dark:bg-gray-800 border-b z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Logo" className="w-10 h-10" />
              <span className="ml-2 text-xl hidden md:inline font-bold dark:text-white">MyBlog</span>
            </Link>
            <DesktopSearch search={search} setSearch={setSearch} searchResults={searchResults} handleClick={handleClick} />
          </div>

          {/* Desktop Menu */}
          <DesktopMenu user={user} theme={theme} Logout={Logout} navigate={navigate} dispatch={dispatch} toggleTheme={toggleTheme} />

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(true)}>
              <FiMenu className="w-7 h-7" />
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