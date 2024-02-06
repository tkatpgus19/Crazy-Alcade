import React, { useState } from "react";
import styles from "./WaitingRoom.module.css";

const Status = () => {
  const [isReady, setIsReady] = useState(false);
  const toggleReady = () => {
    setIsReady(!isReady);
  };

  const statusClassName = isReady ? styles.ready : styles.unready;

  return (
    <div className={styles.status}>
      <div className={styles.charid}>닉네임</div>
      <div className={statusClassName} onClick={toggleReady}>
        READY
      </div>
    </div>
  );
};

export default Status;
