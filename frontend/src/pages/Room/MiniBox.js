import React from "react";
import PropTypes from "prop-types";
import "./MiniBox.css"; // 해당 컴포넌트의 스타일을 적용하는 CSS 파일

const MiniBox = ({ children }) => {
  return <div className="mini-box">{children}</div>;
};

MiniBox.propTypes = {
  children: PropTypes.node,
};

export default MiniBox;
