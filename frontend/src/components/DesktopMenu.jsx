import React from "react";
import { Link, useLocation } from "react-router-dom";
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

// =====================================================
// DESKTOP MENU
// =====================================================

const DesktopMenu = ({ user, Logout, navigate }) => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  // =====================================================
  // THEME TOGGLE
  // =====================================================

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  // =====================================================
  // DELETE ACCOUNT
  // =====================================================

  const deleteAccountPermanently = async () => {
    const confirmDelete = window.confirm(
      "⚠️ WARNING: This action is PERMANENT and IRREVERSIBLE!\n\n" +
        "Your account along with all your blogs, comments, and likes will be deleted forever.\n\n" +
        "Are you absolutely sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    const userInput = prompt(
      'Type "DELETE" to confirm account deletion:'
    );

    if (userInput !== "DELETE") {
      toast.error(
        "Account deletion cancelled. 'DELETE' was not typed correctly."
      );
      return;
    }

    try {
      const { data } = await axios.delete(
        `${API_BASE_URL}/api/v1/user/delete-account`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success("Account deleted permanently");

        // Clear client-side data
        localStorage.clear();
        sessionStorage.clear();

        // Logout Redux/auth state
        await Logout();

        // Navigate home
        navigate("/");

        // Reload application
        window.location.reload();
      }
    } catch (error) {
      console.error("Delete account error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete account"
      );
    }
  };

  return (
    <div className="hidden md:flex items-center gap-1 lg:gap-2">

      {/* =====================================================
          HOME
      ===================================================== */}

      <NavLink
        to="/"
        icon={<FiHome />}
        label="Home"
        exact
      />

      {/* =====================================================
          BLOGS
      ===================================================== */}

      <NavLink
        to="/blogs"
        icon={<FiBookOpen />}
        label="Blogs"
      />

      {/* =====================================================
          YOUR BLOG
      ===================================================== */}

      {user ? (
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
      )}

      {/* =====================================================
          FEED
      ===================================================== */}

      <NavLink
        to="/blog-feed"
        icon={<FiBookOpen />}
        label="Feed"
      />

      {/* =====================================================
          ABOUT
      ===================================================== */}

      <NavLink
        to="/about"
        icon={<FiInfo />}
        label="About"
        exact
      />

      {/* =====================================================
          THEME
      ===================================================== */}

      <ThemeToggle
        theme={theme}
        toggleTheme={handleThemeToggle}
      />

      {/* =====================================================
          USER / AUTH
      ===================================================== */}

      {user ? (
        <UserDropdown
          user={user}
          navigate={navigate}
          Logout={Logout}
          deleteAccountPermanently={
            deleteAccountPermanently
          }
        />
      ) : (
        <AuthButtons />
      )}
    </div>
  );
};

// =====================================================
// NAV LINK
// Active state works with nested routes
// =====================================================

