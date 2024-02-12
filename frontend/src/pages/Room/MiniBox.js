// MiniBox.js

import React from "react";
import PropTypes from "prop-types";
import styles from "./MiniBox.module.css"; // Import the modular CSS file
import ModalAlert from "../../components/alert/ModalAlert";

const MiniBox = ({ children, image }) => {
  return (
    <div className={styles.minibox}>
      <ModalAlert
        message="창준이를 강퇴시키시겠습니까"
        showCancelButton={true}
        showConfirmButton={true}
      />
      <div>
        <img className={styles.img} src={image} alt="이미지" />
      </div>
      {children}
    </div>
  );
};

MiniBox.propTypes = {
  children: PropTypes.node,
  image: PropTypes.string,
};

export default MiniBox;
