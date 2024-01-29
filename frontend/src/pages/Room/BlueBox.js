import React from "react";
import PropTypes from "prop-types";
import "./BlueBox.css";

const BlueBox = ({ children }) => {
  return <div className="blue-box">{children}</div>;
};

BlueBox.propTypes = {
  children: PropTypes.node, // Add prop types for 'children'
};

export default BlueBox;
