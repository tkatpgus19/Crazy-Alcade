import React from "react";

import Header from "./Header"; // Header 컴포넌트의 경로에 맞게 수정하세요.
import VideoScreen from "./VideoScreen";
import Problem from "./Problem";
import styles from "./Game.module.css";
import Footer from "./Footer";
import WebIDE from "./WebIDE";

import { Resizable } from "re-resizable";
import styled from "@emotion/styled";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
`;

const LeftDiv = styled.div`
  flex: 1;
  background-color: #2980b9;
`;

const RightDiv = styled.div`
  margin-left: 20px;
  background-color: skyblue;
  height: 100%;
`;

function Game() {
  const handleSave = () => {
    // 임시 저장 로직
    alert("임시 저장");
  };

  const handleRun = () => {
    // 코드 실행 로직
    alert("코드 실행");
  };

  const handleSubmit = () => {
    // 코드 제출 로직
    alert("코드 제출");
  };

  return (
    <div className={styles.backgroundStyle}>
      <Header
        roomTitle="1. 너만 오면 고"
        language="Python"
        initialTime={60} // 예시로 120초 설정
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
      <Container>
        <LeftDiv />
        <Resizable
          defaultSize={{ width: "50%", height: "100%" }}
          minWidth={"20%"}
          maxWidth={"80%"}
          enable={{
            top: false,
            right: false,
            bottom: false,
            left: true,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          handleStyles={{
            left: {
              width: "20px",
              height: "100%",
              left: "0px",
              backgroundColor: "#d1d5db",
            },
          }}
        >
          <RightDiv />
        </Resizable>
      </Container>
      <Footer onSave={handleSave} onRun={handleRun} onSubmit={handleSubmit} />
    </div>
  );
}

export default Game;
