// VideoScreen.js

import React from "react";
import styles from "./VideoScreen.module.css";

const VideoScreen = () => {
  const dummyUrl =
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const videoUrls = [dummyUrl, dummyUrl, dummyUrl, dummyUrl, dummyUrl];

  return (
    <div className={styles.videoScreen}>
      <div className={styles.userArea}>
        <div className={styles.userVideo}>
          <iframe
            title="User Video"
            src={`${dummyUrl}?autoplay=1`}
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
            src={`${dummyUrl}?autoplay=1`}
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
