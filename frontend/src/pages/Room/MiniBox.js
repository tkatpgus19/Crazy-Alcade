// MiniBox.js

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./MiniBox.module.css"; // Import the modular CSS file
import ModalAlert from "../../components/alert/ModalAlert";
import userEvent from "@testing-library/user-event";

const MiniBox = ({
  master,
  image,
  nickname,
  status,
  currentUser,
  userUUID,
  roomId,
}) => {
  let showModalAlert = false;
  // 지금 내가 방장인가?
  if (master === currentUser) {
    if (nickname !== currentUser) {
      showModalAlert = true;
    }
  }
  if (nickname === undefined) {
    showModalAlert = false;
  }

  return (
    <div className={styles.minibox}>
      {showModalAlert && (
        <ModalAlert
          message={`${nickname}을(를) 강퇴시키시겠습니까?`}
          showCancelButton={true}
          showConfirmButton={true}
          userUUID={userUUID}
          roomId={roomId}
        />
      )}
      <div>
        <img className={styles.img} src={image} alt="이미지" />
      </div>
    </div>
  );
};
MiniBox.propTypes = {
  master: PropTypes.string.isRequired,
  image: PropTypes.string,
  nickname: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired,
  userUUID: PropTypes.string.isRequired,
  roomId: PropTypes.string.isRequired,
};

export default MiniBox;
