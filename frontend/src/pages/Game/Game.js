import React, { useEffect, useState } from "react";

import Header from "./Header"; // Header 컴포넌트의 경로에 맞게 수정하세요.
import VideoScreen from "./VideoScreen";
import Problem from "./Problem";
import styles from "./Game.module.css";
import Footer from "./Footer";
import WebIDE from "./WebIDE";

import GameResults from "./components/GameResults"; // Adjust the path according to your file structure
import { Resizable } from "re-resizable";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import octopusImage from "../../assets/images/octopus.png"; // 문어 이미지의 경로
import inkImage from "../../assets/images/muk.png"; // 먹물 이미지의 경로
import chickenImage from "../../assets/images/chick.png"; // 병아리 이미지 경로

function Game() {
  const navigate = useNavigate();
  const isSprayingInk = useSelector((state) => state.octopus.isSprayingInk);
  const isChickenWalking = useSelector((state) => state.feature.chickenWalking); // 병아리 걸음 상태
  const isShieldActive = useSelector(
    (state) => state.animationControl.isShieldActive
  );

  const [showOctopus, setOctopus] = useState(false);
  const [chickens, setChickens] = useState([]); // 병아리 이미지 상태
  const [time, setTime] = useState(); // initialTime is now a state
  const [showResults, setShowResults] = useState(false);
  const [inkSpots, setInkSpots] = useState([]); // 먹물 이미지 상태

  // 더미 방 데이터.
  const dummyRoomInfo = {
    roomId: "e50ec323-60ce-4fde-9837-2a393a59897d",
    roomType: "normal",
    roomName: "더미방1",
    hasPassword: false,
    roomPassword: "",
    problemTier: "골드1",
    problemNo: 1000,
    timeLimit: 60,
    language: "JAVA",
    codeReview: false,
    maxUserCnt: 6,
    master: "123",
    userList: {},
    readyList: {},
    started: false,
    userCnt: 0,
  };

  // 타이머 실행
  useEffect(() => {
    setTime(dummyRoomInfo.timeLimit);
    if (time === 0) return;

    // Decrease time by 1 every second
    const timerId = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    // Clean up the interval on unmount
    return () => clearInterval(timerId);
  }, []);

  // 0초가 되면 결과창 표시
  useEffect(() => {
    if (time === 0) {
      setShowResults(true); // When time is 0, show the GameResults component
    }
  }, [time]);

  // 쉴드
  useEffect(() => {
    // "쉴드" 상태가 활성화되면 문어와 병아리 애니메이션을 즉시 제거
    if (isShieldActive) {
      setOctopus(false);
      setInkSpots([]);
      setChickens([]);
    }
  }, [isShieldActive]);

  // 문어 아이템 로직
  useEffect(() => {
    if (isSprayingInk && inkSpots.length === 0) {
      setOctopus(true); // 문어 이미지를 표시

      // 1초 후에 먹물 이미지의 위치를 한 번만 무작위로 계산하여 상태에 저장
      const newInkSpots = Array(10)
        .fill(null)
        .map((_, index) => ({
          id: index,
          left: `${Math.random() * 51 + 35}%`, // 초기 위치 계산
          top: `${Math.random() * 51 + 15}%`, // 초기 위치 계산
          width: `${Math.random() * 4 + 10}%`, // 초기 크기 계산
        }));
      setInkSpots(newInkSpots);
      setTimeout(() => {
        // useDispatch(resetInkSpraying);
        setInkSpots([]);
        setOctopus(false); // 필요한 경우 문어 이미지 숨김
      }, 5000);
    }
  }, [isSprayingInk, inkSpots.length]);

  // 병아리 아이템 로직
  useEffect(() => {
    let intervalId;

    if (isChickenWalking) {
      // 병아리가 걸어다니는 상태가 활성화되면 병아리를 생성
      const initialChickens = Array(30)
        .fill(null)
        .map((_, index) => ({
          id: index,
          left: Math.random() * window.innerWidth - 100,
          top: Math.random() * window.innerHeight - 100,
        }));

      setChickens(initialChickens);

      // 병아리 위치를 지속적으로 업데이트
      intervalId = setInterval(() => {
        setChickens((chickens) =>
          chickens.map((chicken) => {
            const speed = 50; // 이동 속도 조정
            let newLeft = chicken.left + (Math.random() - 0.5) * speed;
            let newTop = chicken.top + (Math.random() - 0.5) * speed;

            // 화면 경계 처리
            newLeft = Math.max(50, Math.min(newLeft, window.innerWidth - 100)); // 병아리 이미지의 너비 고려
            newTop = Math.max(50, Math.min(newTop, window.innerHeight - 100)); // 병아리 이미지의 높이 고려

            return { ...chicken, left: newLeft, top: newTop };
          })
        );
      }, 100); // 200ms 마다 위치 업데이트

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

  // 문어 이미지 렌더링 로직
  const OctopusImage = () => (
    <img
      src={octopusImage} // 'octopusImage'는 상단에서 import한 문어 이미지의 경로입니다.
      alt="Spraying Octopus"
      className={styles.inkImage}
      style={{
        position: "absolute",
        left: "63%",
        top: "45%",
        transform: "translate(-50%, -50%)", // 이 부분이 중요합니다.
        width: "200px", // 적절한 크기 조정
        zIndex: 5, // 다른 요소 위에 표시되도록 z-index 설정
        pointerEvents: "none", // 이 부분을 추가합니다.
      }}
    />
  );

  // 먹물 이미지 렌더링 로직을 수정하여 이미 계산된 위치를 사용
  const inkSpotImages = inkSpots.map((spot) => (
    <img
      key={spot.id}
      src={inkImage} // 먹물 이미지로 변경해야 할 경우 해당 경로 수정
      alt={`Ink Spot ${spot.id}`}
      className={styles.inkImage}
      style={{
        position: "absolute",
        left: spot.left, // 이미 저장된 위치 사용
        top: spot.top, // 이미 저장된 위치 사용
        width: spot.width, // 이미 저장된 크기 사용
        zIndex: 4,
        pointerEvents: "none", // 이 부분을 추가합니다.
      }}
    />
  ));

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
        zIndex: 4,
        pointerEvents: "none", // 이 부분을 추가합니다.
      }}
    />
  ));

  const handleExitClick = () => {
    // "/"로 이동하는 코드
    navigate("/main");
  };

  return (
    <div className={styles.backgroundStyle}>
      <Header
        roomTitle={dummyRoomInfo.roomName}
        language={dummyRoomInfo.language}
        initialTime={dummyRoomInfo.timeLimit} // 예시로 120초 설정
        onExitClick={handleExitClick} // 수정된 부분
      />
      <VideoScreen />
      <div className={styles.container}>
        <div className={styles.problemArea}>
          <Problem
            problemTier={dummyRoomInfo.problemTier}
            problemNo={dummyRoomInfo.problemNo}
          />
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
      {showOctopus && <OctopusImage />}
      {inkSpotImages}
      {chickenImages}

      {/* 시간이 0이 되면 결과창을 렌더링 */}
      {showResults && (
        <div className={styles.gameResultsContainer}>
          <GameResults />
        </div>
      )}
    </div>
  );
}

export default Game;
