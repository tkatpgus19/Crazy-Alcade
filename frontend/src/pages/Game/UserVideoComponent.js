import React from "react";
import PropTypes from "prop-types"; // prop-types 불러오기
import styles from "./UserVideo.module.css"; // CSS 모듈 임포트
import OpenViduVideoComponent from "./OvVideo"; // OpenVidu 비디오 컴포넌트 임포트

// UserVideoComponent 컴포넌트 정의
const UserVideoComponent = ({ streamManager }) => {
  // 사용자의 닉네임을 가져오는 함수
  const getNicknameTag = () => {
    // streamManager에서 연결 데이터를 가져와 JSON 파싱하여 클라이언트 데이터에서 닉네임을 추출
    return JSON.parse(streamManager.stream.connection.data).clientData;
  };

  return (
    <div className={styles.container}>
      {streamManager !== undefined ? (
        <div>
          <OpenViduVideoComponent streamManager={streamManager} />
          <div className={styles.streamcomponent}>
            <div className={styles.nickname}>{getNicknameTag()}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

// PropTypes 사용
UserVideoComponent.propTypes = {
  streamManager: PropTypes.object,
};

export default UserVideoComponent;
