// GameResults.js
import React from "react";
import PropTypes from "prop-types";

import "./GameResults.module.css";

function GameResults({ onClose }) {
  return (
    <div className="results-overlay">
      <div className="results">
        <h1>게임 결과</h1>
        {/* 결과 내용을 여기에 렌더링 */}
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

GameResults.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default GameResults;
