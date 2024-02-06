import React from "react";
import PropTypes from "prop-types";
import ExitButton from "../../components/buttons/ExitButton.js"; // Import the ExitButton component
import styles from "./WaitingRoom.module.css";

const RoomHeader2 = ({ onExitClick }) => {
  return (
    <div className={styles.roomheader2}>
      <div>
        <div className={styles.gametitle}>1557. 왜 이렇게 빨리 끝나나요</div>
      </div>
      <ExitButton onClick={onExitClick} /> {/* Use ExitButton component */}
    </div>
  );
};

// 리액트 컴포넌트의 props에 대한 타입 검증
RoomHeader2.propTypes = {
  onExitClick: PropTypes.func.isRequired,
};

export default RoomHeader2;
