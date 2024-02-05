import React from "react";
import PropTypes from "prop-types";
import styles from "./ExitButton.module.css"; // ExitButton에 대한 별도의 CSS 파일을 만들 수 있습니다.

const ExitButton = ({ onClick }) => {
  return (
    <button className={styles.exitButton} onClick={onClick}>
      나가기
    </button>
  );
};

// ExitButton 컴포넌트의 Prop types
ExitButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default ExitButton;
