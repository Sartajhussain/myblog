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
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const { user, loading } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  // State for blogs and comments stats
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    instagram: "",
    linkedin: "",
    github: "",
    facebook: "",
    file: null,
  });

  // ✅ Sync input with user
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
    }
  }, [user]);

  // ✅ FIX: login ke baad / refresh ke baad user fetch
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/user/profile`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setUser(res.data.user));
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (!user) {
      fetchProfile();
    }
  }, []);

  // ✅ Fetch total blogs and total comments - CORRECTED ENDPOINTS
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?._id) return;

      try {
        setStatsLoading(true);

        // Fetch current user's blogs using my-blogs endpoint
        const blogsRes = await axios.get(
          `${API_BASE_URL}/api/v1/blog/my-blogs`,
          { withCredentials: true }
        );

        if (blogsRes.data.success) {
          setTotalBlogs(blogsRes.data.blogs?.length || 0);

          // ✅ TOTAL LIKES COUNT
          const likes = blogsRes.data.blogs?.reduce(
            (acc, blog) => acc + (blog.likes?.length || 0),
            0
          );

          setTotalLikes(likes);

          console.log("Total blogs fetched:", blogsRes.data.blogs?.length);
        }

        // Fetch current user's comments - Assuming similar endpoint exists
        // Agar comments ka endpoint "/api/v1/comment/my-comments" hai toh ye use karo
        try {
          const commentsRes = await axios.get(
            `${API_BASE_URL}/api/v1/comment/my-comments`,
            { withCredentials: true }
          );

          if (commentsRes.data.success) {
            setTotalComments(commentsRes.data.comments?.length || 0);
            console.log("Total comments fetched:", commentsRes.data.comments?.length);
          }
        } catch (commentError) {
          // Agar comment endpoint nahi hai toh handle karo
          console.log("Comments endpoint not found, trying alternative...");
          // Alternative: Saare blogs fetch karke unke comments count karo
          if (blogsRes.data.success && blogsRes.data.blogs) {
            let totalCommentCount = 0;
            for (const blog of blogsRes.data.blogs) {
              try {
                const blogCommentsRes = await axios.get(
                  `${API_BASE_URL}/api/v1/comment/blog/${blog._id}`,
                  { withCredentials: true }
                );
                if (blogCommentsRes.data.success) {
                  totalCommentCount += blogCommentsRes.data.comments?.length || 0;
                }
              } catch (err) {
                console.log(`Error fetching comments for blog ${blog._id}`);
              }
            }
            setTotalComments(totalCommentCount);
            console.log("Total comments from all blogs:", totalCommentCount);
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const fileHnadler = (e) => {
    setInput((prev) => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (const key in input) {
      formData.append(key, input[key]);
    }

    try {
      dispatch(setLoading(true));

      const res = await axios.put(
        `${API_BASE_URL}/api/v1/user/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(" Profile Updated Successfully");

        // ✅ merge fix (important)
        dispatch(setUser({
          ...user,
          ...res.data.user
        }));

        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ✅ FINAL FIX (no fallback now — correct data flow)
  const socials = [
    { icon: FiInstagram, url: user?.instagram },
    { icon: FiLinkedin, url: user?.linkedin },
    { icon: FiGithub, url: user?.github },
    { icon: FiFacebook, url: user?.facebook },
  ];

  return (
    <>
      {/* ================= PROFILE ================= */}
      <div className="min-h-screen pt-20 pb-24 md:pb-0 md:pt-0 flex items-center justify-center md:ml-64 
bg-gradient-to-br from-gray-50 via-purple-50/20 to-pink-50/20 dark:from-slate-900 dark:via-purple-950/20 dark:to-pink-950/20 
px-4 md:px-8 py-12">

        <div className="w-full max-w-5xl 
    bg-white/80 dark:bg-slate-800/80 
    backdrop-blur-xl
    rounded-3xl p-6 md:p-10 
    shadow-2xl shadow-purple-500/10 dark:shadow-purple-500/20
    border border-purple-200/50 dark:border-purple-500/30
    hover:border-purple-300 dark:hover:border-purple-400
    transition-all duration-500
    flex flex-col md:flex-row gap-10">

          {/* LEFT */}
          <div className="w-full md:w-1/3 flex flex-col items-center text-center">
            <div className="relative group">
              {/* Neon glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>

              <img
                src={getProfileImage(user?.profilePic)}
                alt="profile"
                loading="eager"
                fetchPriority="high"
                className="relative w-28 h-28 md:w-32 md:h-32 rounded-full 
            border-4 border-purple-500 dark:border-purple-400 
            object-cover shadow-lg
            group-hover:scale-105 transition-transform duration-300"
                onError={(e) => (e.target.src = userimg)}
              />

              {/* Online status with neon pulse */}
              <span className="absolute bottom-1 right-1 w-4 h-4 
          bg-green-500 rounded-full 
          border-2 border-white dark:border-slate-800
          animate-pulse shadow-lg shadow-green-500/50" />
            </div>

            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-4 capitalize">
              {user?.firstName} {user?.lastName}
            </h2>

            <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm mt-1">
              <FiMail className="text-purple-500" /> {user?.email}
            </p>

            {/* SOCIAL ICONS with neon glow */}
            <div className="flex gap-4 mt-5">
              {socials.map(
                (item, i) =>
                  item.url && (
                    <a
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative group w-10 h-10 flex items-center justify-center 
                  rounded-full 
                  bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600
                  text-gray-700 dark:text-gray-200
                  hover:shadow-lg hover:shadow-purple-500/50
                  transition-all duration-300
                  hover:scale-110"
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
                      <item.icon className="relative z-10 group-hover:text-white transition-colors duration-300" />
                    </a>
                  )
              )}
            </div>

            <button
              onClick={() => setOpen(true)}
              className="relative group mt-6 px-6 py-2 rounded-full 
          bg-gradient-to-r from-purple-600 to-pink-600
          text-white font-medium
          flex items-center gap-2 
          hover:shadow-lg hover:shadow-purple-500/50
          transition-all duration-300
          hover:scale-105
          overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <FiEdit className="relative z-10" />
              <span className="relative z-10">Edit Profile</span>
            </button>
          </div>

          {/* RIGHT */}
          <div className="w-full md:w-2/3 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Welcome Back!
              </span>
            </h2>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed capitalize italic">
              {user?.bio || "✨ Please add your bio to personalize your profile ✨"}
            </p>

            {/* STATS with neon cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {/* Total Views */}
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 rounded-xl p-5 text-center border border-purple-200/50 dark:border-purple-500/30 hover:border-purple-500 transition-all duration-300">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    25+
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Total Views</p>
                </div>
              </div>

              {/* Total Blogs */}
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 rounded-xl p-5 text-center border border-blue-200/50 dark:border-blue-500/30 hover:border-blue-500 transition-all duration-300">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {statsLoading ? "..." : totalBlogs}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Total Blogs</p>
                </div>
              </div>

              {/* Comments */}
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 rounded-xl p-5 text-center border border-green-200/50 dark:border-green-500/30 hover:border-green-500 transition-all duration-300">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {statsLoading ? "..." : totalComments}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Comments</p>
                </div>
              </div>

              {/* Likes */}
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 rounded-xl p-5 text-center border border-red-200/50 dark:border-red-500/30 hover:border-red-500 transition-all duration-300">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    {statsLoading ? "..." : totalLikes}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Likes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .animate-gradient {
    background-size: 200% auto;
    animation: gradient 3s linear infinite;
  }
