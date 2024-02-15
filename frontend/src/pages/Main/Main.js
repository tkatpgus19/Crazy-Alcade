import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// 이미지 import
import imgfile from "../../assets/images/logo.png";
import timeLimitImg from "../../assets/images/timeLimit.png";
import languageImg from "../../assets/images/language.png";
import background from "../../assets/images/mainback.png";

import octopusColorImg from "../../assets/images/octopus.png";
import chickColorImg from "../../assets/images/chick.png";
import waterBalloonColorImg from "../../assets/images/waterBalloon.png";
import magicColorImg from "../../assets/images/magic.png";
import shieldColorImg from "../../assets/images/shield.png";

import octopusGrayImg from "../../assets/images/octopusGrayImg.png";
import chickGrayImg from "../../assets/images/chickGrayImg.png";
import waterBalloonGrayImg from "../../assets/images/waterBalloonGrayImg.png";
import magicGrayImg from "../../assets/images/magicGrayImg.png";
import shieldGrayImg from "../../assets/images/shieldGrayImg.png";

import profile1 from "../../assets/images/profile1.png";
import profile2 from "../../assets/images/profile2.png";
import profile3 from "../../assets/images/profile3.png";
import profile4 from "../../assets/images/profile4.png";
import profile5 from "../../assets/images/profile5.png";
import profile6 from "../../assets/images/profile6.png";
import profile7 from "../../assets/images/profile7.png";
import profile8 from "../../assets/images/profile8.png";
import profile9 from "../../assets/images/profile9.png";
import profile10 from "../../assets/images/profile10.png";

import "./Main.module.css";
import styles from "./Main.module.css";

import CreateRoomModal from "./CreateRoomModal";
import ItemShopModal from "./ItemShopModal";
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import roomBackgroundMusicLobby from "../../assets/music/lobby.mp3";

