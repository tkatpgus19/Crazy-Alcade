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

import octopusImage from "../../assets/images/muk.png"; // 문어 이미지의 경로를 정확히 설정하세요.
import chickenImage from "../../assets/images/chick.png"; // 병아리 이미지 경로

function Game() {
  const navigate = useNavigate();
  const isSprayingInk = useSelector((state) => state.octopus.isSprayingInk);
  const isChickenWalking = useSelector((state) => state.feature.chickenWalking); // 병아리 걸음 상태

  const [show, setShow] = useState(false);
  const [chickens, setChickens] = useState([]); // 병아리 이미지 상태

  useEffect(() => {
    if (isSprayingInk) {
      setShow(true);
      setTimeout(() => setShow(false), 5000); // 5초 후 사라짐
    }
  }, [isSprayingInk]);

  useEffect(() => {
    let intervalId;

    if (isChickenWalking) {
      // 병아리가 걸어다니는 상태가 활성화되면 병아리를 생성
      const initialChickens = Array(30)
        .fill(null)
        .map((_, index) => ({
          id: index,
          left: Math.random() * window.innerWidth,
          top: Math.random() * window.innerHeight,
        }));

      setChickens(initialChickens);

      // 병아리 위치를 지속적으로 업데이트
      intervalId = setInterval(() => {
        setChickens((chickens) =>
          chickens.map((chicken) => {
            const speed = 20; // 이동 속도 조정
            let newLeft = chicken.left + (Math.random() - 0.5) * speed;
            let newTop = chicken.top + (Math.random() - 0.5) * speed;

            // 화면 경계 처리
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - 50)); // 병아리 이미지의 너비 고려
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - 50)); // 병아리 이미지의 높이 고려

            return { ...chicken, left: newLeft, top: newTop };
          })
        );
      }, 10); // 200ms 마다 위치 업데이트

      // 5초 후 병아리 숨김 및 위치 업데이트 중단
      setTimeout(() => {
        clearInterval(intervalId);
        setChickens([]);
      }, 5000);
    }

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isChickenWalking]);

  const octopusImages = Array(5)
    .fill(null)
    .map((_, index) => {
      // 무작위 위치 생성
      const style = {
        position: "absolute",
        left: `${Math.random() * 50 + 30}%`,
        top: `${Math.random() * 50 + 10}%`,
        // transform: `translate(-50%, -50%)`, // 중앙 정렬
        width: `${Math.random() * 10 + 20}%`,
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

  // 병아리 이미지 렌더링 로직
  const chickenImages = chickens.map((chicken) => (
    <img
      key={chicken.id}
      src={chickenImage}
      alt={`Walking Chicken ${chicken.id}`}
      style={{
        position: "absolute",
        left: `${chicken.left}px`,
        top: `${chicken.top}px`,
        width: "70px", // 병아리 이미지 크기 조정
      }}
    />
  ));

  const handleExitClick = () => {
    // "/"로 이동하는 코드
    navigate("/");
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
      {chickenImages}
    </div>
  );
}

export default Game;
