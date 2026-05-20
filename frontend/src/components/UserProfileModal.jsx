import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    FiInstagram,
    FiFacebook,
    FiLinkedin,
    FiGithub,
    FiBookOpen,
    FiMessageCircle,
    FiEye,
    FiHeart
} from "react-icons/fi";
import userimg from "../assets/userprofile.png";
import { getProfileImage } from "../utils/profileImage";
import { API_BASE_URL } from "../utils/api";
import { useNavigate } from "react-router-dom";

const UserProfileModal = ({ isOpen, user, onClose }) => {
    const navigate = useNavigate();
    const [userBlogs, setUserBlogs] = useState([]);
    const [userComments, setUserComments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && user?._id) {
            fetchUserData();
        }
    }, [isOpen, user?._id]);

    const fetchUserData = async () => {
        if (!user?._id) return;
        
        setLoading(true);
        try {
            console.log("🔍 Fetching data for user:", user._id, user.firstName);
            
            let blogs = [];
            let comments = [];
            
            // ✅ FETCH BLOGS
            try {
                // Try to get user's blogs
                const blogsRes = await axios.get(
                    `${API_BASE_URL}/api/v1/blog/user/${user._id}`,
                    { withCredentials: true }
                );
                
                if (blogsRes.data.success) {
                    blogs = blogsRes.data.blogs || [];
                    console.log(`✅ Found ${blogs.length} blogs for user`);
                }
            } catch (err) {
                console.log("Blog fetch error:", err.response?.status);
                
                // If endpoint fails, try alternative
                try {
                    const allBlogsRes = await axios.get(
                        `${API_BASE_URL}/api/v1/blog/feed`,
                        { withCredentials: true }
                    );
                    
                    if (allBlogsRes.data.success) {
                        blogs = (allBlogsRes.data.blogs || []).filter(
                            blog => blog.author?._id === user._id || blog.author === user._id
                        );
                        console.log(`✅ Found ${blogs.length} blogs from feed for user`);
                    }
                } catch (err2) {
                    console.log("Alternative blog fetch also failed");
                }
            }
            
            setUserBlogs(blogs);
            
            // ✅ FETCH COMMENTS
            try {
                // Try to get user's comments
                const commentsRes = await axios.get(
                    `${API_BASE_URL}/api/v1/comment/user/${user._id}`,
                    { withCredentials: true }
                );
                
                if (commentsRes.data.success) {
                    comments = commentsRes.data.comments || [];
                    console.log(`✅ Found ${comments.length} comments for user`);
                }
            } catch (err) {
                console.log("Comment fetch error:", err.response?.status);
                
                // If endpoint fails, fetch comments from blogs
                try {
                    const allComments = [];
                    for (const blog of blogs) {
                        try {
                            const blogCommentsRes = await axios.get(
                                `${API_BASE_URL}/api/v1/comment/blog/${blog._id}`,
                                { withCredentials: true }
                            );
                            
                            if (blogCommentsRes.data.success) {
                                const blogComments = (blogCommentsRes.data.comments || []).filter(
                                    comment => comment.user?._id === user._id || comment.user === user._id
                                );
                                allComments.push(...blogComments);
                            }
                        } catch (err2) {
                            console.log(`Error fetching comments for blog ${blog._id}`);
                        }
                    }
                    comments = allComments;
                    console.log(`✅ Found ${comments.length} comments from blogs for user`);
                } catch (err2) {
                    console.log("Alternative comment fetch failed");
                }
            }
            
            setUserComments(comments);
            
        } catch (error) {
            console.error("❌ Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    const getBlogImage = (blog) => {
        const imagePath = blog?.thumbnail || blog?.image || blog?.coverImage;
        if (!imagePath || imagePath === "null" || imagePath === "undefined") {
            return "https://placehold.co/400x200/6366f1/white?text=No+Image";
        }
        if (imagePath.startsWith("http")) {
            return imagePath;
        }
        if (imagePath.startsWith("/uploads")) {
            return `${API_BASE_URL}${imagePath}`;
        }
        return `${API_BASE_URL}/${imagePath}`;
    };

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const handleViewBlog = (blogId) => {
        onClose();
        navigate(`/view-blog/${blogId}`);
    };

    if (!isOpen || !user) return null;

    const totalViews = userBlogs.reduce((sum, blog) => sum + (blog.views?.length || 0), 0);
    const totalLikes = userBlogs.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 w-full max-w-5xl rounded-3xl px-4 md:px-6 py-6 md:py-8 relative text-gray-900 dark:text-white max-h-[90vh] overflow-y-auto">

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-xl md:text-2xl text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300 transition"
                >
                    &times;
                </button>

                <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                    {/* LEFT SECTION */}
                    <div className="w-full md:w-1/3 flex flex-col items-center text-center">
                        <img
                            src={getProfileImage(user.profilePic)}
                            alt="profile"
                            loading="eager"
                            fetchPriority="high"
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600"
                            onError={(e) => (e.target.src = userimg)}
                        />

                        <h2 className="text-lg md:text-2xl font-semibold mt-3 capitalize text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                        </h2>

                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 break-all">
                            <a href={`mailto:${user.email}`} className="hover:underline">
                                {user.email}
                            </a>
                        </p>

                        <div className="flex gap-3 mt-4 text-gray-700 dark:text-gray-300 text-lg md:text-xl">
                            {user.instagram && (
                                <a href={user.instagram} target="_blank" rel="noopener noreferrer" 
                                   className="hover:scale-110 transition-transform">
                                    <FiInstagram className="text-pink-500"/>
                                </a>
                            )}
                            {user.linkedin && (
                                <a href={user.linkedin} target="_blank" rel="noopener noreferrer"
                                   className="hover:scale-110 transition-transform">
                                    <FiLinkedin className="text-[#0A66C2]" />
                                </a>
                            )}
                            {user.github && (
                                <a href={user.github} target="_blank" rel="noopener noreferrer"
                                   className="hover:scale-110 transition-transform">
                                    <FiGithub className="text-black dark:text-white" />
                                </a>
                            )}
                            {user.facebook && (
                                <a href={user.facebook} target="_blank" rel="noopener noreferrer"
                                   className="hover:scale-110 transition-transform">
                                    <FiFacebook className="text-[#1877F2]"/>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SECTION */}
                    <div className="w-full md:w-2/3">
                        <h2 className="text-xl md:text-3xl font-bold capitalize text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                        </h2>

                        <p className="mt-3 text-sm md:text-base text-gray-600 dark:text-gray-300">
                            {user.bio || "No bio available"}
                        </p>

                        {/* STATS CARDS */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6 md:mt-8">
                            <div className="p-3 md:p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-center transition hover:scale-105">
                                <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white">
                                    {loading ? "..." : totalViews}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 flex items-center justify-center gap-1">
                                    <FiEye className="w-3 h-3" /> Views
                                </p>
                            </div>

                            <div className="p-3 md:p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-center transition hover:scale-105">
                                <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white">
                                    {loading ? "..." : userBlogs.length}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 flex items-center justify-center gap-1">
                                    <FiBookOpen className="w-3 h-3" /> Blogs
                                </p>
                            </div>

                            <div className="p-3 md:p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-center transition hover:scale-105">
                                <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white">
                                    {loading ? "..." : userComments.length}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 flex items-center justify-center gap-1">
                                    <FiMessageCircle className="w-3 h-3" /> Comments
                                </p>
                            </div>

                            <div className="p-3 md:p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-center transition hover:scale-105">
                                <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white">
                                    {totalLikes}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 flex items-center justify-center gap-1">
                                    <FiHeart className="w-3 h-3" /> Likes
                                </p>
                            </div>
                        </div>

                        {/* BLOGS SECTION */}
                        {!loading && userBlogs.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <FiBookOpen className="w-4 h-4" />
                                    Recent Blogs
                                </h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {userBlogs.slice(0, 5).map((blog) => (
                                        <div
                                            key={blog._id}
                                            onClick={() => handleViewBlog(blog._id)}
                                            className="flex gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                        >
                                            <img
                                                src={getBlogImage(blog)}
                                                alt={blog.title}
                                                className="w-12 h-12 rounded object-cover"
                                                onError={(e) => {
                                                    e.target.src = "https://placehold.co/400x200/6366f1/white?text=No+Image";
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {blog.title}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDate(blog.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* COMMENTS SECTION */}
                        {!loading && userComments.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <FiMessageCircle className="w-4 h-4" />
                                    Recent Comments
                                </h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {userComments.slice(0, 5).map((comment) => (
                                        <div
                                            key={comment._id}
                                            onClick={() => comment.blog?._id && handleViewBlog(comment.blog._id)}
                                            className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                        >
                                            <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
                                                "{comment.text}"
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                on: {comment.blog?.title || "Deleted Blog"} • {formatDate(comment.createdAt)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;