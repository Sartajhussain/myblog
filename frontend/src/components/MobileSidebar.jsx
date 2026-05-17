import { Link, useNavigate } from "react-router-dom";
import { FiX, FiHome, FiBookOpen, FiInfo, FiSun, FiMoon, FiUser, FiEdit, FiMessageSquare, FiLogOut } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../redux/themeSlice";
import { getProfileImage } from "../utils/profileImage";
import userimg from "../assets/userprofile.png";

const MobileSidebar = ({ isOpen, setIsOpen, user, theme, Logout }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profileImage = getProfileImage(user?.profilePic);

  const menuItems = [
    { icon: FiHome, label: "Home", path: "/" },
    { icon: FiBookOpen, label: "Your Blogs", path: "/dashboard/blog" },
    { icon: FiMessageSquare, label: "Comments", path: "/dashboard/comments" },
    { icon: FiEdit, label: "Create Blog", path: "/dashboard/create-blogs" },
    { icon: FiInfo, label: "About", path: "/about" },
  ];

  return (
    <>
      {/* Android-style overlay with blur */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Android-style bottom sheet sidebar */}
      <div
        className={`fixed bottom-0 left-0 right-0 h-auto max-h-[85vh] bg-white dark:bg-gray-900 z-50 rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag indicator */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Header - Android style */}
        <div className="px-5 pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={profileImage}
                alt={user?.firstName}
                onError={(e) => { e.target.src = userimg; }}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
              />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-base text-gray-900 dark:text-white">
                {user
                  ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.name
                  : "Guest User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {user?.email || "guest@example.com"}
              </p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition"
            >
              <FiX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Menu Items - Android list style */}
        <div className="py-2 max-h-[60vh] overflow-y-auto">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 px-5 py-3 active:bg-gray-100 dark:active:bg-gray-800 transition-colors duration-150"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <item.icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
              <span className="text-base font-medium text-gray-800 dark:text-gray-200">
                {item.label}
              </span>
            </Link>
          ))}

          {/* Divider */}
          <div className="my-2 h-px bg-gray-100 dark:bg-gray-800 mx-5" />

          {/* Theme Toggle - Android switch style */}
          <button 
            onClick={() => dispatch(toggleTheme())} 
            className="flex items-center justify-between w-full px-5 py-3 active:bg-gray-100 dark:active:bg-gray-800 transition-colors duration-150"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                {theme === "light" ? <FiSun className="w-5 h-5 text-gray-700" /> : <FiMoon className="w-5 h-5 text-gray-300" />}
              </div>
              <span className="text-base font-medium text-gray-800 dark:text-gray-200">
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </span>
            </div>
            {/* Android switch */}
            <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
              theme === "dark" ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
            }`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 m-0.5 ${
                theme === "dark" ? "translate-x-5" : "translate-x-0"
              }`} />
            </div>
          </button>
        </div>

        {/* Auth Section - Android bottom action */}
        <div className="p-5 pt-2 pb-6 border-t border-gray-100 dark:border-gray-800">
          {!user ? (
            <div className="flex gap-3">
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 rounded-xl bg-blue-500 text-white text-center font-semibold text-sm active:bg-blue-600 transition"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white text-center font-semibold text-sm active:bg-gray-200 dark:active:bg-gray-700 transition"
              >
                Login
              </Link>
            </div>
          ) : (
            <button
              onClick={Logout}
              className="w-full py-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold text-sm active:bg-red-100 dark:active:bg-red-950/50 transition flex items-center justify-center gap-2"
            >
              <FiLogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;