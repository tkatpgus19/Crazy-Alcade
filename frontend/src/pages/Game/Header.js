import React from "react";
import PropTypes from "prop-types";
import styles from "./Header.module.css";

import RoomTitle from "../../components/titles/RoomTitle.js";
import LanguageBox from "./components/LanguageBox.js";
import Timer from "./components/Timer.js";
import ExitButton from "../../components/buttons/ExitButton.js";

const Header = ({ roomTitle, language, remainingTime, onExitClick }) => {
  return (
    <div className={styles.header}>
      <div className={styles.roomInfo}>
        <RoomTitle title={roomTitle} />
        <LanguageBox language={language} />
      </div>
      <div className={styles.timerAndExit}>
        <Timer remainingTime={remainingTime} />
        <ExitButton onClick={onExitClick} />
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
