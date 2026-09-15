import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  FiX,
  FiHome,
  FiBookOpen,
  FiInfo,
  FiSun,
  FiMoon,
  FiEdit,
  FiMessageSquare,
  FiLogOut,
} from "react-icons/fi";

import { useDispatch } from "react-redux";

import { toggleTheme } from "../redux/themeSlice";

import { getProfileImage } from "../utils/profileImage";

import userimg from "../assets/userprofile.png";

const MobileSidebar = ({
  isOpen,
  setIsOpen,
  user,
  theme,
  Logout,
}) => {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const profileImage =
    getProfileImage(user?.profilePic);

  /* ✅ PERMISSION BASED MENU — each with its own color */
  const menuItems = [
    {
      icon: FiHome,
      label: "Home",
      path: "/",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-500/15",
    },

    {
      icon: FiBookOpen,
      label: "Your Blogs",
      path: user
        ? "/dashboard/blog"
        : "/login",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-500/15",
    },

    {
      icon: FiMessageSquare,
      label: "Comments",
      path: user
        ? "/dashboard/comments"
        : "/login",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-500/15",
    },

    {
      icon: FiEdit,
      label: "Create Blog",
      path: user
        ? "/dashboard/create-blogs"
        : "/login",
      color: "text-[oklch(0.6_0.2_46.45)] dark:text-[oklch(0.71_0.2_46.45)]",
      bg: "bg-[oklch(0.71_0.2_46.45)]/12 dark:bg-[oklch(0.71_0.2_46.45)]/15",
    },

    {
      icon: FiInfo,
      label: "About",
      path: "/about",
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-100 dark:bg-cyan-500/15",
    },
  ];

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      />

      {/* SIDEBAR */}
      <div
        className={`fixed bottom-0 left-0 right-0 h-auto max-h-[88vh] bg-white dark:bg-slate-900 z-50 rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen
            ? "translate-y-0"
            : "translate-y-full"
        }`}
      >
        {/* Top accent glow */}
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.71_0.2_46.45)]/40 to-transparent" />

        {/* DRAG INDICATOR */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-slate-700 rounded-full" />
        </div>

        {/* HEADER */}
        <div className="px-5 pb-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3">

            <div className="relative">
              <img
                src={profileImage}
                alt={user?.firstName}
                onError={(e) => {
                  e.target.src = userimg;
                }}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-[oklch(0.71_0.2_46.45)]/30"
              />

              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base text-gray-900 dark:text-white truncate">

                {user
                  ? `${
                      user?.firstName || ""
                    } ${
                      user?.lastName || ""
                    }`.trim()
                  : "Guest User"}

              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                {user?.email ||
                  "Please login"}
              </p>
            </div>

            <button
              onClick={() =>
                setIsOpen(false)
              }
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 active:bg-gray-200 dark:active:bg-slate-700 transition-colors"
              aria-label="Close menu"
            >
              <FiX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

          </div>
        </div>

        {/* MENU */}
        <div className="py-2 max-h-[55vh] overflow-y-auto">

          {menuItems.map(
            (item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={() =>
                  setIsOpen(false)
                }
                className="group flex items-center gap-4 px-5 py-3 active:bg-gray-100 dark:active:bg-slate-800 transition-colors duration-150"
              >

                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-2xl ${item.bg} transition-transform group-active:scale-95`}
                >

                  <item.icon className={`w-5 h-5 ${item.color}`} />

                </div>

                <span className="text-base font-medium text-gray-800 dark:text-gray-200">

                  {item.label}

                </span>

              </Link>
            )
          )}

          {/* DIVIDER */}
          <div className="my-2 h-px bg-gray-100 dark:bg-slate-800 mx-5" />

          {/* THEME */}
          <button
            onClick={() =>
              dispatch(toggleTheme())
            }
            className="flex items-center justify-between w-full px-5 py-3 active:bg-gray-100 dark:active:bg-slate-800 transition-colors duration-150"
          >

            <div className="flex items-center gap-4">

              <div
                className={`w-10 h-10 flex items-center justify-center rounded-2xl ${
                  theme === "light"
                    ? "bg-amber-100 dark:bg-amber-500/15"
                    : "bg-indigo-100 dark:bg-indigo-500/15"
                }`}
              >

                {theme === "light" ? (
                  <FiSun className="w-5 h-5 text-amber-500" />
                ) : (
                  <FiMoon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                )}

              </div>

              <span className="text-base font-medium text-gray-800 dark:text-gray-200">

                {theme === "light"
                  ? "Dark Mode"
                  : "Light Mode"}

              </span>

            </div>

            <div
              className={`w-11 h-6 rounded-full transition-colors duration-300 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-[oklch(0.71_0.2_46.45)] to-[oklch(0.8_0.15_60)]"
                  : "bg-gray-300 dark:bg-slate-600"
              }`}
            >

              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 m-0.5 ${
                  theme === "dark"
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />

            </div>
          </button>
        </div>

        {/* AUTH */}
        <div className="p-5 pt-3 pb-6 border-t border-gray-100 dark:border-slate-800">

          {!user ? (

            <div className="flex gap-3">

              <Link
                to="/signup"
                onClick={() =>
                  setIsOpen(false)
                }
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[oklch(0.71_0.2_46.45)] to-[oklch(0.8_0.15_60)] text-white text-center font-semibold text-sm shadow-lg shadow-[oklch(0.71_0.2_46.45)]/25 active:scale-[0.98] transition-all"
              >
                Sign Up
              </Link>

              <Link
                to="/login"
                onClick={() =>
                  setIsOpen(false)
                }
                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-white text-center font-semibold text-sm active:bg-gray-200 dark:active:bg-slate-700 active:scale-[0.98] transition-all"
              >
                Login
              </Link>

            </div>

          ) : (

            <button
              onClick={Logout}
              className="w-full py-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold text-sm active:bg-red-100 dark:active:bg-red-950/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >

              <FiLogOut className="w-4 h-4" />

              Logout

            </button>

          )}

        </div>

        {/* iOS safe area spacing */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </>
  );
};

export default MobileSidebar;