import React from "react";
import PropTypes from "prop-types";
import ExitButton from "../../components/buttons/ExitButton.js"; // Import the ExitButton component
import styles from "./WaitingRoom.module.css";

const RoomHeader2 = ({ onExitClick, problemName }) => {
  return (
    <div className={styles.roomheader2}>
      <div>
        <div className={styles.gametitle}>{problemName}</div>
      </div>
      <ExitButton onClick={onExitClick} /> {/* Use ExitButton component */}
    </div>
  );
};

// 리액트 컴포넌트의 props에 대한 타입 검증
RoomHeader2.propTypes = {
  onExitClick: PropTypes.func.isRequired,
  problemName: PropTypes.string.isRequired,
};

export default RoomHeader2;
