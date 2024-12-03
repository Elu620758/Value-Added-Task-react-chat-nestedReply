import React, { useState } from "react";
import "./chatstyles.css";

const Chatapp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // Tracks the message being replied to

  const handleSend = () => {
    if (input.trim() !== "") {
      const newMessage = {
        id: Date.now(),
        text: input,
        parentId: replyingTo,
        replies: [],
      };

      if (replyingTo === null) {
        setMessages([...messages, newMessage]); // Top-level message
      } else {
        setMessages(addReply(messages, replyingTo, newMessage)); // Add as a reply
      }

      setInput(""); // Clear input
      setReplyingTo(null); // Reset replying state
    }
  };

  const addReply = (messageList, parentId, newReply) => {
    return messageList.map((msg) => {
      if (msg.id === parentId) {
        return { ...msg, replies: [...msg.replies, newReply] };
      } else if (msg.replies.length > 0) {
        return { ...msg, replies: addReply(msg.replies, parentId, newReply) };
      }
      return msg;
    });
  };

  const renderMessages = (messageList) => {
    return messageList.map((message) => (
      <div key={message.id} className="message-block">
        <div className="message-container">
          <div className="message">{message.text}</div>
          <button
            className="reply-button"
            onClick={() => setReplyingTo(message.id)}
          >
            Reply
          </button>
        </div>
        {message.replies.length > 0 && (
          <div className="nested-replies">
            {renderMessages(message.replies)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="chat-app">
      <div className="input-container">
        <input
          type="text"
          placeholder={replyingTo ? "Type a reply..." : "Type a message..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
      <div className="chat-box">{renderMessages(messages)}</div>
    </div>
  );
};

export default Chatapp;
