// GameTitle.js

import React from "react";
import PropTypes from "prop-types";
import "./GameTitle.css"; // GameTitle에 대한 별도의 CSS 파일을 만들 수 있습니다.

const GameTitle = ({ title }) => {
  return <div className="game-title">{title}</div>;
};

// GameTitle 컴포넌트의 Prop types
GameTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default GameTitle;
