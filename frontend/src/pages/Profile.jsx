import { API_BASE_URL } from "../utils/api";
import { getProfileImage } from "../utils/profileImage";
import axios from "axios";
import { useEffect, useState } from "react";
import { setUser, setLoading } from "../redux/authSlice.js";
import userimg from "../assets/userprofile.png";
import {
  FiFacebook,
  FiGithub,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiEdit,
  FiX,
  FiUpload
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState("");
  const { user, loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  const [input, setInput] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    bio: user?.bio || "",
    instagram: user?.instagram || "",
    linkedin: user?.linkedin || "",
    github: user?.github || "",
    facebook: user?.facebook || "",
    file: null,
  });

  // Sync Input & Set Initial Preview Image
  useEffect(() => {
    if (user) {
      setInput({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        bio: user.bio || "",
        instagram: user.instagram || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        facebook: user.facebook || "",
        file: null,
      });
      setPreview(getProfileImage(user.profilePic));
    }
  }, [user]);

  // Initial Fetch: if user not loaded in redux, call endpoint
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/user/profile`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setUser(res.data.user));
        }
      } catch (error) {
        console.log("Profile Fetch Error:", error);
      }
    };

    if (!user) {
      fetchProfile();
    }
    window.scrollTo(0, 0);
  }, [dispatch, user]);

  // Fetch blogs & total likes, and comments count
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?._id) return;
      try {
        setStatsLoading(true);

        const blogsRes = await axios.get(
          `${API_BASE_URL}/api/v1/blog/my-blogs`,
          { withCredentials: true }
        );

        if (blogsRes.data.success) {
          const blogs = blogsRes.data.blogs || [];
          setTotalBlogs(blogs.length);

          const likesCount = blogs.reduce(
            (acc, blog) => acc + (blog.likes ? blog.likes.length : 0),
            0
          );
          setTotalLikes(likesCount);

          try {
            const commentsRes = await axios.get(
              `${API_BASE_URL}/api/v1/comment/my-comments`,
              { withCredentials: true }
            );
            if (commentsRes.data.success) {
              setTotalComments(commentsRes.data.comments?.length || 0);
            }
          } catch {
            const estimatedComments = blogs.reduce(
              (acc, blog) => acc + (blog.comments ? blog.comments.length : 0),
              0
            );
            setTotalComments(estimatedComments);
          }
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Image Selection Handler with Instant Preview
  const fileHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleModalClose = () => {
    setOpen(false);
    setPreview(getProfileImage(user?.profilePic));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", input.firstName);
    formData.append("lastName", input.lastName);
    formData.append("email", input.email);
    formData.append("bio", input.bio);
    formData.append("instagram", input.instagram);
    formData.append("linkedin", input.linkedin);
    formData.append("github", input.github);
    formData.append("facebook", input.facebook);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.put(
        `${API_BASE_URL}/api/v1/user/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Profile updated successfully!");
        dispatch(setUser({ ...user, ...res.data.user }));
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-0 md:pt-0 flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50/20 to-pink-50/20 dark:from-slate-900 dark:via-purple-950/20 dark:to-pink-950/20 transition-colors duration-300 px-4 md:px-8 py-12">
      <div className="w-full max-w-5xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl border border-purple-200/50 dark:border-purple-500/30 flex flex-col md:flex-row items-center md:items-start gap-10">
        
        {/* Profile Picture & Left Section */}
        <div className="w-full md:w-1/3 flex flex-col items-center text-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>

            <img
              src={getProfileImage(user?.profilePic)}
              alt="profile"
              className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-purple-500/80 object-cover shadow-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = userimg;
              }}
            />
          </div>

          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-4 capitalize">
            {user?.firstName} {user?.lastName}
          </h2>

          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm mt-1">
            <FiMail className="text-purple-500" />
            {user?.email}
          </p>

          {/* Social Links */}
          <div className="flex gap-4 mt-5">
            {user?.instagram && (
              <a
                href={user.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition duration-300 text-gray-700 dark:text-gray-200 shadow-sm hover:scale-110"
              >
                <FiInstagram size={18} />
              </a>
            )}

            {user?.linkedin && (
              <a
                href={user.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition duration-300 text-gray-700 dark:text-gray-200 shadow-sm hover:scale-110"
              >
                <FiLinkedin size={18} />
              </a>
            )}

            {user?.github && (
              <a
                href={user.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition duration-300 text-gray-700 dark:text-gray-200 shadow-sm hover:scale-110"
              >
                <FiGithub size={18} />
              </a>
            )}

            {user?.facebook && (
              <a
                href={user.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition duration-300 text-gray-700 dark:text-gray-200 shadow-sm hover:scale-110"
              >
                <FiFacebook size={18} />
              </a>
            )}
          </div>

          <button
            onClick={() => setOpen(true)}
            className="mt-6 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition duration-300 shadow-lg shadow-purple-500/25 flex items-center gap-2 text-sm hover:scale-105"
          >
            <FiEdit size={16} /> Edit Profile
          </button>
        </div>

        {/* Right Section - Bio & Dynamic Stats */}
        <div className="w-full md:w-2/3 text-center md:text-left flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
              Welcome Back!
            </h2>

            <p className="text-gray-700 dark:text-gray-300 mt-3 text-base leading-relaxed italic bg-purple-50/50 dark:bg-slate-700/30 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/30 capitalize">
              {user?.bio
                ? user.bio
                : "✨ Please add your bio to personalize your profile and let others know more about you! ✨"}
            </p>
          </div>

          {/* Dynamic Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200/50 dark:border-purple-500/20 p-4 rounded-2xl text-center backdrop-blur-sm hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                25+
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                Total Views
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200/50 dark:border-purple-500/20 p-4 rounded-2xl text-center backdrop-blur-sm hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                {statsLoading ? "..." : totalBlogs}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                Blogs Published
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200/50 dark:border-purple-500/20 p-4 rounded-2xl text-center backdrop-blur-sm hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {statsLoading ? "..." : totalComments}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                Comments
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200/50 dark:border-purple-500/20 p-4 rounded-2xl text-center backdrop-blur-sm hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                {statsLoading ? "..." : totalLikes}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                Likes Received
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-purple-100 dark:border-slate-800 my-8">
            {/* Close Button */}
            <button
              onClick={handleModalClose}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition duration-200"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Edit Profile
            </h2>

            <form onSubmit={submitHandler} className="space-y-4">
              {/* Name inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={input.firstName}
                    onChange={changeEventHandler}
                    placeholder="First Name"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={input.lastName}
                    onChange={changeEventHandler}
                    placeholder="Last Name"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={input.bio}
                  onChange={changeEventHandler}
                  rows={3}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                />
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Instagram Profile URL
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={input.instagram}
                    onChange={changeEventHandler}
                    placeholder="https://instagram.com/in/username"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="text"
                    name="linkedin"
                    value={input.linkedin}
                    onChange={changeEventHandler}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    GitHub Profile URL
                  </label>
                  <input
                    type="text"
                    name="github"
                    value={input.github}
                    onChange={changeEventHandler}
                    placeholder="https://github.com/username"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Facebook Profile URL
                  </label>
                  <input
                    type="text"
                    name="facebook"
                    value={input.facebook}
                    onChange={changeEventHandler}
                    placeholder="https://facebook.com/username"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>

              {/* Profile Image File with Instant Preview */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500 shrink-0">
                    <img
                      src={preview || userimg}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = userimg;
                      }}
                    />
                  </div>

                  <label
                    htmlFor="file-upload"
                    className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 rounded-xl text-purple-600 dark:text-purple-400 text-sm font-medium cursor-pointer hover:bg-purple-100 dark:hover:bg-slate-700 transition"
                  >
                    <FiUpload size={16} /> Select Photo
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={fileHandler}
                    accept="image/*"
                    className="hidden"
                  />
                  <span className="text-xs text-gray-500 hi truncate hidden max-w-[150px]">
                    {input.file?.name || "No new file selected"}
                  </span>
                  <div className="flex justify-end gap-3 ">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium hover:opacity-90 transition shadow-lg shadow-purple-500/25 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
                </div>
              </div>

              {/* Action Buttons */}
              
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;