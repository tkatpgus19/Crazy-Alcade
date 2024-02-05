import React from "react";
import PropTypes from "prop-types";
import "./GrayBox.css";

const GrayBox = ({ children }) => {
  return <div className="gray-box1">{children}</div>;
};

GrayBox.propTypes = {
  children: PropTypes.node, // Add prop types for 'children'
};

export default GrayBox;
