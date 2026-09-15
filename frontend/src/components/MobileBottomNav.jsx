import { Link } from "react-router-dom";
import { FiHome, FiBookOpen, FiPlus, FiUser } from "react-icons/fi";
import userimg from "../assets/userprofile.png";
import { getProfileImage } from "../utils/profileImage";

const MobileBottomNav = ({ user, isActive }) => {
  const profileImage = getProfileImage(user?.profilePic);

  const navItems = [
    { to: "/", icon: FiHome, label: "Home", match: "/" },
    { to: "/blogs", icon: FiBookOpen, label: "Blogs", match: "/blogs" },
    { to: "/blog-feed", icon: FiBookOpen, label: "Feed", match: "/blog-feed" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full md:hidden z-50">
      {/* Soft top glow accent */}
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.71_0.2_46.45)]/40 to-transparent" />

      <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-gray-200/80 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        <div className="flex justify-around items-center py-2 px-2">

          {/* Home — public */}
          <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex-1">
            <div className="flex flex-col items-center text-[11px] gap-0.5">
              <div
                className={`p-2 rounded-2xl transition-all duration-300 ${
                  isActive("/")
                    ? "bg-[oklch(0.71_0.2_46.45)]/15 text-[oklch(0.6_0.2_46.45)]"
                    : "text-gray-500 dark:text-gray-400 active:bg-gray-100 dark:active:bg-slate-800"
                }`}
              >
                <FiHome
                  className={`text-[22px] transition-transform duration-300 ${
                    isActive("/") ? "scale-110" : ""
                  }`}
                />
              </div>
              <span
                className={`font-medium transition-colors duration-300 ${
                  isActive("/")
                    ? "text-[oklch(0.6_0.2_46.45)]"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Home
              </span>
            </div>
          </Link>

          {/* Blogs — public */}
          <Link to="/blogs" onClick={() => window.scrollTo(0, 0)} className="flex-1">
            <div className="flex flex-col items-center text-[11px] gap-0.5">
              <div
                className={`p-2 rounded-2xl transition-all duration-300 ${
                  isActive("/blogs")
                    ? "bg-[oklch(0.71_0.2_46.45)]/15 text-[oklch(0.6_0.2_46.45)]"
                    : "text-gray-500 dark:text-gray-400 active:bg-gray-100 dark:active:bg-slate-800"
                }`}
              >
                <FiBookOpen
                  className={`text-[22px] transition-transform duration-300 ${
                    isActive("/blogs") ? "scale-110" : ""
                  }`}
                />
              </div>
              <span
                className={`font-medium transition-colors duration-300 ${
                  isActive("/blogs")
                    ? "text-[oklch(0.6_0.2_46.45)]"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Blogs
              </span>
            </div>
          </Link>

          {/* Create Button — protected (login required) */}
          {user && (
            <Link
              to="/dashboard/create-blogs"
              onClick={() => window.scrollTo(0, 0)}
              className="flex-1 flex justify-center"
            >
              <div className="relative -top-7 group">
                {/* Glow ring */}
                <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.71_0.2_46.45)] to-[oklch(0.8_0.15_60)] rounded-full blur-md opacity-50 group-active:opacity-80 transition-opacity" />

                <div className="relative bg-gradient-to-br from-[oklch(0.71_0.2_46.45)] to-[oklch(0.65_0.2_46.45)] text-white p-4 rounded-full shadow-lg shadow-[oklch(0.71_0.2_46.45)]/40 ring-4 ring-white dark:ring-slate-900 transition-transform duration-300 group-active:scale-95">
                  <FiPlus className="text-2xl" />
                </div>
              </div>
            </Link>
          )}

          {/* Feed — public */}
          <Link to="/blog-feed" onClick={() => window.scrollTo(0, 0)} className="flex-1">
            <div className="flex flex-col items-center text-[11px] gap-0.5">
              <div
                className={`p-2 rounded-2xl transition-all duration-300 ${
                  isActive("/blog-feed")
                    ? "bg-[oklch(0.71_0.2_46.45)]/15 text-[oklch(0.6_0.2_46.45)]"
                    : "text-gray-500 dark:text-gray-400 active:bg-gray-100 dark:active:bg-slate-800"
                }`}
              >
                <FiBookOpen
                  className={`text-[22px] transition-transform duration-300 ${
                    isActive("/blog-feed") ? "scale-110" : ""
                  }`}
                />
              </div>
              <span
                className={`font-medium transition-colors duration-300 ${
                  isActive("/blog-feed")
                    ? "text-[oklch(0.6_0.2_46.45)]"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Feed
              </span>
            </div>
          </Link>

          {/* Profile / Login */}
          {user ? (
            <Link to="/dashboard/profile" className="flex-1">
              <div className="flex flex-col items-center text-[11px] gap-0.5">
                <div
                  className={`p-1.5 rounded-2xl transition-all duration-300 ${
                    isActive("/dashboard/profile")
                      ? "bg-[oklch(0.71_0.2_46.45)]/15"
                      : ""
                  }`}
                >
                  <img
                    src={profileImage}
                    alt="user"
                    onError={(e) => {
                      e.target.src = userimg;
                    }}
                    className={`w-8 h-8 rounded-full object-cover cursor-pointer ring-2 transition-all duration-300 ${
                      isActive("/dashboard/profile")
                        ? "ring-[oklch(0.71_0.2_46.45)]"
                        : "ring-gray-300 dark:ring-slate-600"
                    }`}
                  />
                </div>
                <span
                  className={`font-medium transition-colors duration-300 ${
                    isActive("/dashboard/profile")
                      ? "text-[oklch(0.6_0.2_46.45)]"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Profile
                </span>
              </div>
            </Link>
          ) : (
            <Link to="/login" className="flex-1">
              <div className="flex flex-col items-center text-[11px] gap-0.5">
                <div
                  className={`p-2 rounded-2xl transition-all duration-300 ${
                    isActive("/login")
                      ? "bg-[oklch(0.71_0.2_46.45)]/15 text-[oklch(0.6_0.2_46.45)]"
                      : "text-gray-500 dark:text-gray-400 active:bg-gray-100 dark:active:bg-slate-800"
                  }`}
                >
                  <FiUser
                    className={`text-[22px] transition-transform duration-300 ${
                      isActive("/login") ? "scale-110" : ""
                    }`}
                  />
                </div>
                <span
                  className={`font-medium transition-colors duration-300 ${
                    isActive("/login")
                      ? "text-[oklch(0.6_0.2_46.45)]"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Login
                </span>
              </div>
            </Link>
          )}
        </div>

        {/* iOS safe area spacing */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
};

export default MobileBottomNav;