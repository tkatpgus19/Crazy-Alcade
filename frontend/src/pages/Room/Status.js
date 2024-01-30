import React from "react";
import "./Status.css";
import styles from "./WaitingRoom.module.css";

const Status = () => {
  return (
    <div className="status">
      <div className={styles.charid}>닉네임</div>
      <div className={styles.ready}>READY</div>
    </div>
  );
};

export default Status;
