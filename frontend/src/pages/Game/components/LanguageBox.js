// LanguageBox.js

import React from "react";
import PropTypes from "prop-types";
import styles from "./LanguageBox.module.css"; // LanguageBox에 대한 별도의 CSS 파일을 만들 수 있습니다.

const LanguageBox = ({ language }) => {
  return (
    <div className={styles.languageBox}>
      {language == undefined ? language : language.toUpperCase()}
    </div>
  );
};

// LanguageBox 컴포넌트의 Prop types
LanguageBox.propTypes = {
  language: PropTypes.string.isRequired,
};

export default LanguageBox;
