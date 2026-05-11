import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEllipsisV, FaHeart, FaRegHeart } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { API_BASE_URL } from "../utils/api";
import Skeleton from "./Skeleton";
import userimg from "../assets/userprofile.png";

const CommentsSection = ({
  blogId,
  currentUser,
  initialComments,
  title = "Comments",
  fetchUrl,
  addUrl,
  updateUrl,
  deleteUrl,
  showCount = 3,
  className = "",
  onCommentsChange,
}) => {
  const initialCommentsValue = Array.isArray(initialComments) ? initialComments : [];
  const [comments, setComments] = useState(initialCommentsValue);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const inputRef = useRef(null);
  const onCommentsChangeRef = useRef(onCommentsChange);

  useEffect(() => {
    onCommentsChangeRef.current = onCommentsChange;
  }, [onCommentsChange]);

  useEffect(() => {
    if (!Array.isArray(initialComments)) return;
    if (initialComments.length === 0) return;
    setComments(initialComments);
  }, [initialComments]);

  const fetchComments = useCallback(async () => {
    if (!blogId) return;

    const url = fetchUrl || `${API_BASE_URL}/api/v1/comment/blog/${blogId}`;
    setLoading(true);

    try {
      const { data } = await axios.get(url, { withCredentials: true });
      if (data.success) {
        setComments(data.comments || []);
        onCommentsChangeRef.current?.(data.comments || []);
      }
    } catch (err) {
      console.error("Failed to load comments", err);
    } finally {
      setLoading(false);
    }
  }, [blogId, fetchUrl]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const getImageUrl = (value) => {
    if (!value) return userimg;
    if (value.startsWith("http")) return value;
    return `${API_BASE_URL}/${value}`;
  };

  const formatDate = (createdAt) => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let label;
    if (date.toDateString() === today.toDateString()) {
      label = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      label = "Yesterday";
    } else {
      label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }

    const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    return `${label} • ${time}`;
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    if (!currentUser) {
      toast.error("Please log in to add a comment.");
      return;
    }

    const url = addUrl || `${API_BASE_URL}/api/v1/comment/${blogId}/add-comment`;
    try {
      const { data } = await axios.post(
        url,
        { text: commentText },
        { withCredentials: true }
      );
      if (data.success) {
        const updatedComments = [data.comment, ...comments];
        setComments(updatedComments);
        setCommentText("");
        onCommentsChangeRef.current?.(updatedComments);
        toast.success("Comment posted.");
        inputRef.current?.blur();
      }
    } catch (err) {
      console.error("Add comment failed", err);
      toast.error(err.response?.data?.message || "Unable to post comment.");
    }
  };

  const handleEditComment = async () => {
    if (!editingText.trim() || !editingCommentId) return;

    const url =
      updateUrl?.(editingCommentId) ||
      `${API_BASE_URL}/api/v1/comment/${editingCommentId}`;

    try {
      const { data } = await axios.put(
        url,
        { text: editingText },
        { withCredentials: true }
      );

      if (data.success) {
        const updatedComments = comments.map((comment) =>
          comment._id === editingCommentId ? data.comment : comment
        );
        setComments(updatedComments);
        setEditingCommentId(null);
        setEditingText("");
        setActiveMenuId(null);
        onCommentsChangeRef.current?.(updatedComments);
        toast.success("Comment updated.");
      }
    } catch (err) {
      console.error("Edit comment failed", err);
      toast.error(err.response?.data?.message || "Unable to update comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    const url = deleteUrl?.(commentId) || `${API_BASE_URL}/api/v1/comment/${commentId}`;
    try {
      const { data } = await axios.delete(url, { withCredentials: true });
      if (data.success) {
        const updatedComments = comments.filter((comment) => comment._id !== commentId);
        setComments(updatedComments);
        setActiveMenuId(null);
        onCommentsChangeRef.current?.(updatedComments);
        toast.success("Comment removed.");
      }
    } catch (err) {
      console.error("Delete comment failed", err);
      toast.error(err.response?.data?.message || "Unable to delete comment.");
    }
  };

  const visibleComments = showAll ? comments : comments.slice(0, showCount);
  const commentCount = comments.length;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{commentCount} comment{commentCount === 1 ? "" : "s"}</p>
        </div>
        {commentCount > showCount && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            {showAll ? "Show less" : `View all ${commentCount}`}
          </button>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-gray-900 p-4">
        <img
          src={currentUser?.profilePic ? getImageUrl(currentUser.profilePic) : userimg}
          alt={currentUser?.firstName || "User"}
          className="w-12 h-12 rounded-full object-cover"
          onError={(event) => {
            event.target.src = userimg;
          }}
        />
        <div className="flex-1 flex items-center gap-2 rounded-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-gray-800 px-4 py-3">
          <input
            ref={inputRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={currentUser ? "Write a comment..." : "Login to comment"}
            className="flex-1 bg-transparent text-sm outline-none text-gray-900 dark:text-gray-100"
            disabled={!currentUser}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />
          <button
            onClick={handleAddComment}
            disabled={!currentUser || !commentText.trim()}
            className="rounded-full p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiSend size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <Skeleton type="comment" count={showCount} />
      ) : commentCount === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 dark:border-slate-700 bg-white dark:bg-gray-900 p-8 text-center text-sm text-gray-500 dark:text-gray-400">
          No comments yet. Be the first to add one.
        </div>
      ) : (
        <div className="space-y-4">
          {visibleComments.map((comment) => {
            const isOwner = currentUser?._id === comment.user?._id;
            return (
              <div
                key={comment._id}
                className="flex gap-3 rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-gray-900 p-4"
              >
                <img
                  src={getImageUrl(comment.user?.profilePic)}
                  alt={comment.user?.firstName || "Avatar"}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(event) => {
                    event.target.src = userimg;
                  }}
                />
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">
                        {comment.user?.firstName} {comment.user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                    {isOwner && (
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenuId((prev) => (prev === comment._id ? null : comment._id))}
                          className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800"
                        >
                          <FaEllipsisV />
                        </button>
                        {activeMenuId === comment._id && (
                          <div className="absolute right-0 top-10 w-32 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg z-20">
                            <button
                              onClick={() => {
                                setEditingCommentId(comment._id);
                                setEditingText(comment.text);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {editingCommentId === comment._id ? (
                    <div className="space-y-2">
                      <input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleEditComment}
                          className="rounded-full bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditingText("");
                          }}
                          className="rounded-full border border-gray-200 dark:border-slate-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                      {comment.text}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <button className="flex items-center gap-1">
                      <FaRegHeart />
                      <span>{comment.likes || 0}</span>
                    </button>
                    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-500">
                      <FaHeart />
                      <span>Like</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
