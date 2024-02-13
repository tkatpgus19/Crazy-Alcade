import React, { useEffect, useRef, useState } from "react";
import Background from "../../components/Background";
import RoomHeader from "./RoomHeader";
import RoomHeader2 from "./RoomHeader2";
import GrayBox from "../../components/graybox/GrayBox";
import styles from "./WaitingRoom.module.css";
import MiniBox from "./MiniBox";
import Status from "./Status";
import { useNavigate, useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import axios from "axios";

const Room = () => {
  const SERVER_URL = process.env.REACT_APP_BASE_URL;

  const messagesEndRef = useRef(null); // messages 참조 생성

  useEffect(() => {
    console.log("뭔데\n\n\n\n\n" + roomId + nickname + roomType);
    connectRoom();
    getUserList();

    // 추가한 부분
    getRoomInfo();
  }, []);

  // 추가한 부분
  const [roomInfo, setRoomInfo] = useState({});

  // 추가한 부분
  const getRoomInfo = () => {
    axios.get(`${SERVER_URL}/rooms/info?roomId=${roomId}`).then((res) => {
      console.log("제바라라라라라라\n\n\n\n\n" + res.data.result);
      setRoomInfo(res.data.result);
    });
  };

  const [userlist, setUserlist] = useState([]);
  const [readylist, setReadylist] = useState([]);
  const [userStatus, setUserStatus] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId, nickname, roomType } = location.state; // 세가지 받아옴.
  const [chatContent, setChatContent] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const client = useRef();

  const connectRoom = () => {
    const socket = new SockJS(`${SERVER_URL}/ws-stomp`);
    client.current = Stomp.over(socket);
    client.current.connect({}, onConnected, onError); // 현재상태를 변경할 때, {}는 헤더값 쓸때 쓴는 것, 성공하면 onConnected 실패시 onError
  };

  const leaveRoom = () => {
    client.current.disconnect();
    navigate(-1);
  };

  const onSignalReceived = (payload) => {
    enterGame(JSON.parse(payload.body));
  };

  const onConnected = () => {
    client.current.subscribe("/sub/chat/room/" + roomId, onChatReceived); // 이 url 이 붙은 것을 계속 구독하겠습니다. 고유한 url 만들기
    client.current.subscribe(
      "/sub/room/" + roomId + "/status",
      onStatusReceived
    ); // 이 url은 방의 상태, user 목록이나 준비상태를 본다.
    // client.current.send(
    //   "/pub/room/enterUser",
    //   {},
    //   JSON.stringify({
    //     type: "ENTER",
    //     roomId: roomId,
    //     sender: nickname,
    //     roomType: roomType,
    //   })
    // ); // 입장 이벤트 처리
    client.current.subscribe(
      "/sub/room/" + roomId + "/start",
      onSignalReceived
    );
  };

  const onError = (error) => {
    alert("error");
  };

  const onChatReceived = (payload) => {
    // 채팅이 왔을때 출현
    console.log("채팅이 왔습니다." + JSON.parse(payload.body).message);
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

    const newMessage = {
      content: JSON.parse(payload.body).message,
      sender: JSON.parse(payload.body).sender,
      timestamp: formattedDate,
      isBold: true,
    };

    setChatContent((chatContent) => [...chatContent, newMessage]);
  };

  const sendChat = () => {
    client.current.send(
      "/pub/chat/sendMessage",
      {},
      JSON.stringify({
        roomId: roomId,
        sender: nickname,
        message: chatInput,
        type: "TALK",
        roomType: roomType,
      })
    );
    setChatInput("");
  };

  const onStatusReceived = (payload) => {
    //ready 상태등 유저들의 상태를 받아와서 세팅해준다.
    setUserStatus(JSON.parse(payload.body));
    setUserlist(Object.keys(JSON.parse(payload.body))); // 객체에 있는 메서드를 사용해서
    setReadylist(Object.values(JSON.parse(payload.body))); // payload로 딕셔너리 (["username":"readyStatus"]) 이렇게 오는데, 위는 키값들만, 아래는 값들만 따로 분리해서 세팅
  };

  const getUserList = () => {
    axios
      .get(`${SERVER_URL}/rooms/userStatus?roomId=${roomId}`) // requset param 형태 api 요청할때 필요한 것
      .then((res) => {
        setUserStatus(res.data.result);
        setUserlist(Object.keys(res.data.result));
        setReadylist(Object.values(res.data.result));
        console.log("getUserList 호출됨 : " + res.data);
      })
      .catch((err) => console.log(err));
  };

  const getReady = () => {
    axios
      .put(`${SERVER_URL}/rooms/ready`, {
        roomId: roomId,
        nickname: nickname,
      })
      .then((res) => console.log(res));
  };

  const back = () => {
    leaveRoom();
    // navigate("../");
  };

  const onReadyClicked = () => {
    getReady();

    // navigate("../game");
  };
  const onStartClicked = () => {
    // 게임시작을 하기위해서 불러오는 API
    axios.put(`${SERVER_URL}/rooms/start?roomId=${roomId}`).then((res) => {
      if (res.data.result) {
        console.log("되는거니..?");
        axios.get(`${SERVER_URL}/rooms/set-timer?roomId=${roomId}`);
      } else {
        alert("준비가 되지 않았습니다.");
      }
    });
  };

  const enterGame = (data) => {
    // 게임방 입장을 위한 로직
    navigate("/game", {
      state: {
        roomId: data.roomId,
        nickname: nickname,
        userList: data.userList,
        roomType: data.roomType,
      },
    });
  };

  const onChage = (e) => {
    setChatInput(e.target.value);
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      sendChat();
    }
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

  return (
    <Background>
      <RoomHeader roomTitle={roomInfo.roomName} />
      <RoomHeader2 onExitClick={back} />
      <GrayBox>
        <div style={{ display: "flex", width: "100%", minWidth: "1200px" }}>
          <div className={styles.blue}>
            <div className={styles.miniBoxup}>
              {[0, 0, 0, 0, 0, 0].map((data, index) => {
                //6번 돌아주기 위해서 임의로 0 여섯개
                return (
                  <>
                    <div>
                      <MiniBox image="/images/user.png" />
                      <Status
                        nickname={userlist[index]}
                        status={readylist[index]}
                        currentUser={nickname}
                      />
                    </div>
                  </>
                );
              })}
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.chat}>
              <p className={styles.chattext}>채팅창</p>
              <div className={styles.realchat} ref={messagesEndRef}>
                {chatContent.map((message, index) => {
                  return (
                    <>
                      <div key={index} style={{ marginBottom: "10px" }}>
                        <span style={{ WebkitTextStroke: "0.8px black" }}>
                          {message.sender}
                        </span>
                        <span style={{ fontSize: "10px", color: "black" }}>
                          {" " + " "}
                          {message.timestamp}
                        </span>
                        <span style={{ display: "block" }}>
                          {message.content}
                        </span>
                      </div>
                    </>
                  );
                })}
              </div>
              <div className={styles.checkchat}>
                <input
                  className={styles.write}
                  placeholder="채팅을 입력하세요"
                  value={chatInput}
                  onChange={onChage}
                  onKeyDown={onKeyDown}
                />
                <div
                  className={styles.buttonWithImage}
                  onClick={sendChat}
                ></div>
              </div>
            </div>
            <div className={styles.button4}>
              <div
                className={
                  userStatus[nickname] === "MASTER"
                    ? styles.start + " " + styles.startbtn
                    : styles.ready + " " + styles.startbtn
                }
                onClick={
                  userStatus[nickname] === "MASTER"
                    ? onStartClicked
                    : onReadyClicked
                }
              >
                {userStatus[nickname] === "MASTER" ? "START" : "READY"}
              </div>
              <div className={styles.button3}>
                <div className={styles.rightbutton}>
                  <p>버튼1</p>
                </div>
                <div className={styles.rightbutton}>
                  <p>버튼2</p>
                </div>
                <div className={styles.rightbutton}>
                  <p>버튼3</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GrayBox>
    </Background>
  );
};

export default Room;
