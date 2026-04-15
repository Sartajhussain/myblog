import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { IoShareOutline } from "react-icons/io5";
import CommentItem from "./CommentItem";
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

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const [showCommentBox, setShowCommentBox] = useState(false);
  const commentRef = useRef(null);

  // Fetch blog
  useEffect(() => {
    if (!selectedBlog && blogId) {
      const fetchBlog = async () => {
        try {
          const { data } = await axios.get(
            `http://localhost:8000/api/v1/blog/${blogId}`,
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
  }, [blogId]);

  // Fetch comments
  useEffect(() => {
    if (selectedBlog) {
      const fetchComments = async () => {
        try {
          const { data } = await axios.get(
            `http://localhost:8000/api/v1/comment/blog/${selectedBlog._id}`,
            { withCredentials: true }
          );
          if (data.success) {
            setComments(data.comments || []);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchComments();
    }
  }, [selectedBlog]);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
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

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/v1/comment/${selectedBlog._id}/add-comment`,
        { text: comment },
        { withCredentials: true }
      );

      if (data.success) {
        setComments([data.comment, ...comments]);
        setComment("");
        toast.success("Comment added!");
      }
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };
  // Update comment in state after edit
const handleCommentUpdated = (updatedComment) => {
  setComments((prev) =>
    prev.map((c) => (c._id === updatedComment._id ? updatedComment : c))
  );
};

// Remove comment from state after delete
const handleCommentDeleted = (deletedCommentId) => {
  setComments((prev) => prev.filter((c) => c._id !== deletedCommentId));
};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [blogId]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-gray-300 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin"></div>
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
              onClick={() => {
                setShowCommentBox(true);
                setTimeout(() => {
                  commentRef.current?.focus();
                }, 100);
              }}
            />
          </div>

          <div className="flex gap-5 text-xl">
            <IoShareOutline onClick={handleShare} />
            <button onClick={() => setSaved(!saved)}>
              {saved ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          </div>
        </div>

        {/* Comment Section */}
        <div className="border-t pt-6 space-y-6">

          {/* Comment Box */}
          {showCommentBox && (
            <div className="flex items-start gap-3">
              <img
                src={user?.profilePic || userimg}
                alt={user?.firstName || "User"}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => (e.target.src = userimg)}
              />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddComment();
                }}
                className="flex-1 flex items-center border rounded-full px-4 py-2"
              >
                <input
                  ref={commentRef}
                  type="text"
                  placeholder="Leave a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-1 outline-none"
                />
                <button type="submit">
                  <FiSend />
                </button>
              </form>
            </div>
          )}

          {/* Existing Comments */}
          {comments.map((c) => (
            <CommentItem
              key={c._id}
              comment={c}
              currentUserId={user?._id}   
              onCommentUpdated={handleCommentUpdated} 
              onCommentDeleted={handleCommentDeleted}
            />
          ))}

        </div>
      </div>
    </div>
  );
};

export default ViewBlog;