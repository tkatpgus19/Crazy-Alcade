// VideoScreen.js

import React from "react";
import styles from "./VideoScreen.module.css";

const VideoScreen = () => {
  const videoUrls = [
    "https://example.com/video1",
    "https://example.com/video2",
    "https://example.com/video3",
    "https://example.com/video4",
    "https://example.com/video5",
  ];

  return (
    <div className={styles.videoScreen}>
      <div className={styles.userArea}>
        <div className={styles.userVideo}>
          <iframe
            title="User Video"
            src="https://example.com/user-video"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
        <div className="iconContainer">
          <h1 className="micIcon">🎤</h1>
          <h1 className="soundIcon">🔊</h1>
        </div>
      </div>
      {videoUrls.map((url, index) => (
        <div key={index} className="videoContainer">
          <iframe
            title={`Video ${index + 1}`}
            src={url}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      ))}
      <div>
        <h1 className="chat-icon">🗨️</h1>
      </div>
    </div>
  );
};

export default VideoScreen;
