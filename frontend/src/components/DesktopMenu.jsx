import React from "react";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiBookOpen,
  FiInfo,
  FiUser,
  FiLogOut,
  FiEdit,
  FiMessageSquare,
  FiFileText,
  FiTrash2,
} from "react-icons/fi";
import { Moon, Sun, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { getProfileImage } from "../utils/profileImage";
import userimg from "../assets/userprofile.png";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/themeSlice";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";
import toast from "react-hot-toast";

const DesktopMenu = ({ user, Logout, navigate }) => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  // DELETE ACCOUNT FUNCTION
  const deleteAccountPermanently = async () => {
    const confirmDelete = window.confirm(
      "⚠️ WARNING: This action is PERMANENT and IRREVERSIBLE!\n\n" +
        "Your account along with all your blogs, comments, and likes will be deleted forever.\n\n" +
        "Are you absolutely sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    const userInput = prompt('Type "DELETE" to confirm account deletion:');

    if (userInput !== "DELETE") {
      toast.error("Account deletion cancelled. 'DELETE' was not typed correctly.");
      return;
    }

    try {
      const { data } = await axios.delete(
        `${API_BASE_URL}/api/v1/user/delete-account`,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Account deleted permanently");
        localStorage.clear();
        sessionStorage.clear();
        await Logout();
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error(error.response?.data?.message || "Failed to delete account");
    }
  };

  return (
    <div className="hidden md:flex items-center gap-1 lg:gap-2">
      <NavLink to="/" icon={<FiHome />} label="Home" />
      <NavLink to="/blogs" icon={<FiBookOpen />} label="Blogs" />
      {user ? (
        <NavLink to="/dashboard/blog" icon={<FiFileText />} label="Your Blog" />
      ) : (
        <NavLink to="/login" icon={<FiFileText />} label="Your Blog" />
      )}
      <NavLink to="/blog-feed" icon={<FiBookOpen />} label="Feed" />
      <NavLink to="/about" icon={<FiInfo />} label="About" />

      <ThemeToggle theme={theme} toggleTheme={handleThemeToggle} />

      {user ? (
        <UserDropdown
          user={user}
          navigate={navigate}
          Logout={Logout}
          deleteAccountPermanently={deleteAccountPermanently}
        />
      ) : (
        <AuthButtons />
      )}
    </div>
  );
};

// NavLink Component
const NavLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="group relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
  >
    <span className="text-lg">{icon}</span>
    <span className="hidden lg:inline">{label}</span>
    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-900 dark:bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
  </Link>
);

// Theme Toggle Component
const ThemeToggle = ({ theme, toggleTheme }) => (
  <div className="relative group">
    <button
      onClick={toggleTheme}
      className="relative w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:scale-105 transition-all duration-300"
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 rounded-full bg-gray-900 dark:bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      {theme === "light" ? (
        <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      ) : (
        <Sun className="w-4 h-4 text-yellow-500" />
      )}
    </button>
    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] px-2 py-1 rounded-md bg-gray-900 dark:bg-gray-700 text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
      {theme === "light" ? "Dark Mode" : "Light Mode"}
    </span>
  </div>
);

// Fixed Profile Image Logic + Dark/Gray Modern Styling (No Blue Colors)
const UserDropdown = ({
  user,
  navigate,
  Logout,
  deleteAccountPermanently,
}) => {
  // Check image URL directly
  const avatarUrl =
    user?.profilePic ||
    user?.avatar ||
    (getProfileImage ? getProfileImage(user?.profilePic) : null) ||
    userimg;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="group flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:ring-0 focus-visible:ring-0 outline-none"
        >
          <div className="relative w-9 h-9">
            <img
              src={avatarUrl}
              alt={user?.firstName || "User"}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = userimg;
              }}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-300 dark:ring-gray-700 group-hover:ring-gray-900 dark:group-hover:ring-gray-300 transition-all duration-200"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-gray-900"></div>
          </div>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 hidden lg:inline-block">
            {user?.firstName || user?.name?.split(" ")[0]}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 hidden lg:block group-hover:rotate-180 transition-transform duration-200" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-xl p-1.5 z-[100]"
        align="end"
      >
        <DropdownMenuLabel className="px-3 py-2.5">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {user?.firstName ? `${user?.firstName} ${user?.lastName || ""}` : user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800 my-1" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white rounded-lg transition-all duration-150 outline-none"
            onClick={() => navigate("/dashboard/profile")}
          >
            <FiUser className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white rounded-lg transition-all duration-150 outline-none"
            onClick={() => navigate("/dashboard/blog")}
          >
            <FiFileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span>Your Blogs</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white rounded-lg transition-all duration-150 outline-none"
            onClick={() => navigate("/dashboard/comments")}
          >
            <FiMessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span>Comments</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white rounded-lg transition-all duration-150 outline-none"
            onClick={() => navigate("/dashboard/create-blogs")}
          >
            <FiEdit className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span>Create Blog</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800 my-1" />

        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all duration-150 outline-none"
          onClick={Logout}
        >
          <FiLogOut className="w-4 h-4" />
          <span>Log out</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all duration-150 border-t border-gray-100 dark:border-gray-800 mt-1 outline-none"
          onClick={deleteAccountPermanently}
        >
          <FiTrash2 className="w-4 h-4" />
          <span>Delete Account Permanently</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Auth Buttons Component (Dark Theme & Solid Black Buttons)
const AuthButtons = () => (
  <div className="flex items-center gap-2">
    <Link to="/signup">
      <button className="px-4 py-2 text-sm font-semibold text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-full hover:bg-black dark:hover:bg-gray-200 transition-all duration-200 shadow-sm">
        Sign Up
      </button>
    </Link>
    <Link to="/login">
      <button className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200">
        Login
      </button>
    </Link>
  </div>
);

export default DesktopMenu;