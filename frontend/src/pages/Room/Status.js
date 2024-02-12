import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./WaitingRoom.module.css";

const Status = ({ nickname, status, currentUser }) => {
  const [isReady, setIsReady] = useState(false);

  const toggleReady = () => {
    setIsReady(!isReady);
  };

  const currentUserClassName =
    nickname === currentUser ? styles.currentUser : styles.charid;

  const statusClassName = `${
    status === "READY"
      ? styles.readytext
      : status === "MASTER"
        ? styles.master
        : styles.unreadytext
  } ${currentUserClassName}`; // currentUserClassName 추가
  return (
    <div className={styles.status}>
      <div className={currentUserClassName}>{nickname}</div>
      <div className={statusClassName} onClick={toggleReady}>
        {status}
      </div>
    </div>
  );
};

Status.propTypes = {
  nickname: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired,
};

export default Status;
