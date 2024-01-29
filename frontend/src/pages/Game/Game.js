import React from "react";

import Header from "./Header"; // Header 컴포넌트의 경로에 맞게 수정하세요.
import VideoScreen from "./VideoScreen";
import Problem from "./Problem";
import WebIDE from "./WebIDE";
import styles from "./Game.module.css";
//importVideoChat from "./VideoChat"; // VideoChat 컴포넌트의 경로에 맞게 수정하세요.
// import ChatBox from "./ChatBox"; // ChatBox 컴포넌트의 경로에 맞게 수정하세요.

function Game() {
  return (
    <div className={styles.backgroundStyle}>
      <Header
        roomTitle="1. 너만 오면 고"
        language="Python"
        remainingTime={20} // 예시로 120초 설정
        onExitClick={() => alert("Exit clicked")}
      />
      <VideoScreen />
      <div className={styles.mainContent}>
        <div className={styles.problemArea}>
          <Problem />
        </div>
        <div className={styles.webIDE}>
          <WebIDE />
        </div>
      </div>
    </div>
  );
}

export default Game;