`}</style>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center 
  bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-3xl 
    bg-white dark:bg-slate-900 
    text-gray-800 dark:text-white 
    rounded-2xl shadow-2xl 
    p-6 md:p-8 relative 
    border border-gray-200 dark:border-slate-700">

            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 
        text-gray-400 hover:text-black 
        dark:hover:text-white cursor-pointer"
            >
              <FiX size={22} />
            </button>

            <h2 className="cursor-pointer text-2xl font-bold mb-6">
              Edit Profile
            </h2>

            <form className="space-y-4" onSubmit={submitHandler}>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <input placeholder="First Name" className="input" name="firstName" value={input.firstName} onChange={changeEventHandler} />
                <input type="text" placeholder="Last Name" className="input" name="lastName" value={input.lastName} onChange={changeEventHandler} />
              </div>

              <input type="email" name="email" placeholder="Email" className="input" value={input.email} onChange={changeEventHandler} />

              <textarea rows="2" placeholder="About you..." className="input resize-none" name="bio" value={input.bio} onChange={changeEventHandler} />

              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <input className="input" placeholder="Instagram URL" name="instagram" value={input.instagram} onChange={changeEventHandler} />
                <input className="input" placeholder="LinkedIn URL" name="linkedin" value={input.linkedin} onChange={changeEventHandler} />
                <input className="input" placeholder="GitHub URL" name="github" value={input.github} onChange={changeEventHandler} />
                <input className="input" placeholder="Facebook URL" name="facebook" value={input.facebook} onChange={changeEventHandler} />
              </div>

              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                {/* FILE INPUT */}
                <input
                  type="file"
                  name="file"
                  onChange={fileHnadler}
                  className="w-full text-sm 
    file:px-3 file:py-2 
    file:rounded-full 
    file:border file:border-gray-300 
    dark:file:border-gray-600 
    file:bg-black dark:file:bg-white 
    file:text-white dark:file:text-black 
    hover:file:bg-gray-800 dark:hover:file:bg-gray-200 
    cursor-pointer"
                />

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 w-full md:w-auto">

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 text-sm rounded-full 
      border border-gray-600 dark:border-gray-500 
      text-gray-600 dark:text-gray-300 
      hover:bg-gray-200 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 text-sm rounded-full 
      bg-black dark:bg-white 
      text-white dark:text-black 
      flex items-center gap-2 
      hover:bg-gray-800 dark:hover:bg-gray-200"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        wait...
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>

                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
  .input {
    width: 100%;
    padding: 10px 10px;
    border-radius: 0.75rem;
    background: white;
    border: 1px solid #e5e7eb;
    color: #111827;
    outline: none;
  }

  .dark .input {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    color: white;
  }

  .input::placeholder {
    color: #9ca3af;
  }

  .input:focus {
    border-color: #ec4899;
  }
`}</style>
    </>
  );
};

export default Profile;