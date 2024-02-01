import React from "react";
import PropTypes from "prop-types";
import RoomTitle from "../../components/titles/RoomTitle.js";
import styles from "./WaitingRoom.module.css";

const RoomHeader = ({ roomTitle }) => {
  return (
    <div className={styles.roomheader1}>
      <div>
        <RoomTitle title={roomTitle} />
      </div>
    </div>
  );
};

// 리액트 컴포넌트의 props에 대한 타입 검증
RoomHeader.propTypes = {
  // Header를 RoomHeader로 수정
  roomTitle: PropTypes.string.isRequired,
};

export default RoomHeader;
