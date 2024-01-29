import React from "react";
import PropTypes from "prop-types";
import "./StatusMini.css"; // 해당 컴포넌트의 스타일을 적용하는 CSS 파일

const StatusMini = ({ children }) => {
  return <div className="statusMini-box">{children}</div>;
};

StatusMini.propTypes = {
  children: PropTypes.node,
};

export default StatusMini;
