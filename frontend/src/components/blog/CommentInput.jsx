import React from "react";
import { FiSend } from "react-icons/fi";
  import axios from "axios";
import toast from "react-hot-toast";

const CommentInput = ({ profile, comment, setComment, blogId, onCommentAdded }) => {


const handleAddComment = async () => {

  if(!comment.trim()) return;

  try{

    const {data} = await axios.post(
      `${API_BASE_URL}/api/v1/comment/${blogId}/add-comment`,
      {
        text: comment
      },
      {
        withCredentials:true
      }
    );

    console.log("Comment response:", data);

    if(data.success){

      onCommentAdded(data.comment);
      setComment("");

      toast.success("Comment added");

    }

  }catch(err){

    console.error("Comment error:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Comment failed");

  }

};
  return (
    <div className="flex items-start gap-3 pt-3">
      <img
        src={profile}
        alt=""
        className="w-9 h-9 rounded-full object-cover"
      />

      <div className="flex-1 flex items-center border rounded-full px-4 py-2 bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
        <input
          type="text"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-white"
        />

        <FiSend
          onClick={handleAddComment}
          className="cursor-pointer hover:text-blue-500"
        />
      </div>
    </div>
  );
};

export default CommentInput;