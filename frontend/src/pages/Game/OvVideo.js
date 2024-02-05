import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types"; // prop-types 임포트 추가
import styles from "./UserVideo.module.css";

const OpenViduVideoComponent = ({ streamManager }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }

    return () => {
      if (streamManager && videoRef.current) {
        streamManager.removeVideoElement(videoRef.current);
      }
    };
  }, [streamManager]);

  return (
    <div>
      <video className={styles.ovvideo} autoPlay={true} ref={videoRef} />
    </div>
  );
};

// props 타입 정의
OpenViduVideoComponent.propTypes = {
  streamManager: PropTypes.object, // streamManager의 타입을 여기에 맞게 정의 (예: object 타입)
};

export default OpenViduVideoComponent;
