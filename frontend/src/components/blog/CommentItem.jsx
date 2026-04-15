import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import ReplyInput from "./ReplyInput";

const CommentItem = ({ comment, toggleLike, addReply }) => {
  return (
    <div className="flex gap-3">
      <img
        src={comment.profile}
        alt=""
        className="w-8 h-8 rounded-full object-cover"
      />

      <div className="flex-1">
        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl">
          <p className="font-medium text-sm text-gray-800 dark:text-white">
            {comment.name}
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-200">
            {comment.text}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
          <button
            onClick={() => toggleLike(comment.id)}
            className="flex items-center gap-1"
          >
            {comment.liked ? (
              <FaHeart className="text-red-500 text-xs" />
            ) : (
              <FaRegHeart className="text-xs" />
            )}
            {comment.likes}
          </button>

          <ReplyInput commentId={comment.id} onReply={addReply} />
        </div>

        {comment.replies.map((r) => (
          <div
            key={r.id}
            className="ml-6 mt-2 bg-gray-200 dark:bg-gray-600 px-3 py-2 rounded-xl text-sm text-gray-700 dark:text-gray-100"
          >
            {r.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentItem;