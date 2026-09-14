import React, { useState, useEffect, useRef } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaTrash,
  FaPencilAlt,
  FaEllipsisV,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../utils/api";
import { getProfileImage } from "../utils/profileImage";
import UserProfileModal from "./UserProfileModal"; // ✅ IMPORT

const CommentItem = ({
  comment,
  currentUserId,
  onCommentUpdated,
  onCommentDeleted,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showMenu, setShowMenu] = useState(false);

  // ✅ MODAL STATE
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔥 LIKE STATES
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes?.length || 0);

  const menuRef = useRef(null);

  const isOwner = currentUserId === comment.user?._id;

  useEffect(() => {
    setLiked(comment.likes?.includes(currentUserId));
    setLikeCount(comment.likes?.length || 0);
  }, [comment, currentUserId]);

  // CLOSE MENU OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ OPEN USER PROFILE
  const handleUserClick = () => {
    if (!comment.user?._id) return;
    setSelectedUser(comment.user);
    setIsModalOpen(true);
  };

  // 🔥 LIKE HANDLER
  const handleLike = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/comment/${comment._id}/like`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setLiked(res.data.liked);
        setLikeCount(res.data.likes);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async () => {
    if (!editText.trim()) return;

    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/api/v1/comment/${comment._id}`,
        { text: editText },
        { withCredentials: true }
      );

      if (data.success) {
        onCommentUpdated(data.comment);
        setIsEditing(false);
        setShowMenu(false);
        toast.success("Comment updated!");
      }
    } catch (err) {
      toast.error("Failed to edit comment");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      const { data } = await axios.delete(
        `${API_BASE_URL}/api/v1/comment/${comment._id}`,
        { withCredentials: true }
      );

      if (data.success) {
        onCommentDeleted(comment._id);
        toast.success("Comment deleted!");
      }
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <>
      <div className="flex gap-3 relative">
        {/* ✅ Avatar — CLICKABLE */}
        <button
          onClick={handleUserClick}
          className="shrink-0 rounded-full ring-2 ring-transparent hover:ring-[oklch(0.71_0.2_46.45)]/40 transition-all duration-200 overflow-hidden cursor-pointer"
          aria-label="View user profile"
        >
          <img
            src={getProfileImage(comment.user?.profilePic)}
            alt={comment.user?.firstName || "Avatar"}
            loading="eager"
            fetchPriority="high"
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getProfileImage(null);
            }}
          />
        </button>

        <div className="flex-1 space-y-2">
          {/* COMMENT BOX */}
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl relative">
            {/* ✅ Name — CLICKABLE */}
            <button
              onClick={handleUserClick}
              className="font-semibold text-sm capitalize text-gray-900 dark:text-white hover:text-[oklch(0.71_0.2_46.45)] transition-colors cursor-pointer"
            >
              {comment.user?.firstName} {comment.user?.lastName}
            </button>

            {isEditing ? (
              <div className="flex gap-2 mt-2">
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 border rounded px-2 py-1 text-sm bg-white dark:bg-slate-900 dark:border-slate-700"
                />
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 text-xs font-medium rounded bg-[oklch(0.71_0.2_46.45)] text-white hover:bg-[oklch(0.65_0.2_46.45)] transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-xs font-medium rounded border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                {comment.text}
              </p>
            )}

            {/* MENU */}
            {isOwner && !isEditing && (
              <div ref={menuRef} className="absolute top-2 right-2">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-gray-500 dark:text-gray-400"
                >
                  <FaEllipsisV className="w-3.5 h-3.5" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 shadow-lg rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden min-w-[120px] z-10">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <FaPencilAlt className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        handleDelete();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    >
                      <FaTrash className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* LIKE */}
          <div className="flex items-center gap-5 text-xs text-gray-500">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors ${
                liked
                  ? "text-red-500"
                  : "hover:text-red-500 text-gray-500 dark:text-gray-400"
              }`}
            >
              {liked ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart />
              )}
              <span>{likeCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ✅ USER PROFILE MODAL */}
      <UserProfileModal
        isOpen={isModalOpen}
        user={selectedUser}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CommentItem;