import React from "react";
import PropTypes from "prop-types";
import "./Header.css"; // 필요에 따라 CSS 파일의 경로를 수정하세요.
import ExitButton from "../../components/buttons/ExitButton.js"; // Import the ExitButton component
import RoomTitle from "../../components/titles/RoomTitle.js"; // Import the ExitButton component

const Header = ({ roomTitle, language, remainingTime, onExitClick }) => {
  return (
    <div className="header">
      <div className="room-info">
        <RoomTitle title={roomTitle} /> {/* RoomTitle 컴포넌트 사용 */}{" "}
        <div className="language-box">{language}</div>
      </div>
      <div className="timer-and-exit">
        <div className="timer">TIME {remainingTime}:00</div>
        <ExitButton onClick={onExitClick} /> {/* Use ExitButton component */}
      </div>
    </div>
  );
};

// 리액트 컴포넌트의 props에 대한 타입 검증
Header.propTypes = {
  roomTitle: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  remainingTime: PropTypes.number.isRequired,
  onExitClick: PropTypes.func.isRequired,
};

export default Header;
