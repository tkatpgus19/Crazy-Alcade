import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./WaitingRoom.module.css";

const Status = ({ nickname, status }) => {
  const [isReady, setIsReady] = useState(false);

  const toggleReady = () => {
    setIsReady(!isReady);
  };

  const statusClassName =
    status === "READY"
      ? styles.readytext
      : status === "MASTER"
        ? styles.master
        : styles.unreadytext;

  return (
    <div className={styles.status}>
      <div className={styles.charid}>{nickname}</div>
      <div className={statusClassName} onClick={toggleReady}>
        {status}
      </div>
    </div>
  );
};

Status.propTypes = {
  nickname: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

export default Status;
