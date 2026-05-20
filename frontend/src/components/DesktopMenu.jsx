import { Link } from "react-router-dom";
import { FiHome, FiBookOpen, FiInfo, FiUser, FiLogOut, FiEdit, FiMessageSquare, FiFileText, FiTrash2 } from "react-icons/fi";
import { Moon, Sun, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
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
  const profileImage = getProfileImage(user?.profilePic);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  // ✅ DELETE ACCOUNT FUNCTION
  const deleteAccountPermanently = async () => {
    const confirmDelete = window.confirm(
      "⚠️ WARNING: This action is PERMANENT and IRREVERSIBLE!\n\n" +
      "Your account along with all your blogs, comments, and likes will be deleted forever.\n\n" +
      "Are you absolutely sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    // Second confirmation for safety
    const secondConfirm = window.confirm(
      "Please confirm again: Type 'DELETE' in the prompt below to permanently delete your account."
    );
    
    if (!secondConfirm) return;
    
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
        // Clear local storage and redirect to home
        localStorage.clear();
        sessionStorage.clear();
        // Call logout to clear Redux state
        await Logout();
        // Redirect to home page
        navigate("/");
        // Reload to clear all state
        window.location.reload();
      }
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error(error.response?.data?.message || "Failed to delete account");
    }
  };

  return (
    <div className="hidden md:flex items-center gap-1 lg:gap-2">
      {/* Navigation Links */}
      <NavLink to="/" icon={<FiHome />} label="Home" />
      <NavLink to="/blogs" icon={<FiBookOpen />} label="Blogs" />
      {
        user ? (
          <NavLink
            to="/dashboard/blog"
            icon={<FiFileText />}
            label="Your Blog"
          />
        ) : (
          <NavLink
            to="/login"
            icon={<FiFileText />}
            label="Your Blog"
          />
        )
      }
      <NavLink to="/blog-feed" icon={<FiBookOpen />} label="Feed" />
      <NavLink to="/about" icon={<FiInfo />} label="About" />

      {/* Theme Toggle */}
      <ThemeToggle theme={theme} toggleTheme={handleThemeToggle} />

      {/* Auth Section */}
      {user ? (
        <UserDropdown user={user} profileImage={profileImage} navigate={navigate} Logout={Logout} deleteAccountPermanently={deleteAccountPermanently} />
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
    className="group relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
  >
    <span className="text-lg">{icon}</span>
    <span className="hidden lg:inline">{label}</span>
    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
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
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
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

// User Dropdown Component with Delete Account
const UserDropdown = ({ user, profileImage, navigate, Logout, deleteAccountPermanently }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="group flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
        <div className="relative">
          <img
            src={profileImage}
            alt={user?.firstName}
            onError={(e) => { e.target.src = userimg; }}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-gray-400 dark:group-hover:ring-gray-500 transition-all duration-200"
          />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-900"></div>
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:inline-block">
          {user?.firstName || user?.name?.split(' ')[0]}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 hidden lg:block group-hover:rotate-180 transition-transform duration-200" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent className="w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-xl p-1" align="end">
      <DropdownMenuLabel className="px-3 py-2">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user?.email}
          </p>
        </div>
      </DropdownMenuLabel>

      <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />

      <DropdownMenuGroup>
        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
          onClick={() => navigate("/dashboard/profile")}
        >
          <FiUser className="w-4 h-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
          onClick={() => navigate("/dashboard/blog")}
        >
          <FiFileText className="w-4 h-4" />
          <span>Your Blogs</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
          onClick={() => navigate("/dashboard/comments")}
        >
          <FiMessageSquare className="w-4 h-4" />
          <span>Comments</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
          onClick={() => navigate("/dashboard/create-blogs")}
        >
          <FiEdit className="w-4 h-4" />
          <span>Create Blog</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />

      {/* LOGOUT BUTTON */}
      <DropdownMenuItem
        className="cursor-pointer flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all duration-200"
        onClick={Logout}
      >
        <FiLogOut className="w-4 h-4" />
        <span>Log out</span>
      </DropdownMenuItem>

      {/* DELETE ACCOUNT PERMANENTLY - New Option */}
      <DropdownMenuItem
        className="cursor-pointer flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all duration-200 border-t border-red-200 dark:border-red-800 mt-1"
        onClick={deleteAccountPermanently}
      >
        <FiTrash2 className="w-4 h-4" />
        <span>Delete Account Permanently</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Auth Buttons Component
const AuthButtons = () => (
  <div className="flex items-center gap-2">
    <Link to="/signup">
      <button className="group relative px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg">
        <span className="relative z-10">Sign Up</span>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 dark:from-gray-200 dark:to-gray-300 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
      </button>
    </Link>
    <Link to="/login">
      <button className="group relative px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg">
        Login
      </button>
    </Link>
  </div>
);

export default DesktopMenu;