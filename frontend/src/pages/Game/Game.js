import React, { useEffect, useState } from "react";

import Header from "./Header"; // Header 컴포넌트의 경로에 맞게 수정하세요.
import VideoScreen from "./VideoScreen";
import Problem from "./Problem";
import styles from "./Game.module.css";
import Footer from "./Footer";
import WebIDE from "./WebIDE";

import { Resizable } from "re-resizable";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import octopusImage from "../../assets/images/octopus.png"; // 문어 이미지의 경로를 정확히 설정하세요.

function Game() {
  const navigate = useNavigate();
  const isSprayingInk = useSelector((state) => state.octopus.isSprayingInk);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isSprayingInk) {
      setShow(true);
      setTimeout(() => setShow(false), 5000); // 5초 후 사라짐
    }
  }, [isSprayingInk]);

  const octopusImages = Array(10)
    .fill(null)
    .map((_, index) => {
      // 무작위 위치 생성
      const style = {
        position: "absolute",
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        transform: `translate(-50%, -50%)`, // 중앙 정렬
      };

      return (
        <img
          key={index}
          src={octopusImage}
          alt={`Spraying Octopus ${index + 1}`}
          className={styles.inkImage}
          style={style}
        />
      );
    });

  const handleExitClick = () => {
    // "/"로 이동하는 코드
    navigate("/");
  };

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
        onExitClick={handleExitClick} // 수정된 부분
      />
      <VideoScreen />
      <div className={styles.container}>
        <div className={styles.problemArea}>
          <Problem />
        </div>
        {/* 드래그 컨트롤 */}
        <Resizable
          defaultSize={{ width: "60%", height: "100%" }}
          minWidth={"30%"}
          maxWidth={"70%"}
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
              width: "5px",
              height: "95%",
              left: "-2px",
              backgroundColor: "#d1d5db",
              marginTop: "10px",
              borderRadius: "30px",
            },
          }}
        >
          <div className={styles.webIDE}>
            <WebIDE />
          </div>
        </Resizable>
      </div>
      <Footer />
      {show && octopusImages}
    </div>
  );
}

export default Game;
