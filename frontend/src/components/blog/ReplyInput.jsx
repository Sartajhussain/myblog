import React, { useState } from "react";

const ReplyInput = ({ commentId, onReply }) => {
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onReply(commentId, text);
    setText("");
    setShow(false);
  };

  return (
    <div>
      <button
        onClick={() => setShow(!show)}
        className="text-blue-500 text-xs hover:underline"
      >
        Reply
      </button>

      {show && (
        <div className="flex mt-2 gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write reply..."
            className="flex-1 border rounded-full px-3 py-1 text-xs bg-white dark:bg-gray-800 dark:border-gray-700 outline-none"
          />

          <button
            onClick={handleSend}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-full"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ReplyInput;