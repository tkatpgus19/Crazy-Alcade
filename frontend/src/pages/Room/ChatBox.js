import React from "react";
import PropTypes from "prop-types";
import "./ChatBox.css";

const ChatBox = ({ children }) => {
  return <div className="chat-box">{children}</div>;
};

ChatBox.propTypes = {
  children: PropTypes.node, // Add prop types for 'children'
};

export default ChatBox;
