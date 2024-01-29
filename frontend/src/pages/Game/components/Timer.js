// Timer.js

import React from "react";
import PropTypes from "prop-types";
import "./Timer.css"; // Timer에 대한 별도의 CSS 파일을 만들 수 있습니다.

const Timer = ({ remainingTime }) => {
  return <div className="timer">TIME {remainingTime}:00</div>;
};

// Timer 컴포넌트의 Prop types
Timer.propTypes = {
  remainingTime: PropTypes.number.isRequired,
};

export default Timer;
