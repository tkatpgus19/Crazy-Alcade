// Footer.js

import React from "react";
import PropTypes from "prop-types";
import styles from "./Footer.module.css";
import ActionButton from "./components/ActionButton";

const Footer = ({ onSave, onRun, onSubmit }) => {
  return (
    <div className={styles.footer}>
      <ActionButton
        className={styles.button}
        color="#3498db"
        text="임시 저장"
        onClick={onSave}
      />
      <ActionButton
        className={styles.button}
        color="#27ae60"
        text="코드 실행"
        onClick={onRun}
      />
      <ActionButton
        className={styles.button}
        color="#e74c3c"
        text="코드 제출"
        onClick={onSubmit}
      />
    </div>
  );
};

Footer.propTypes = {
  onSave: PropTypes.func.isRequired,
  onRun: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Footer;
