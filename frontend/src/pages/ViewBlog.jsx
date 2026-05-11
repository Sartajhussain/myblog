import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../utils/api";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { IoShareOutline } from "react-icons/io5";
import Skeleton from "../components/Skeleton";
import CommentsSection from "../components/CommentsSection";
import userimg from "../assets/userprofile.png";

const ViewBlog = ({ blog }) => {
  const { blogId } = useParams();
  const { blog: blogState } = useSelector((store) => store.blog);
  const { user } = useSelector((store) => store.auth);

  const [selectedBlog, setSelectedBlog] = useState(
    blog || blogState?.find((b) => b._id === blogId) || null
  );
  const [loading, setLoading] = useState(!selectedBlog);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const commentsSectionRef = useRef(null);

  // 🔥 SET INITIAL LIKE STATE
  useEffect(() => {
    if (user && selectedBlog?.likes) {
      setLiked(selectedBlog.likes.includes(user._id));
      setLikeCount(selectedBlog.likes.length);
    } else {
      setLiked(false);
      setLikeCount(selectedBlog?.likes?.length || 0);
    }
  }, [user, selectedBlog]);

  useEffect(() => {
  const foundBlog = blogState?.find((b) => b._id === blogId);

  if (foundBlog) {
    setSelectedBlog(foundBlog);
  }
}, [blogId, blogState]);

  // Fetch blog
  useEffect(() => {
    if (!selectedBlog && blogId) {
      const fetchBlog = async () => {
        try {
          const { data } = await axios.get(
            `${API_BASE_URL}/api/v1/blog/${blogId}`,
            { withCredentials: true }
          );
          if (data.success) {
            setSelectedBlog(data.blog);
            setLoading(false);
          }
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      };
      fetchBlog();
    } else if (selectedBlog) {
      setLoading(false);
    }
  }, [blogId, selectedBlog]);

  useEffect(() => {
    if (showComments && commentsSectionRef.current) {
      commentsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showComments]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like blogs");
      return;
    }

    try {
      const res = await axios.patch(
        `${API_BASE_URL}/api/v1/blog/${selectedBlog._id}/like`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setLiked(res.data.liked);
        setLikeCount(res.data.likes);
      }
    } catch (error) {
      toast.error("Failed to like blog");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check this blog",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied");
      }
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [blogId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <Skeleton type="blogCard" count={1} />
          <div className="space-y-4">
            <Skeleton type="comment" count={2} />
          </div>
        </div>
      </div>
    );
  }

  if (!selectedBlog) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        Blog not found
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-6xl mt-14 py-10 px-4 md:px-10 space-y-10">

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold">
          {selectedBlog.title}
        </h1>

        {/* Author Info */}
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <img
            src={selectedBlog?.author?.profilePic || userimg}
            alt={selectedBlog?.author?.firstName || "Author"}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => (e.target.src = userimg)}
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {selectedBlog?.author?.firstName} {selectedBlog?.author?.lastName}
            </p>
            <p>
              {new Date(selectedBlog.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}{" "}
              •{" "}
              {new Date(selectedBlog.createdAt).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Image */}
        <img
          src={selectedBlog.thumbnail}
          className="w-full h-[300px] md:h-[500px] object-cover rounded-2xl"
        />

        {/* Description */}
        <div
          dangerouslySetInnerHTML={{ __html: selectedBlog.description }}
        />

        {/* Actions */}
        <div className="flex justify-between">
          <div className="flex gap-5 text-xl">
            <button onClick={handleLike}>
              {liked ? <FaHeart className="text-red-600" /> : <FaRegHeart />}
            </button>
            <FaRegComment
              className="cursor-pointer"
              onClick={() => setShowComments((prev) => !prev)}
            />
          </div>

          <div className="flex gap-5 text-xl">
            <IoShareOutline onClick={handleShare} />
            <button onClick={() => setSaved(!saved)}>
              {saved ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          </div>
        </div>

        <div ref={commentsSectionRef} className="border-t pt-6">
          {showComments && (
            <CommentsSection
              blogId={selectedBlog._id}
              currentUser={user}
              className="bg-white dark:bg-gray-900 p-4 rounded-3xl"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;