const Main = () => {
  const client = useRef();
  const messagesEndRef = useRef(null); // messages 참조 생성
  const audioRef = useRef(new Audio(roomBackgroundMusicLobby));

  const getRoomList = (roomType) => {
    // 필터링 조건을 쿼리 파라미터로 변환
    // 선택된 필터링 조건이 없으면 쿼리 파라미터를 추가하지 않음
    let queryParams = `page=${page}`;
    if (language) queryParams += `&language=${language}`;
    if (hasReview) queryParams += `&has-review=${hasReview}`;
    if (tier) queryParams += `&tier=${tier}`; // tier 값이 있을 때만 쿼리에 추가

    axios.get(`${SERVER_URL}/rooms/${roomType}?${queryParams}`).then((res) => {
      setRoomList(res.data.result.roomList);
      setTotalPage(res.data.result.totalPage);
    });
    // 최대페이지로 최신화.
    //setTotalPage();
  };

  const allList = (roomType) => {
    let type;
    if (roomType) {
      type = "normal";
    } else {
      type = "item";
    }
    axios.get(`${SERVER_URL}/rooms/${type}?page=${page}`).then((res) => {
      setRoomList(res.data.result.roomList);
      setTotalPage(res.data.result.totalPage);
    });
    // 최대페이지로 최신화.
    //setTotalPage();
  };

  useEffect(() => {
    const audio = audioRef.current;
    // play()가 Promise를 반환하므로, catch 블록에서 오류를 처리합니다.
    audio.play().catch((error) => {
      console.log("재생을 시작하기 위해 사용자 상호작용이 필요합니다.", error);
      // 필요한 경우, 사용자에게 알리거나 버튼을 통해 재생을 유도할 수 있습니다.
    });

    const stopAudio = () => {
      audio.pause();
      audio.currentTime = 0;
    };

    connectSession;
    getRoomList("normal");

    // 컴포넌트 언마운트 시 오디오 정지
    return () => {
      stopAudio();
    };
  }, []);

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
    console.log(payload.body + "방 페이로들");
    setRoomList(JSON.parse(payload.body).roomList);
  }

  const chatContainerRef = useRef();

  function onChatReceived(payload) {
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

    const newMessage = {
      content: JSON.parse(payload.body).message,
      timestamp: formattedDate,
      isBold: true,
      sender: JSON.parse(payload.body).sender,
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
  const [totalPage, setTotalPage] = useState(1);
  const [profile, setProfile] = useState([]);
  const [levelId, setLevelId] = useState(0);
  const [exp, setExp] = useState(0);
  const [coin, setCoin] = useState(0);
  const [memberItems, setMemberItems] = useState([]);
  const [tier, setTier] = useState("");
  const [language, setLanguage] = useState("");
  const [hasReview, setHasReview] = useState("");

  const [itemImages, setItemImages] = useState({
    waterBalloon: waterBalloonGrayImg, // 기본값은 모두 회색 이미지로 설정
    octopus: octopusGrayImg,
    chick: chickGrayImg,
    magic: magicGrayImg,
    shield: shieldGrayImg,
  });

  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");

  const SERVER_URL = process.env.REACT_APP_BASE_URL;

  // 이미지를 객체에 매핑
  const profileImages = {
    "profile1.png": profile1,
    "profile2.png": profile2,
    "profile3.png": profile3,
    "profile4.png": profile4,
    "profile5.png": profile5,
    "profile6.png": profile6,
    "profile7.png": profile7,
    "profile8.png": profile8,
    "profile9.png": profile9,
    "profile10.png": profile10,
  };

  // 아이템 상태 초기화
  const [octopusImage, setOctopusImage] = useState(octopusGrayImg);
  const [chickImage, setChickImage] = useState(chickGrayImg);
  const [waterBalloonImage, setWaterBalloonImage] =
    useState(waterBalloonGrayImg);
  const [magicImage, setMagicImage] = useState(magicGrayImg);
  const [shieldImage, setShieldImage] = useState(shieldGrayImg);
  const [tempExp, setTempExp] = useState();
  const [expLimit, setExpLimit] = useState();

  const colorImageMap = {
    octopusColorImg: octopusColorImg,
    chickColorImg: chickColorImg,
    waterBalloonColorImg: waterBalloonColorImg,
    magicColorImg: magicColorImg,
    shieldColorImg: shieldColorImg,
  };

  const grayImageMap = {
    octopusColorImg: octopusGrayImg, // 여기서 colorImg.png를 grayImg로 매핑
    chickColorImg: chickGrayImg,
    waterBalloonColorImg: waterBalloonGrayImg,
    magicColorImg: magicGrayImg,
    shieldColorImg: shieldGrayImg,
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/members`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        const { nickname, profile, levelId, coin, memberItemList, tempExp, expLimit } =
          response.data.result;

        localStorage.setItem("nickname", nickname);

        // 프로필 사진들 중 DB에 담긴 사진으로 프로필 설정
        const profileImg = profileImages[profile];

        // API 응답을 바탕으로 각 아이템 상태 업데이트
        memberItemList.forEach((item) => {
          switch (item.itemId) {
            case 1: // 예를 들어 octopus의 itemId가 1이라 가정
              setOctopusImage(
                item.memberItemCount > 0 ? octopusColorImg : octopusGrayImg
              );
              break;
            case 2:
              setChickImage(
                item.memberItemCount > 0 ? chickColorImg : chickGrayImg
              );
              break;
            case 3:
              setWaterBalloonImage(
                item.memberItemCount > 0
                  ? waterBalloonColorImg
                  : waterBalloonGrayImg
              );
              break;
            case 4:
              setMagicImage(
                item.memberItemCount > 0 ? magicColorImg : magicGrayImg
              );
              break;
            case 5:
              setShieldImage(
                item.memberItemCount > 0 ? shieldColorImg : shieldGrayImg
              );
              break;
            // 추가 아이템에 대한 case 추가
          }
        });

        setNickname(nickname);
        setProfile(profileImg);
        setLevelId(levelId);
        setCoin(coin);
        setTempExp(tempExp);
        setExpLimit(expLimit);
        //setMemberItems(updatedMemberItems);
        connectSession();
        getRoomList("normal");
      })
      .catch((error) => {
        console.log("오류!", error);
      });
    getRoomList("normal");
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
    const token = localStorage.getItem("accessToken");
    axios
      .post(`${SERVER_URL}/rooms`, roomData)
      .then((res) => {
        console.log(res.data.result.roomId);
        // 방 생성에 성공했을때 바로 입장
        axios
          .post(
            `${SERVER_URL}/rooms/enter`,
            {
              nickname: nickname,
              roomId: res.data.result.roomId,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            if (response.data.result) {
              client.current.disconnect();
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
    setLanguage(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    // TODO: 해당 난이도 변경에 따른 로직 구현
    const tierMapping = { bronze: 1, silver: 2, gold: 3 };
    setTier(tierMapping[event.target.value]);
  };

  const handleCodeReviewChange = (event) => {
    // TODO: 코드 리뷰 변경에 따른 로직 구현
    const reviewValue = event.target.value === "o" ? "true" : "false";
    setHasReview(reviewValue);
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
    const token = localStorage.getItem("accessToken");
    if (data.hasPassword) {
      const password = prompt("비밀번호를 입력하세요");
      axios
        .get(
          `${SERVER_URL}/rooms/password?roomId=${data.roomId}&roomPwd=${password}`
        )
        .then((res) => {
          if (res.data.result) {
            axios
              .post(
                `${SERVER_URL}/rooms/enter`,
                {
                  nickname: nickname,
                  roomId: data.roomId,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((response) => {
                client.current.disconnect();
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
        .post(
          `${SERVER_URL}/rooms/enter`,
          {
            nickname: nickname,
            roomId: data.roomId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          client.current.disconnect();
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
    setPage(1); // 페이지를 1로 초기화
    connectSession();
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

  useEffect(() => {
    if (normalMode) getRoomList("normal");
    else {
      getRoomList("item");
    } // roomType은 상태 또는 props로부터 가져온 값이어야 합니다.
  }, [page, normalMode]); // page 또는 roomType이 변경될 때마다 실행

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(1, prevPage - 1)); // 페이지 번호는 최소 1
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(totalPage, prevPage + 1)); // 최대 페이지 번호 검증이 필요할 수 있음
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      // 스크롤을 컨테이너의 맨 아래로 이동시킵니다.
      const scrollHeight = messagesEndRef.current.scrollHeight;
      const height = messagesEndRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      messagesEndRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, [chatContent]); // chatContent가 변경될 때마다 이 로직을 실행합니다.

  useEffect(() => {
    if (normalMode) {
      getRoomList("normal");
    } else {
      getRoomList("item");
    }
  }, [tier, page, language, hasReview, normalMode]); // tier 또는 page 상태가 변경될 때마다 실행

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
              <img src={profile} alt="프로필" className={styles.profileImage} />
            )}

            {/* <input type="file" id="profile-pic" accept="image/*" /> */}
          </div>

          {/* 소개 칸 */}
          <div className={styles.introduction}>
            <div>
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
                <p style={{position:'absolute',fontSize:'10px', right: '5px', top:'-10px' }}>{tempExp +'/'+expLimit}</p>
                  <div
                    className={styles.expBar}
                    style={{ width: `${tempExp / expLimit * 100}%` }}
                  ></div>
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
            </div>
          </div>

          {/* 하단 흰색 네모 칸 5개 정렬 */}
          <div className={styles.whiteBoxes}>
            <img src={octopusImage} alt="octopus" className={styles.whiteBox} />
            <img src={chickImage} alt="chick" className={styles.whiteBox} />
            <img
              src={waterBalloonImage}
              alt="water balloon"
              className={styles.whiteBox}
            />
            <img src={magicImage} alt="magic" className={styles.whiteBox} />
            <img src={shieldImage} alt="shield" className={styles.whiteBox} />
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
                {normalMode ? (
                  <select
                    name="codeReview"
                    id="codeReview"
                    onChange={handleCodeReviewChange}
                  >
                    <option value="o">O</option>
                    <option value="x">X</option>
                  </select>
                ) : (
                  <select
                    name="codeReview"
                    id="codeReview"
                    onChange={handleCodeReviewChange}
                  >
                    <option value="x">X</option>
                  </select>
                )}
              </div>
              {/* 전체를 다시 보여주는 버튼 */}
              <div
                className={styles.optionButton}
                onClick={() => allList(normalMode)}
              >
                <label>전체보기</label>
              </div>

              {/* 미해결 문제 체크박스 */}
              {/* <div className={styles.optionButton}>
                <input type="checkbox" id="unresolved" />
                <label htmlFor="unresolved">미해결 문제</label>
              </div> */}
            </div>
            {/* 게임 대기 화면 방 */}
            <div className={styles.gameRoomList}>
              {/* 방 하나하나 */}
              {roomList &&
                roomList.map((data, index) => {
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
                          data.isStarted
                            ? styles.playingText
                            : styles.waitingText
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
                        {data.timeLimit}min
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
              <div className={styles.backPage} onClick={handlePrevPage}></div>
              <div className={styles.pageControl}>
                {page} / {totalPage}
              </div>
              <div className={styles.forthPage} onClick={handleNextPage}></div>
            </div>
          </div>

          {/* 채팅 부분 */}
          <div className={styles.chatPage}>
            <div className={styles.realChat}>
              <button className={styles.chatPageButton}>
                <p>전체</p>
              </button>
              <div className={styles.chatContent} ref={messagesEndRef}>
                {/* 채팅 내용 표시 */}
                {chatContent.map((message, index) => (
                  <div key={index} style={{ marginBottom: "5px" }}>
                    {/* 닉네임과 현재 날짜 및 시간 표시 */}
                    <p className={styles.messageInfo}>
                      <span className={styles.nickname}>{message.sender}</span>
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
