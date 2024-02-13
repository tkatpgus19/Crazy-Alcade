import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// 이미지 import
import imgfile from "../../assets/images/logo.png";
import timeLimitImg from "../../assets/images/timeLimit.png";
import languageImg from "../../assets/images/language.png";
import background from "../../assets/images/mainback.png";

import waterBalloonImg from "../../assets/images/waterBalloon.png";
import octopusImg from "../../assets/images/octopus.png";
import chickImg from "../../assets/images/chick.png";
import magicImg from "../../assets/images/magic.png";
import shieldImg from "../../assets/images/shield.png";

import waterBalloonGrayImg from "../../assets/images/waterBalloonGrayImg.png";
import octopusGrayImg from "../../assets/images/octopusGrayImg.png";
import chickGrayImg from "../../assets/images/chickGrayImg.png";
import magicGrayImg from "../../assets/images/magicGrayImg.png";
import shieldGrayImg from "../../assets/images/shieldGrayImg.png";

import "./Main.module.css";
import styles from "./Main.module.css";

import CreateRoomModal from "./CreateRoomModal";
import ItemShopModal from "./ItemShopModal";
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";

const Main = () => {
  const client = useRef();
  const getRoomList = (roomType) => {
    axios.get(`${SERVER_URL}/rooms/${roomType}?page=${page}`).then((res) => {
      setRoomList(res.data.result);
    });
  };

  const connectSession = () => {
    const socket = new SockJS(process.env.REACT_APP_SOCKET_URL);
    client.current = Stomp.over(socket);
    client.current.connect({}, onConnected, onError);
  };

  function onConnected() {
    if (m) {
      client.current.subscribe(`/sub/normal/room-list`, onRoomInforReceived);
    } else {
      client.current.subscribe(`/sub/item/room-list`, onRoomInforReceived);
    }

    client.current.subscribe(`/sub/chat/all`, onChatReceived);
  }

  function onError(error) {
    alert("error");
  }

  function onRoomInforReceived(payload) {
    setRoomList(JSON.parse(payload.body));
  }

  const chatContainerRef = useRef();

  function onChatReceived(payload) {
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

    const newMessage = {
      content: JSON.parse(payload.body).message,
      timestamp: formattedDate,
      isBold: true,
    };

    setChatContent((chatContent) => [...chatContent, newMessage]);
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createRoomButtonPressed, setCreateRoomButtonPressed] = useState(false);
  const [isItemShopModalOpen, setIsItemShopModalOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatContent, setChatContent] = useState([]);
  const [normalMode, setNormalMode] = useState(true);
  const [roomList, setRoomList] = useState([]);
  const [page, setPage] = useState(1);
  const [profile, setProfile] = useState([]);
  const [levelId, setLevelId] = useState(0);
  const [exp, setExp] = useState(0);
  const [coin, setCoin] = useState(0);
  const [memberItemList, setMemberItemList] = useState([]);
  const [inventory, setInventory] = useState([]);

  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");

  const SERVER_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    axios
      .get(`https://i10d104.p.ssafy.io/api/members`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        const { nickname, levelId, exp, coin, memberItemList } =
          response.data.result;

        // nickname을 기반으로 1부터 10 사이의 숫자를 생성하는 해시 함수
        const hash = (str) => {
          let hash = 0;
          for (let i = 0; i < str.length; i++) {
            const character = str.charCodeAt(i);
            hash = (hash << 5) - hash + character;
            hash = hash & hash; // Convert to 32bit integer
          }
          return Math.abs(hash % 10) + 1; // 1부터 10 사이의 숫자 반환
        };

        const profileNumber = hash(nickname); // 닉네임을 기반으로 숫자 생성
        const profilePicture = `profile${profileNumber}.png`; // 파일 이름 구성

        setNickname(nickname);
        setProfile(`/images/${profilePicture}`);
        setLevelId(levelId);
        setExp(exp);
        setCoin(coin);
        setMemberItemList(memberItemList);
        connectSession();
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openItemShopModal = () => {
    setIsItemShopModalOpen(true);
  };

  const closeItemShopModal = () => {
    setIsItemShopModalOpen(false);
  };

  const createRoom = (roomData) => {
    console.log("방이 생성되었습니다:", roomData);
    roomData.master = nickname;
    axios
      .post(`${SERVER_URL}/rooms`, roomData)
      .then((res) => {
        console.log(res.data.result.roomId);
        // 방 생성에 성공했을때 바로 입장
        axios
          .post(`${SERVER_URL}/rooms/enter`, {
            nickname: nickname,
            roomId: res.data.result.roomId,
          })
          .then((response) => {
            if (response.data.result) {
              navigate("/room", {
                state: {
                  roomId: res.data.result.roomId,
                  nickname: nickname,
                  roomType: roomData.roomType,
                },
              });
            } else {
              alert("방에 인원이 가득 찼습니다.");
            }
          });
      })
      .catch((err) => {
        alert("실패");
      });
    // setCreateRoomButtonPressed(true);/
  };

  const handleLanguageChange = (event) => {
    // TODO: 해당 언어 변경에 따른 로직 구현
  };

  const handleDifficultyChange = (event) => {
    // TODO: 해당 난이도 변경에 따른 로직 구현
  };

  const handleCodeReviewChange = (event) => {
    // TODO: 코드 리뷰 변경에 따른 로직 구현
  };

  const handleChatInputChange = (event) => {
    setChatInput(event.target.value);
  };

  const handleSendMessage = () => {
    if (chatInput.trim() !== "") {
      client.current.send(
        "/pub/chat/all/sendMessage",
        {},
        JSON.stringify({
          roomId: "all",
          sender: nickname,
          message: chatInput,
          type: "TALK",
          roomType: normalMode,
        })
      );
      setChatInput("");
    }
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSendMessage();
    }
  };

  const enterRoom = (data) => {
    if (data.hasPassword) {
      const password = prompt("비밀번호를 입력하세요");
      axios
        .get(
          `${SERVER_URL}/rooms/password?roomId=${data.roomId}&roomPwd=${password}`
        )
        .then((res) => {
          if (res.data.result) {
            axios
              .post(`${SERVER_URL}/rooms/enter`, {
                nickname: nickname,
                roomId: data.roomId,
              })
              .then((response) => {
                navigate("/room", {
                  state: {
                    roomId: data.roomId,
                    nickname: nickname,
                    roomType: data.roomType,
                  },
                });
              })
              .catch((err) => {
                alert(err.response.data.message);
              });
          } else {
            alert("비밀번호가 달라요");
          }
        });
    } else {
      axios
        .post(`${SERVER_URL}/rooms/enter`, {
          nickname: nickname,
          roomId: data.roomId,
        })
        .then((response) => {
          navigate("/room", {
            state: {
              roomId: data.roomId,
              nickname: nickname,
              roomType: data.roomType,
            },
          });
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    }
  };

  let m = true;
  const toggleNormalMode = (mode) => {
    client.current.disconnect();
    setNormalMode(mode);
    m = mode;
    if (mode) {
      getRoomList("normal");
    } else {
      getRoomList("item");
    }
    connectSession();
  };

  // 인벤토리 데이터를 가져오는 useEffect 훅
  useEffect(() => {
    axios
      .get(`https://i10d104.p.ssafy.io/api/members/inventory`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        const inventoryData = response.data.result;
        setInventory(inventoryData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); // 종속성 배열이 비어있기 때문에 컴포넌트 마운트 시에만 실행됩니다.

  // 아이템의 수량에 따라 이미지를 설정하는 함수
  const getItemImage = (itemName, count) => {
    const colorImages = {
      waterBalloon: waterBalloonColorImg,
      octopus: octopusColorImg,
      chick: chickColorImg,
      magic: magicColorImg,
      shield: shieldColorImg,
    };
    const grayImages = {
      waterBalloon: waterBalloonGrayImg,
      octopus: octopusGrayImg,
      chick: chickGrayImg,
      magic: magicGrayImg,
      shield: shieldGrayImg,
    };

    return count > 0 ? colorImages[itemName] : grayImages[itemName];
  };

  const backgroundStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "100vh",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "space-between",
  };

  const handleLogout = () => {
    // 로컬 스토리지에서 사용자 관련 정보 제거
    localStorage.removeItem("accessToken");
    localStorage.removeItem("nickname");
    localStorage.removeItem("isNew");
    localStorage.removeItem("isConnected");
    localStorage.removeItem("memberId");

    // 로그아웃 후 사용자를 홈 페이지로 리디렉션
    navigate("/");
  };

  return (
    <div className={styles.mainContainer} style={backgroundStyle}>
      {/* 왼쪽 부분 (my-page) */}
      <div className={styles.logo}>
        <img src={imgfile} alt="로고" />
      </div>

      {/* 오른쪽 상단 버튼들 */}
      <div className={styles.rightTop}>
        <button
          className={styles.introButton}
          onClick={() => navigate("/game-introduction")}
        >
          게임 소개
        </button>
        <button className={styles.logoutButton} onClick={handleLogout}>
          로그아웃
        </button>
      </div>

      {/* ItemShop, CreateRoom 버튼 그룹 */}
      <div className={styles.rightMiddle}>
        {/* 아이템상점 버튼 */}
        <button className={styles.itemShopButton} onClick={openItemShopModal}>
          아이템 상점
        </button>

        {/* ItemShopModal */}
        {isItemShopModalOpen && (
          <div className={styles.overlay}>
            <ItemShopModal closeModal={closeItemShopModal} coins={150} />
          </div>
        )}

        {/* 방 만들기 버튼 */}
        <button
          className={`${styles.createRoomButton} ${createRoomButtonPressed ? styles.createRoomButtonPressed : ""}`}
          onClick={openModal}
        >
          방 만들기
        </button>

        {/* 모달이 열린 상태라면 CreateRoomModal을 렌더링합니다 */}
        {isModalOpen && (
          <div className={styles.overlay}>
            <CreateRoomModal closeModal={closeModal} createRoom={createRoom} />
          </div>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          display: "flex",
          top: "18%",
          left: "50%",
          transform: "translate(-50%, 0%)",
          overflow: "hidden",
        }}
      >
        {/* my-page 영역 */}
        <div className={styles.myPage}>
          {/* 이름 입력 칸 */}
          <div className={styles.nameInput}>{nickname}</div>
          <br />

          {/* 프로필 사진 입력 칸 */}
          <div className={styles.profilePicture}>
            {/* profile 상태가 이미지 URL을 담고 있다고 가정하고 img 태그로 이미지를 표시합니다. */}
            {profile && (
              <img
                src={profile}
                alt="프로필 사진"
                style={{ width: "100px", height: "100px" }}
              />
            )}
            {/* <input type="file" id="profile-pic" accept="image/*" /> */}
          </div>

          {/* 소개 칸 */}
          <div className={styles.introduction}>
            <p>
              <div>Lv. {levelId}</div>
              {/* 경험치 진행 상태 표시줄 */}
              <div style={{ display: "flex" }}>
                <p
                  style={{
                    margin: "0",
                    width: "100px",
                  }}
                >
                  경험치
                </p>
                <div className={styles.expBarContainer}>
                  <div
                    className={styles.expBar}
                    style={{ width: `${exp}%` }}
                  ></div>
                  <div className={styles.expText}>exp</div>
                </div>
              </div>
              {/* 코인 부분 */}
              <div className={styles.coinContainer}>
                <div>코인 {coin}</div>
                <img
                  src="/images/coinImage.png"
                  alt="코인"
                  className={styles.coinImage}
                />
              </div>
            </p>
          </div>

          {/* 하단 흰색 네모 칸 5개 정렬 */}
          <div className={styles.whiteBoxes}>
            <div className={styles.whiteBox}></div>
            <div className={styles.whiteBox}></div>
            <div className={styles.whiteBox}></div>
            <div className={styles.whiteBox}></div>
            <div className={styles.whiteBox}></div>
          </div>

          {/* 마이페이지 파란색 네모 칸 */}
          <div className={styles.myPageBlueBox}>
            <p>마이페이지</p>
          </div>
        </div>

        {/* 오른쪽 부분 (right-side) */}
        <div className={styles.rightSide}>
          {/* 방 목록 부분 */}
          <div className={styles.roomPage}>
            {/* 노말, 아이템전 + 옵션 선택하는 드롭다운 박스 */}
            <div className={styles.optionButtons}>
              {/* 토글 방식으로 노말전, 아이템전 버튼 */}
              <button
                className={`${styles.normalButton} ${normalMode ? styles.active : ""}`}
                onClick={() => toggleNormalMode(true)}
              >
                노말전
              </button>
              <button
                className={`${styles.itemButton} ${!normalMode ? styles.active : ""}`}
                onClick={() => toggleNormalMode(false)}
              >
                아이템전
              </button>

              {/* 사용 언어 드롭다운 */}
              <div className={styles.optionButton}>
                <label htmlFor="language">사용 언어</label>
                <select
                  name="language"
                  id="language"
                  onChange={handleLanguageChange}
                >
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                </select>
              </div>

              {/* 난이도 드롭다운 */}
              <div className={styles.optionButton}>
                <label htmlFor="difficulty">난이도</label>
                <select
                  name="difficulty"
                  id="difficulty"
                  onChange={handleDifficultyChange}
                >
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                </select>
              </div>

              {/* 코드 리뷰 드롭다운 */}
              <div className={styles.optionButton}>
                <label htmlFor="codeReview">코드 리뷰</label>
                <select
                  name="codeReview"
                  id="codeReview"
                  onChange={handleCodeReviewChange}
                >
                  <option value="o">O</option>
                  <option value="x">X</option>
                </select>
              </div>

              {/* 미해결 문제 체크박스 */}
              <div className={styles.optionButton}>
                <input type="checkbox" id="unresolved" />
                <label htmlFor="unresolved">미해결 문제</label>
              </div>
            </div>
            {/* 게임 대기 화면 방 */}
            <div className={styles.gameRoomList}>
              {/* 방 하나하나 */}
              {roomList.map((data, index) => {
                return (
                  <div
                    key={index}
                    className={styles.room}
                    onClick={() => enterRoom(data)}
                  >
                    {/* 방 안의 제목 */}
                    <div className={styles.roomBlueBox}>
                      <p>{data.roomName}</p>
                    </div>
                    <div
                      className={
                        data.isStarted ? styles.playingText : styles.waitingText
                      }
                    >
                      <h1>{data.isStarted ? "Playing" : "Waiting"}</h1>
                    </div>
                    <div
                      className={styles.roomDescription}
                      style={{
                        fontSize: "15px",
                        WebkitTextStroke: "0.5px white",
                      }}
                    >
                      {data.problemName}
                    </div>
                    <div
                      className={
                        styles.roomDescription +
                        " " +
                        styles.roomDescriptionTime
                      }
                      style={{ marginTop: "10px" }}
                    >
                      <img
                        src={timeLimitImg}
                        style={{
                          width: "15px",
                          height: "15px",
                          margin: "0 5px 5px 0",
                        }}
                      />
                      {data.timeLimit}초
                    </div>
                    <div
                      className={
                        styles.roomDescription +
                        " " +
                        styles.roomDescriptionTime
                      }
                    >
                      <img
                        src={languageImg}
                        style={{
                          width: "14px",
                          height: "14px",
                          margin: "0 7px 0 2px",
                        }}
                      />{" "}
                      {data.language}
                      <div
                        style={{
                          position: "absolute",
                          display: "flex",
                          right: "10px",
                          bottom: "10px",
                        }}
                      >
                        {data.hasPassword && (
                          <FontAwesomeIcon
                            icon={faKey}
                            style={{ color: "#FFD43B", marginTop: "5px" }}
                            className={styles.keyIcon}
                          />
                        )}

                        <img
                          src={
                            data.codeReview
                              ? "../images/speak.png"
                              : "../images/unspeak.png"
                          }
                          alt="speak"
                          className={styles.speakIcon}
                        />
                        <div
                          style={{
                            background: "#0584df",
                            fontSize: "14px",
                            color: "white",
                            borderRadius: "5px",
                            padding: "4px",
                            WebkitTextStroke: "0.5px black",
                            fontWeight: "bold",
                          }}
                        >
                          {data.userCnt}/{data.maxUserCnt}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.backandforthPage}>
              <div
                className={styles.backPage}
                // onClick={this.handleBackPage}
              ></div>
              <div
                className={styles.forthPage}
                // onClick={this.handleForthPage}
              ></div>
            </div>
          </div>

          {/* 채팅 부분 */}
          <div className={styles.chatPage}>
            <div className={styles.realChat}>
              <button className={styles.chatPageButton}>
                <p>전체</p>
              </button>
              <div className={styles.chatContent} ref={chatContainerRef}>
                {/* 채팅 내용 표시 */}
                {chatContent.map((message, index) => (
                  <div key={index} style={{ marginBottom: "5px" }}>
                    {/* 닉네임과 현재 날짜 및 시간 표시 */}
                    <p className={styles.messageInfo}>
                      <span className={styles.nickname}>{nickname}</span>
                      <span className={styles.timestamp}>
                        {message.timestamp}
                      </span>
                    </p>
                    {/* 메시지 내용 표시 (글씨 두껍게 여부에 따라 스타일 조정) */}
                    <div
                      className={`${styles.messageContent} ${message.isBold ? styles.bold : ""}`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
              {/* 수정된 스타일을 적용한 부분 */}
            </div>
            <div className={styles.chatInputContainer}>
              <input
                className={styles.chatInput}
                type="text"
                placeholder="채팅을 입력하세요"
                value={chatInput}
                onChange={handleChatInputChange}
                onKeyDown={onKeyDown}
              />
              <button className={styles.sendButton} onClick={handleSendMessage}>
                전송
              </button>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main 컴포넌트를 내보냅니다.
export default Main;
