// VideoScreen.js

import React from "react";
import styles from "./VideoScreen.module.css";
import { useState, useEffect } from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UserVideoComponent from "./UserVideoComponent";

// OpenVidu 서버의 URL을 환경에 따라 설정
const APPLICATION_SERVER_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:5000/";

const VideoScreen = () => {
  const [mySessionId, setMySessionId] = useState("D104");
  const [myUserName, setMyUserName] = useState("pangdoon");
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    // 페이지가 언마운트되기 전에 이벤트 리스너 추가 및 정리
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  // 페이지가 언마운트되기 전에 호출되는 함수
  const onBeforeUnload = () => {
    leaveSession();
  };

  // 세션 ID 변경 핸들러
  const handleChangeSessionId = (e) => {
    setMySessionId(e.target.value);
  };

  // 사용자 이름 변경 핸들러
  const handleChangeUserName = (e) => {
    setMyUserName(e.target.value);
  };

  // 메인 비디오 스트림 설정 핸들러
  const handleMainVideoStream = (stream) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
  };

  // 구독 비디오 스트림 삭제 핸들러
  const deleteSubscriber = (streamManager) => {
    setSubscribers((prevSubscribers) =>
      prevSubscribers.filter((sub) => sub !== streamManager)
    );
  };

  // 페이지 입장 시, 화상 회의 즉시 입장된다.
  useEffect(() => {
    joinSession();
  }, []);

  // OpenVidu 세션에 참가하는 함수
  const joinSession = async () => {
    const OV = new OpenVidu();

    const newSession = OV.initSession();

    // 스트림 생성 이벤트 핸들러
    newSession.on("streamCreated", (event) => {
      const subscriber = newSession.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    // 스트림 소멸 이벤트 핸들러
    newSession.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    // 예외 처리 이벤트 핸들러
    newSession.on("exception", (exception) => {
      console.warn(exception);
    });

    setSession(newSession);

    try {
      const token = await getToken();
      await newSession.connect(token, { clientData: myUserName });

      const publisher = await OV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: "126x70", // 원하는 해상도로 설정
        frameRate: 30, // 초당 비디오 프레임 수
        insertMode: "APPEND",
        mirror: true, // 거울 기능 켜주기
      });

      newSession.publish(publisher);

      const devices = await OV.getDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      const currentVideoDeviceId = publisher.stream
        .getMediaStream()
        .getVideoTracks()[0]
        .getSettings().deviceId;
      const currentVideoDevice = videoDevices.find(
        (device) => device.deviceId === currentVideoDeviceId
      );

      setMainStreamManager(publisher);
      setPublisher(publisher);
    } catch (error) {
      console.log(
        "There was an error connecting to the session:",
        error.code,
        error.message
      );
    }
  };

  // 세션 떠나기 함수
  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }

    // 상태 초기화
    setSession(undefined);
    setSubscribers([]);
    setMySessionId("SessionA");
    setMyUserName("Participant" + Math.floor(Math.random() * 100));
    setMainStreamManager(undefined);
    setPublisher(undefined);
  };

  // 토큰 가져오기 함수
  const getToken = async () => {
    const sessionId = await createSession(mySessionId);
    return await createToken(sessionId);
  };

  // 세션 생성 함수
  const createSession = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/sessions",
      { customSessionId: sessionId },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data; // The sessionId
  };

  // 토큰 생성 함수
  const createToken = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + `api/sessions/${sessionId}/connections`,
      {},
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data; // The token
  };

  // 카메라 끄고 키는 버튼
  const toggleCamera = () => {
    if (publisher) {
      const videoTracks = publisher.stream.getMediaStream().getVideoTracks(); // 이 것들을 통해 비디오 트랙 목록을 얻습니다.
      videoTracks.forEach((track) => (track.enabled = !track.enabled)); // forEach 를 사용하여 각 트랙의 enabled 속성을 토글하여 카메라를 끕니다.
    }
  };
  const dummyUrl =
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const videoUrls = [dummyUrl, dummyUrl, dummyUrl, dummyUrl, dummyUrl];

  return (
    <div className={styles.videoScreen}>
      <div className={styles.userArea}>
        <div className={styles.userVideo}>
          <div>
            <UserVideoComponent streamManager={mainStreamManager} />
          </div>
        </div>
        <div className="iconContainer">
          <h1 className="micIcon">🎤</h1>
          <h1 className="soundIcon">🔊</h1>
        </div>
      </div>
      {videoUrls.map((url, index) => (
        <div key={index} className="videoContainer">
          <iframe
            title={`Video ${index + 1}`}
            src={`${dummyUrl}?autoplay=1`}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      ))}
      <div>
        <h1 className="chat-icon">🗨️</h1>
      </div>
    </div>
  );
};

export default VideoScreen;
