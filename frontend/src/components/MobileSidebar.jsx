import { Link, useNavigate } from "react-router-dom";
import { FiX, FiHome, FiBookOpen, FiInfo, FiSun, FiMoon } from "react-icons/fi";
import { MessageCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../redux/themeSlice";
import { getProfileImage } from "../utils/profileImage";
import userimg from "../assets/userprofile.png";

const MobileSidebar = ({ isOpen, setIsOpen, user, theme, Logout }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profileImage = getProfileImage(user?.profilePic);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-[#000000ad] bg-opacity-40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              setIsOpen(false);
              navigate(user ? "/dashboard/profile" : "/login");
            }}
          >
            <img
              src={profileImage}
              alt="user"
              onError={(e) => { e.target.src = userimg; }}
              className="w-9 h-9 rounded-full object-cover cursor-pointer ring-2 ring-gray-300 dark:ring-slate-600 hover:ring-black dark:hover:ring-white transition"
            />
            <div>
              <p className="font-semibold text-sm">
                {user
                  ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.name
                  : "Guest User"}
              </p>
              <div className="flex items-center gap-2">
                <a href={`mailto:${user?.email}`} className="text-xs text-gray-500 hover:underline truncate max-w-[160px]">
                  {user?.email}
                </a>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)}>
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-2 p-4">
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"><FiHome /></div>
            Home
          </Link>

          <Link to="/dashboard/blog" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"><FiBookOpen /></div>
            Blogs
          </Link>

          <Link to="/about" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"><FiInfo /></div>
            About
          </Link>

          <Link to="/dashboard/comments" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"><MessageCircle /></div>
            Comments
          </Link>

          {/* Theme Toggle */}
          <button onClick={() => dispatch(toggleTheme())} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {theme === "light" ? <FiSun /> : <FiMoon />}
            </div>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>

          {/* Auth Buttons */}
          {!user ? (
            <>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="p-3 rounded-lg bg-black text-white text-center">
                Sign Up
              </Link>
              <Link to="/login" onClick={() => setIsOpen(false)} className="p-3 rounded-lg border text-center">
                Login
              </Link>
            </>
          ) : (
            <button onClick={Logout} className="mt-3 p-3 rounded-lg bg-[oklch(0.71_0.2_46.45)] text-white">
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;