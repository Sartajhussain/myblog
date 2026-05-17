import { Link } from "react-router-dom";
import { FiHome, FiBookOpen, FiPlus, FiUser } from "react-icons/fi";
import userimg from "../assets/userprofile.png";
import { getProfileImage } from "../utils/profileImage";

const MobileBottomNav = ({ user, isActive }) => {
  const profileImage = getProfileImage(user?.profilePic);

  return (
    <div className="fixed bottom-0 left-0 w-full md:hidden bg-white dark:bg-gray-900 border-t shadow-lg z-50">
      <div className="flex justify-around items-center py-2">
        {/* Home */}
        <Link to="/" onClick={() => window.scrollTo(0, 0)}>
          <div className="flex flex-col items-center text-[11px]">
            <div className={`p-2 rounded-full transition ${isActive("/") ? "bg-gray-200 dark:bg-gray-700" : ""}`}>
              <FiHome className="text-2xl" />
            </div>
            <span className="text-gray-600 dark:text-gray-300">Home</span>
          </div>
        </Link>

        {/* Blogs */}
        <Link to={user ? "/blogs" : "/login"} onClick={() => window.scrollTo(0, 0)}>
          <div className="flex flex-col items-center text-[11px]">
            <div className={`p-2 rounded-full transition ${isActive("/blogs") ? "bg-gray-200 dark:bg-gray-700" : ""}`}>
              <FiBookOpen className="text-2xl" />
            </div>
            <span className="text-gray-600 dark:text-gray-300">Blogs</span>
          </div>
        </Link>

        {/* Create Button */}
        {user && (
          <Link to="/dashboard/create-blogs" onClick={() => window.scrollTo(0, 0)}>
            <div className="relative -top-7 bg-[oklch(0.71_0.2_46.45)] text-white p-4 rounded-full shadow-xl">
              <FiPlus className="text-2xl" />
            </div>
          </Link>
        )}

        {/* Feed */}
        <Link to={user ? "/blog-feed" : "/login"} onClick={() => window.scrollTo(0, 0)}>
          <div className="flex flex-col items-center text-[11px]">
            <div className={`p-2 rounded-full transition ${isActive("/blog-feed") ? "bg-gray-200 dark:bg-gray-700" : ""}`}>
              <FiBookOpen className="text-2xl" />
            </div>
            <span className="text-gray-600 dark:text-gray-300">Feed</span>
          </div>
        </Link>

        {/* Profile/Login */}
        {user ? (
          <Link to="/dashboard/profile">
            <div className="flex flex-col items-center text-[11px]">
              <div className={`p-2 rounded-full transition ${isActive("/dashboard/profile") ? "bg-gray-200 dark:bg-gray-700" : ""}`}>
                <img
                  src={profileImage}
                  alt="user"
                  onError={(e) => { e.target.src = userimg; }}
                  className="w-9 h-9 rounded-full object-cover cursor-pointer ring-2 ring-gray-300 dark:ring-slate-600 hover:ring-black dark:hover:ring-white transition"
                />
              </div>
              <span className="text-gray-600 dark:text-gray-300">Profile</span>
            </div>
          </Link>
        ) : (
          <Link to="/login">
            <div className="flex flex-col items-center text-[11px]">
              <div className={`p-2 rounded-full transition ${isActive("/login") ? "bg-gray-200 dark:bg-gray-700" : ""}`}>
                <FiUser className="text-2xl" />
              </div>
              <span className="text-gray-600 dark:text-gray-300">Login</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileBottomNav;