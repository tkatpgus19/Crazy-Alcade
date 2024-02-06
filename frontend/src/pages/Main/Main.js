import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import imgfile from "../../assets/images/logo.png";
import background from "../../assets/images/mainback.png";
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
  const SERVER_URL =
    // "ec2-3-39-233-234.ap-northeast-2.compute.amazonaws.com:8080";
    "192.168.100.146:8080";
  useEffect(() => {
    getRoomList("normal");

    connectSession();
  }, []);

  const client = useRef();

  const getRoomList = (roomType) => {
    axios
      .get(`http://${SERVER_URL}/rooms/${roomType}?page=${page}`)
      .then((res) => {
        setRoomList(res.data);
      });
  };

  const connectSession = () => {
    const socket = new SockJS(`http://${SERVER_URL}/ws-stomp`);
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
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createRoomButtonPressed, setCreateRoomButtonPressed] = useState(false);
  const [isItemShopModalOpen, setIsItemShopModalOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatContent, setChatContent] = useState([]);
  const [normalMode, setNormalMode] = useState(true);
  const [roomList, setRoomList] = useState([]);
  const [page, setPage] = useState(1);

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
    axios
      .post(`http://${SERVER_URL}/rooms`, roomData)
      .then((res) => {
        navigate("/room", {
          state: {
            roomId: res.data,
            nickname: "닉네임1",
            roomType: roomData.roomType,
          },
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
          sender: "닉네임1",
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
    navigate("/room", {
      state: {
        roomId: data.roomId,
        nickname: "닉네임1",
        roomType: data.roomType,
      },
    });
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

  const backgroundStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "740px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "space-between",
  };

  const logoStyle = {
    // 로고에 대한 추가 스타일을 여기에 추가
  };

  const handleLogout = () => {
    // 로그아웃 관련 로직 수행 (필요하다면)
    // 홈 페이지로 이동
    navigate("/");
  };

  return (
    <div className={styles.mainContainer} style={backgroundStyle}>
      {/* 왼쪽 부분 (my-page) */}
      <div className={styles.logo} style={logoStyle}>
        <img className={styles.logoImg} src={imgfile} alt="로고" />
      </div>

      {/* my-page 영역 */}
      <div className={styles.myPage}>
        {/* 이름 입력 칸 */}
        <div className={styles.nameInput}>
          <label htmlFor="name"></label>
          <input type="text" id="name" />
        </div>
        <br />

        {/* 프로필 사진 입력 칸 */}
        <div className={styles.profilePicture}>
          <label htmlFor="profile-pic">프로필 사진</label>
          <input type="file" id={styles.profilePic} accept="image/*" />
        </div>

        {/* 소개 칸 */}
        <div className={styles.introduction}>
          <p>
            <div>Lv. </div>
            <div>경험치 </div>
            <div>코인</div>
          </p>
        </div>

        {/* 하단 흰색 네모 칸 4개 정렬 */}
        <div className={styles.whiteBoxes}>
          <div className={styles.whiteBox}></div>
          <div className={styles.whiteBox}></div>
          <div className={styles.whiteBox}></div>
          <div className={styles.whiteBox}></div>
        </div>

        <br />
        <br />

        {/* 마이페이지 파란색 네모 칸 */}
        <div className={styles.myPageBlueBox}>
          <p>마이페이지</p>
        </div>
      </div>

      {/* 오른쪽 부분 (right-side) */}
      <div className={styles.rightSide}>
        {/* 오른쪽 상단 버튼들 */}
        <div className={styles.rightTop}>
          <button className={styles.introButton}>게임 소개</button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            로그아웃
          </button>
        </div>
        <br />
        <br />

        {/* ItemShop, CreateRoom 버튼 그룹 */}
        <div className={styles.rightMiddle}>
          {/* 아이템상점 버튼 */}
          <button className={styles.itemShopButton} onClick={openItemShopModal}>
            아이템상점
          </button>
          {/* 방 만들기 버튼 */}
          <button
            className={`${styles.createRoomButton} ${createRoomButtonPressed ? styles.createRoomButtonPressed : ""}`}
            onClick={openModal}
          >
            방만들기
          </button>

          {/* ItemShopModal */}
          {isItemShopModalOpen && (
            <div className={styles.overlay}>
              <ItemShopModal closeModal={closeItemShopModal} />
            </div>
          )}

          {/* 모달이 열린 상태라면 CreateRoomModal을 렌더링합니다 */}
          {isModalOpen && (
            <div className={styles.overlay}>
              <CreateRoomModal
                closeModal={closeModal}
                createRoom={createRoom}
              />
            </div>
          )}
        </div>

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
                  <div className={styles.playingText}> playing </div>
                  <div className={styles.roomDescription}>
                    백준 : {data.problemNo}
                  </div>
                  <div className={styles.roomDescription}>
                    시간 : {data.timeLimit}
                  </div>
                  <div className={styles.roomDescription}>
                    언어 : {data.language}{" "}
                    <span>
                      <FontAwesomeIcon
                        icon={data.hasPassword ? faKey : null}
                        rotation={data.hasPassword ? 220 : 0}
                        style={
                          data.hasPassword
                            ? { color: "#FFD43B", marginLeft: "5px" }
                            : null
                        }
                        className={styles.keyIcon}
                      />
                      <img
                        src={
                          data.codeReview
                            ? "../images/speak.png"
                            : "../images/unspeak.png"
                        }
                        alt="speak"
                        className={styles.speakIcon}
                      />
                      {data.userCnt}/{data.maxUserCnt}
                    </span>
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
          <button className={styles.chatPageButton}>전체</button>
          <div className={styles.chatContent} ref={chatContainerRef}>
            {/* 채팅 내용 표시 */}
            {chatContent.map((message, index) => (
              <div key={index}>
                {/* 닉네임과 현재 날짜 및 시간 표시 */}
                <p className={styles.messageInfo}>
                  <span className={styles.nickname}>닉네임 </span>
                  <span className={styles.timestamp}>{message.timestamp}</span>
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
  );
};

// Main 컴포넌트를 내보냅니다.
export default Main;
