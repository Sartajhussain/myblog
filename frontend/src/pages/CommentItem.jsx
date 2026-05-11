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

const CommentItem = ({
  comment,
  currentUserId,
  onCommentUpdated,
  onCommentDeleted,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showMenu, setShowMenu] = useState(false);

  // 🔥 LIKE STATES (FIX)
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

  // 🔥 LIKE HANDLER (NEW FIX)
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
    <div className="flex gap-3 relative">
      {/* Avatar */}
      <img
        src={
          comment.user?.profilePic ||
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        }
        className="w-10 h-10 rounded-full object-cover"
      />

      <div className="flex-1 space-y-2">

        {/* COMMENT BOX */}
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl relative">

          <p className="font-semibold text-sm">
            {comment.user?.firstName} {comment.user?.lastName}
          </p>

          {isEditing ? (
            <div className="flex gap-2 mt-2">
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 border rounded px-2 py-1 text-sm"
              />
              <button onClick={handleEdit}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          ) : (
            <p className="text-sm mt-1">{comment.text}</p>
          )}

          {/* MENU */}
          {isOwner && !isEditing && (
            <div ref={menuRef} className="absolute top-2 right-2">
              <button onClick={() => setShowMenu(!showMenu)}>
                <FaEllipsisV />
              </button>

              {showMenu && (
                <div className="absolute right-0 bg-white dark:bg-gray-700 shadow rounded">
                  <button onClick={() => setIsEditing(true)}>Edit</button>
                  <button onClick={handleDelete}>Delete</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 🔥 LIKE UI FIXED */}
        <div className="flex items-center gap-5 text-xs text-gray-500">

          <button
            onClick={handleLike}
            className="flex items-center gap-1"
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
  );
};

export default CommentItem;