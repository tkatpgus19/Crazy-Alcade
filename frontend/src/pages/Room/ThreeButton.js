import React from "react";
import PropTypes from "prop-types";
import "./ThreeButton.css";

const ThreeButton = ({ children }) => {
  return <button className="three-button">{children}</button>;
};

ThreeButton.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThreeButton;
