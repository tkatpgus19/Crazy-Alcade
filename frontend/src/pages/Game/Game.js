import React, { useEffect, useRef, useState } from "react";

import Header from "./Header"; // Header 컴포넌트의 경로에 맞게 수정하세요.
import VideoScreen from "./VideoScreen";
import Problem from "./Problem";
import styles from "./Game.module.css";
import Footer from "./Footer";
import WebIDE from "./WebIDE";
import axios from "axios";

import GameResults from "./components/GameResults"; // Adjust the path according to your file structure
import { Resizable } from "re-resizable";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import octopusImage from "../../assets/images/octopus.png"; // 문어 이미지의 경로
import inkImage from "../../assets/images/muk.png"; // 먹물 이미지의 경로
import chickenImage from "../../assets/images/chick.png"; // 병아리 이미지 경로

function Game() {
  const navigate = useNavigate();
  let location = useLocation();
  const client = useRef();

  // 아이템 동작 확인
  const isSprayingInk = useSelector((state) => state.octopus.isSprayingInk);
  const isChickenWalking = useSelector((state) => state.feature.chickenWalking); // 병아리 걸음 상태
  const isShieldActive = useSelector(
    (state) => state.animationControl.isShieldActive
  );
  const timeCompleted = useSelector((state) => state.timer.timeCompleted);

  // 대기 방에서 넘어 온 정보들.
  const roomId = location.state ? location.state.roomId : "roomId";
  const nickname = location.state ? location.state.nickname : "123";
  const userList = location.state ? location.state.userList : ["123", "456"];
  const roomType = location.state ? location.state.roomType : "item";

  const [showOctopus, setOctopus] = useState(false);
  const [chickens, setChickens] = useState([]); // 병아리 이미지 상태
  const [inkSpots, setInkSpots] = useState([]); // 먹물 이미지 상태

  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [showResult, setShowResult] = useState(false);

  const [roomInfo, setRoomInfo] = useState({
    roomId: "roomId",
    roomType: "normal", // 기본값 설정
    roomName: "Loading...", // 로딩 중임을 알리는 기본값
    language: "language",
    // 필요한 기타 초기값들
  });
  const [userInfo, setUserInfo] = useState({
    nickname: "",
    profile: "",
    levelId: 0,
    exp: 0,
    coin: 0,
    memberItemList: [],
  });

  // 더미 방 데이터.
  // const roomInfo = {
  //   roomId: "e50ec323-60ce-4fde-9837-2a393a59897d",
  //   roomType: "item",
  //   roomName: "더미방1",
  //   hasPassword: false,
  //   roomPassword: "",
  //   problemTier: "골드1",
  //   problemNo: 1,
  //   timeLimit: 60,
  //   language: "JAVA",
  //   codeReview: false,
  //   maxUserCnt: 6,
  //   master: "123",
  //   userList: {},
  //   readyList: {},
  //   started: false,
  //   userCnt: 0,
  // };

  useEffect(() => {
    // roomId 값이 없거나 nickname이 없으면 에러 페이지로 리디렉션
    if (!roomId || !nickname || !roomName) {
      navigate("/error");
    }
  }, [roomId, nickname, navigate]); // 의존성 배열에 roomId와 nickname 추가

  useEffect(() => {
    // 비정상인 접근 차단. 개발 후 살리기.
    if (!(roomInfo.roomId && nickname)) navigate("/error");

    // roomId를 이용해 API로 세부 방 정보 가져오기.
    const fetchRoomInfo = async () => {
      setIsLoading(true); // 데이터 로딩 시작

      try {
        const apiUrl = `${process.env.REACT_APP_BASE_URL}/rooms/info?roomId=${roomId}`;
        const response = await axios.get(apiUrl);

        if (response.data.code === 200) {
          console.log("방 정보 조회에 성공하였습니다.", response.data);
          setRoomInfo(response.data.result); // 전체 방 정보 저장
        } else {
          console.error("방 정보 조회 실패:", response.data.message);
        }
      } catch (error) {
        console.error("방 정보 조회 중 에러 발생:", error);
        // 에러 처리 로직 (예: 사용자를 에러 페이지로 리다이렉트)
      } finally {
        setIsLoading(false); // 데이터 로딩 완료
      }
    };

    // token 이용해 API로 유저 개인 정보 가져오기
    const fetchUserInfo = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_BASE_URL}/members`;
        const token = localStorage.getItem("accessToken");

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`, // Bearer 토큰 방식을 사용하는 경우
            // Origin 헤더는 브라우저가 자동으로 설정하기 때문에 여기서 설정할 필요가 없습니다.
          },
        });
        if (response.data.code === 200) {
          setUserInfo(response.data.result); // 회원 정보 상태 업데이트
          console.log(userInfo);
        } else {
          console.error("회원 정보 조회 실패:", response.data.message);
        }
      } catch (error) {
        console.error("API 요청 중 에러 발생:", error);
      }
    };

    console.log(roomId + "현재룸아이디디디디디");
    if (roomInfo.roomId === "roomId") {
      fetchRoomInfo();
      fetchUserInfo();
    }
  }, [roomInfo, userInfo]);

  // 게임 모드에 따른 배경 화면 설정
  const backgroundStyle =
    roomType === "item"
      ? styles.itemBackgroundStyle
      : styles.normalBackgroundStyle;

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
      const newInkSpots = Array(20)
        .fill(null)
        .map((_, index) => ({
          id: index,
          left: `${Math.random() * 51 + 35}%`, // 초기 위치 계산
          top: `${Math.random() * 51 + 15}%`, // 초기 위치 계산
          width: `${Math.random() * 4 + 10}%`, // 초기 크기 계산
        }));
      setInkSpots(newInkSpots);
      setTimeout(() => {
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
      const initialChickens = Array(20)
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
            newLeft = Math.max(10, Math.min(newLeft, window.innerWidth - 80)); // 병아리 이미지의 너비 고려
            newTop = Math.max(50, Math.min(newTop, window.innerHeight - 150)); // 병아리 이미지의 높이 고려

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

  useEffect(() => {
    // 새로고침을 방지하는 함수
    const handleRefresh = (e) => {
      if (
        e.key === "F5" ||
        ((e.ctrlKey || e.metaKey) && (e.key === "r" || e.key === "R"))
      ) {
        e.preventDefault();
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener("keydown", handleRefresh);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      document.removeEventListener("keydown", handleRefresh);
    };
  }, []);

  const handleExitClick = () => {
    // "/main"으로 이동하는 코드
    navigate("/main");
  };

  if (isLoading) {
    return <div>Loading room information...</div>; // 로딩 중 사용자에게 표시할 컴포넌트
  }

  return (
    <div className={backgroundStyle}>
      <Header
        roomTitle={roomInfo.roomName}
        language={roomInfo.language}
        roomType={roomInfo.roomType}
        roomId={roomInfo.roomId}
        onExitClick={handleExitClick} // 수정된 부분
      />
      <VideoScreen
        roomId={roomInfo.roomId}
        nickname={nickname}
        roomType={roomInfo.roomType}
        userList={roomInfo.userList}
      />
      <div className={styles.container}>
        <div className={styles.problemArea}>
          <Problem
            problemTier={roomInfo.problemTier}
            problemId={roomInfo.problemId}
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
              backgroundColor: "#c3c8d0",

              marginTop: "10px",
              borderRadius: "30px",
            },
          }}
        >
          <div className={styles.webIDE}>
            <WebIDE language={roomInfo.language} />
          </div>
        </Resizable>
      </div>
      <Footer roomInfo={roomInfo} userInfo={userInfo} />
      {showOctopus && <OctopusImage />}
      {inkSpotImages}
      {chickenImages}

      {/* 시간이 0이 되면 결과창을 렌더링 */}
      {timeCompleted && (
        <div className={styles.gameResultsContainer}>
          <GameResults
            roomType={roomInfo.roomType}
            roomId={roomInfo.roomId}
            userInfo={userInfo}
          />
        </div>
      )}
    </div>
  );
}

export default Game;