const NavLink = ({
  to,
  icon,
  label,
  exact = false,
}) => {
  const location = useLocation();

  /*
   * exact = true
   * Example:
   * "/" should ONLY be active on "/"
   *
   * exact = false
   * Example:
   * "/dashboard/blog"
   * also active on:
   * "/dashboard/blog/edit/123"
   */

  const isActive = exact
    ? location.pathname === to
    : location.pathname === to ||
      location.pathname.startsWith(`${to}/`);

  return (
    <Link
      to={to}
      className={`group relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
        isActive
          ? "text-[oklch(0.71_0.2_46.45)] bg-[oklch(0.71_0.2_46.45)]/10"
          : "text-gray-700 dark:text-gray-300 hover:text-[oklch(0.71_0.2_46.45)] hover:bg-[oklch(0.71_0.2_46.45)]/10"
      }`}
    >
      {/* ICON */}

      <span className="text-lg">
        {icon}
      </span>

      {/* LABEL */}

      <span className="hidden lg:inline">
        {label}
      </span>

      {/* ACTIVE UNDERLINE */}

      <span
        className={`absolute inset-x-0 bottom-0 h-0.5 bg-[oklch(0.71_0.2_46.45)] transition-transform duration-300 rounded-full ${
          isActive
            ? "scale-x-100"
            : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </Link>
  );
};

// =====================================================
// THEME TOGGLE
// =====================================================

const ThemeToggle = ({
  theme,
  toggleTheme,
}) => {
  return (
    <div className="relative group">
      <button
        onClick={toggleTheme}
        className="relative w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:scale-105 transition-all duration-300"
        aria-label="Toggle theme"
        type="button"
      >
        <div className="absolute inset-0 rounded-full bg-[oklch(0.71_0.2_46.45)] opacity-0 group-hover:opacity-15 transition-opacity duration-300" />

        {theme === "light" ? (
          <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        ) : (
          <Sun className="w-4 h-4 text-yellow-500" />
        )}
      </button>

      {/* TOOLTIP */}

      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] px-2 py-1 rounded-md bg-gray-900 dark:bg-gray-700 text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {theme === "light"
          ? "Dark Mode"
          : "Light Mode"}
      </span>
    </div>
  );
};

// =====================================================
// USER DROPDOWN
// =====================================================

const UserDropdown = ({
  user,
  navigate,
  Logout,
  deleteAccountPermanently,
}) => {
  const location = useLocation();

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const avatarUrl =
    user?.profilePic ||
    user?.avatar ||
    (getProfileImage
      ? getProfileImage(user?.profilePic)
      : null) ||
    userimg;

  // =====================================================
  // FULL NAME
  // =====================================================

  const fullName = user?.firstName
    ? `${user?.firstName} ${
        user?.lastName || ""
      }`.trim()
    : user?.name || "User";

  // =====================================================
  // ACTIVE DROPDOWN ROUTES
  // =====================================================

  const isProfileActive =
    location.pathname === "/dashboard/profile" ||
    location.pathname.startsWith(
      "/dashboard/profile/"
    );

  const isBlogsActive =
    location.pathname === "/dashboard/blog" ||
    location.pathname.startsWith(
      "/dashboard/blog/"
    );

  const isCommentsActive =
    location.pathname === "/dashboard/comments" ||
    location.pathname.startsWith(
      "/dashboard/comments/"
    );

  const isCreateBlogActive =
    location.pathname ===
      "/dashboard/create-blogs" ||
    location.pathname.startsWith(
      "/dashboard/create-blogs/"
    );

  return (
    <DropdownMenu>

      {/* =====================================================
          DROPDOWN TRIGGER
      ===================================================== */}

      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="group flex items-center gap-2 p-1 rounded-full hover:bg-[oklch(0.71_0.2_46.45)]/10 transition-all duration-200 focus:ring-0 focus-visible:ring-0 outline-none"
        >
          {/* AVATAR */}

          <div className="relative w-9 h-9">
            <img
              src={avatarUrl}
              alt={user?.firstName || "User"}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = userimg;
              }}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-300 dark:ring-gray-700 group-hover:ring-[oklch(0.71_0.2_46.45)] transition-all duration-200"
            />

            {/* ONLINE STATUS */}

            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
          </div>

          {/* USER NAME */}

          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 hidden lg:inline-block">
            {user?.firstName ||
              user?.name?.split(" ")[0]}
          </span>

          {/* ARROW */}

          <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 hidden lg:block group-hover:rotate-180 group-hover:text-[oklch(0.71_0.2_46.45)] transition-all duration-200" />
        </Button>
      </DropdownMenuTrigger>

      {/* =====================================================
          DROPDOWN CONTENT
      ===================================================== */}

      <DropdownMenuContent
        className="w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-xl p-1.5 z-[100]"
        align="end"
      >

        {/* =====================================================
            USER INFO HEADER
        ===================================================== */}

        <DropdownMenuLabel className="px-3 py-3">
          <div className="flex items-center gap-3">

            {/* USER AVATAR */}

            <div className="relative shrink-0">
              <img
                src={avatarUrl}
                alt={fullName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = userimg;
                }}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-[oklch(0.71_0.2_46.45)]/40"
              />

              {/* ONLINE STATUS */}

              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
            </div>

            {/* USER DETAILS */}

            <div className="flex flex-col min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate capitalize">
                {fullName}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>

          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800 my-1" />

        {/* =====================================================
            MENU ITEMS
        ===================================================== */}

        <DropdownMenuGroup>

          {/* =================================================
              PROFILE
          ================================================= */}

          <DropdownMenuItem
            className={`cursor-pointer flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 outline-none ${
              isProfileActive
                ? "bg-[oklch(0.71_0.2_46.45)]/10 text-[oklch(0.71_0.2_46.45)]"
                : "text-gray-700 dark:text-gray-300 hover:bg-[oklch(0.71_0.2_46.45)]/10 hover:text-[oklch(0.71_0.2_46.45)]"
            }`}
            onClick={() =>
              navigate("/dashboard/profile")
            }
          >
            <FiUser className="w-4 h-4" />

            <span>Profile</span>
          </DropdownMenuItem>

          {/* =================================================
              YOUR BLOGS
          ================================================= */}

          <DropdownMenuItem
            className={`cursor-pointer flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 outline-none ${
              isBlogsActive
                ? "bg-[oklch(0.71_0.2_46.45)]/10 text-[oklch(0.71_0.2_46.45)]"
                : "text-gray-700 dark:text-gray-300 hover:bg-[oklch(0.71_0.2_46.45)]/10 hover:text-[oklch(0.71_0.2_46.45)]"
            }`}
            onClick={() =>
              navigate("/dashboard/blog")
            }
          >
            <FiFileText className="w-4 h-4" />

            <span>Your Blogs</span>
          </DropdownMenuItem>

          {/* =================================================
              COMMENTS
          ================================================= */}

          <DropdownMenuItem
            className={`cursor-pointer flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 outline-none ${
              isCommentsActive
                ? "bg-[oklch(0.71_0.2_46.45)]/10 text-[oklch(0.71_0.2_46.45)]"
                : "text-gray-700 dark:text-gray-300 hover:bg-[oklch(0.71_0.2_46.45)]/10 hover:text-[oklch(0.71_0.2_46.45)]"
            }`}
            onClick={() =>
              navigate("/dashboard/comments")
            }
          >
            <FiMessageSquare className="w-4 h-4" />

            <span>Comments</span>
          </DropdownMenuItem>

          {/* =================================================
              CREATE BLOG
          ================================================= */}

          <DropdownMenuItem
            className={`cursor-pointer flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 outline-none ${
              isCreateBlogActive
                ? "bg-[oklch(0.71_0.2_46.45)]/10 text-[oklch(0.71_0.2_46.45)]"
                : "text-gray-700 dark:text-gray-300 hover:bg-[oklch(0.71_0.2_46.45)]/10 hover:text-[oklch(0.71_0.2_46.45)]"
            }`}
            onClick={() =>
              navigate("/dashboard/create-blogs")
            }
          >
            <FiEdit className="w-4 h-4" />

            <span>Create Blog</span>
          </DropdownMenuItem>

        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800 my-1" />

        {/* =====================================================
            LOGOUT
        ===================================================== */}

        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all duration-150 outline-none"
          onClick={Logout}
        >
          <FiLogOut className="w-4 h-4" />

          <span>Log out</span>
        </DropdownMenuItem>

        {/* =====================================================
            DELETE ACCOUNT
        ===================================================== */}

        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all duration-150 border-t border-gray-100 dark:border-gray-800 mt-1 outline-none"
          onClick={deleteAccountPermanently}
        >
          <FiTrash2 className="w-4 h-4" />

          <span>
            Delete Account Permanently
          </span>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// =====================================================
// AUTH BUTTONS
// =====================================================

const AuthButtons = () => {
  const location = useLocation();

  // =====================================================
  // ACTIVE SIGNUP
  // =====================================================

  const isSignup =
    location.pathname === "/signup" ||
    location.pathname.startsWith("/signup/");

  // =====================================================
  // ACTIVE LOGIN
  // =====================================================

  const isLogin =
    location.pathname === "/login" ||
    location.pathname.startsWith("/login/");

  return (
    <div className="flex items-center gap-2">

      {/* =================================================
          SIGN UP
      ================================================= */}

      <Link
        to="/signup"
        className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 shadow-sm ${
          isSignup
            ? "bg-[oklch(0.71_0.2_46.45)] text-white hover:bg-[oklch(0.65_0.2_46.45)]"
            : "text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-200"
        }`}
      >
        Sign Up
      </Link>

      {/* =================================================
          LOGIN
      ================================================= */}

      <Link
        to="/login"
        className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
          isLogin
            ? "bg-[oklch(0.71_0.2_46.45)] text-white hover:bg-[oklch(0.65_0.2_46.45)]"
            : "text-gray-800 dark:text-gray-200 hover:bg-[oklch(0.71_0.2_46.45)]/10 hover:text-[oklch(0.71_0.2_46.45)]"
        }`}
      >
        Login
      </Link>

    </div>
  );
};

// =====================================================
// EXPORT
// =====================================================

export default DesktopMenu;