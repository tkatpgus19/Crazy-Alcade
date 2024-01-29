import React from "react";
import PropTypes from "prop-types";
import "./Start.css";

const StartButton = ({ onClick }) => {
  return (
    <button className="start-button" onClick={onClick}>
      START
    </button>
  );
};

StartButton.propTypes = {
  onClick: PropTypes.func, // onClick props should be a function
};

export default StartButton;
