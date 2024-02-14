// MiniBox.js

import React from "react";
import PropTypes from "prop-types";
import styles from "./MiniBox.module.css"; // Import the modular CSS file
import ModalAlert from "../../components/alert/ModalAlert";

const MiniBox = ({ children, image, nickname, status, currentUser }) => {
  const showModaAlert = nickname === currentUser && status !== "MASTER";

  return (
    <div className={styles.minibox}>
      {showModaAlert && (
        <ModalAlert
          message={`${nickname}을(를) 강퇴시키시겠습니까?`}
          showCancelButton={true}
          showConfirmButton={true}
        />
      )}
      <div>
        <img className={styles.img} src={image} alt="이미지" />
      </div>
    </div>
  );
};
MiniBox.propTypes = {
  children: PropTypes.node,
  image: PropTypes.string,
  nickname: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  currentUser: PropTypes.string.isRequired,
};

export default MiniBox;
