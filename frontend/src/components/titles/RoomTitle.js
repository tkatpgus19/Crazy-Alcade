// RoomTitle.js

import React from "react";
import PropTypes from "prop-types";
import "./RoomTitle.css"; // RoomTitle에 대한 별도의 CSS 파일을 만들 수 있습니다.

const RoomTitle = ({ title }) => {
  return <div className="room-title">{title}</div>;
};

// RoomTitle 컴포넌트의 Prop types
RoomTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default RoomTitle;
