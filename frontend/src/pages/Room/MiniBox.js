import React from "react";
import PropTypes from "prop-types";
import "./MiniBox.css"; // 해당 컴포넌트의 스타일을 적용하는 CSS 파일

const MiniBox = ({ children, image }) => {
  return (
    <div className="minibox">
      <div>
        <img src={image} alt="이미지" />
      </div>
      {children}
    </div>
  );
};

MiniBox.propTypes = {
  children: PropTypes.node,
  image: PropTypes.string, // 이미지의 경로를 전달받는 prop 추가
};

export default MiniBox;
