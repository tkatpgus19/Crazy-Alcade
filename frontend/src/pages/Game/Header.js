import React from "react";
import PropTypes from "prop-types";
<<<<<<< HEAD
import "./Header.css";

import RoomTitle from "../../components/titles/RoomTitle.js";
import LanguageBox from "./components/LanguageBox.js";
import Timer from "./components/Timer.js";
import ExitButton from "../../components/buttons/ExitButton.js";
=======
import "./Header.css"; // 필요에 따라 CSS 파일의 경로를 수정하세요.
import ExitButton from "../../components/buttons/ExitButton.js"; // Import the ExitButton component
import RoomTitle from "../../components/titles/RoomTitle.js"; // Import the ExitButton component
>>>>>>> f64ecaaaf1ad79268f4145b2dd7bef3c42b60313

const Header = ({ roomTitle, language, remainingTime, onExitClick }) => {
  return (
    <div className="header">
      <div className="room-info">
        <RoomTitle title={roomTitle} /> {/* RoomTitle 컴포넌트 사용 */}{" "}
<<<<<<< HEAD
        <LanguageBox language={language} />
      </div>
      <div className="timer-and-exit">
        <Timer remainingTime={remainingTime} />
=======
        <div className="language-box">{language}</div>
      </div>
      <div className="timer-and-exit">
        <div className="timer">TIME {remainingTime}:00</div>
>>>>>>> f64ecaaaf1ad79268f4145b2dd7bef3c42b60313
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
