// ActionButton.js

import React from "react";
import PropTypes from "prop-types";
import styles from "./ActionButton.module.css";

const ActionButton = ({ color, text, onClick }) => {
  return (
    <button
      className={styles.button}
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

ActionButton.propTypes = {
  color: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ActionButton;
