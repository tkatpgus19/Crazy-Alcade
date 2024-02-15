// VideoScreen.js

import React from "react";
import styles from "./VideoScreen.module.css";
import { useState, useEffect } from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UserVideoComponent from "./UserVideoComponent";
import PropTypes from "prop-types";
import micOnImage from "../../assets/images/MIC-ON.png";
import micOffImage from "../../assets/images/MIC-OFF.png";
import soundOnImage from "../../assets/images/SOUND-ON.png";
import soundOffImage from "../../assets/images/SOUND-OFF.png";
import screenOnImage from "../../assets/images/SCREEN-ON.png";
import screenOffImage from "../../assets/images/SCREEN-OFF.png";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleMicrophone,
  toggleCamera,
  toggleAudio,
} from "../Room/slices/settingSlice.js";

// OpenVidu 서버의 URL을 환경에 따라 설정
const APPLICATION_SERVER_URL = process.env.REACT_APP_OPENVIDU_URL;

const VideoScreen = ({ roomId, nickname, userList, roomType }) => {
  const [mySessionId, setMySessionId] = useState(roomId);
  const [myUserName, setMyUserName] = useState(nickname);
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined); //방장
  const [subscribers, setSubscribers] = useState([]); //참가자
  const { isMicrophoneOn, isCameraOn, isAudioOn } = useSelector(
    (state) => state.settings
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // 페이지가 언마운트되기 전에 이벤트 리스너 추가 및 정리
    window.addEventListener("beforeunload", onBeforeUnload);
    console.log(roomType + "//" + userList + "//" + nickname + "//" + roomId);
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
    return(
      leaveSession()
    )
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
        videoSource: roomType === "item" ? "screen" : undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: "1920x1080",
        frameRate: 30, // 초당 비디오 프레임 수
        insertMode: "APPEND",
        mirror: false, // 거울 기능 켜주기
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
  const toggleca = () => {
    if (publisher) {
      const videoTracks = publisher.stream.getMediaStream().getVideoTracks();
      const isCurrentlyOn = videoTracks[0].enabled;
      videoTracks.forEach((track) => (track.enabled = !isCurrentlyOn));
      dispatch(toggleCamera()); // 카메라 상태 업데이트
    }
  };

  // 마이크 토글 함수
  const toggleMic = () => {
    if (publisher) {
      const audioTracks = publisher.stream.getMediaStream().getAudioTracks();
      audioTracks.forEach((track) => (track.enabled = !track.enabled));
    }
    dispatch(toggleMicrophone()); // 마이크 상태를 토글
  };

  // 음소거 토글 함수
  const toggleAud = () => {
    dispatch(toggleAudio());
    subscribers.forEach((subscriber) => {
      subscriber.subscribeToAudio(!isAudioOn);
    });
  };

  useEffect(() => {
    const updateAudioVideoState = () => {
      // 마이크 상태 설정
      if (publisher) {
        const audioTracks = publisher.stream.getMediaStream().getAudioTracks();
        if (audioTracks.length > 0) {
          audioTracks[0].enabled = isMicrophoneOn;
        }

        const videoTracks = publisher.stream.getMediaStream().getVideoTracks();
        if (videoTracks.length > 0) {
          videoTracks[0].enabled = isCameraOn;
        }
      }

      // 음소거 상태 설정
      subscribers.forEach((subscriber) => {
        if (subscriber.stream && subscriber.stream.getMediaStream()) {
          const audioTracks = subscriber.stream
            .getMediaStream()
            .getAudioTracks();
          audioTracks.forEach((track) => (track.enabled = isAudioOn));
        }
      });
    };

    // joinSession 호출 후 publisher와 subscribers 준비 확인
    if (publisher && subscribers.length > 0) {
      updateAudioVideoState();
    }
  }, [publisher, subscribers, isMicrophoneOn, isCameraOn, isAudioOn]);

  return (
    <div style={{paddingBottom: '20px'}}>
      <div className={styles.videoScreen}>
        <div className={styles.userArea}>
          <div className={styles.mainVideo}>
            {mainStreamManager !== undefined ? (
              <UserVideoComponent streamManager={mainStreamManager} />
            ) : (
              "로딩중 입니다"
            )}
          </div>
        </div>
        <div className={styles.iconContainer}>
          {/* 마이크 토글 이미지 버튼 */}
          <img
            src={isMicrophoneOn ? micOnImage : micOffImage}
            className={styles.btnIcon}
            onClick={toggleMic}
            alt="마이크 토글"
          />
          {/* 음소거 토글 이미지 버튼 */}
          <img
            src={isAudioOn ? soundOnImage : soundOffImage}
            className={styles.btnIcon}
            onClick={toggleAud}
            alt="음소거 토글"
          />
          {/* 카메라 토글 이미지 버튼 */}
          <img
            src={isCameraOn ? screenOnImage : screenOffImage}
            className={styles.btnIcon + " " + styles.btnIcon2}
            onClick={toggleca}
            alt="카메라 토글"
          />
        </div>
        <div className={styles.userVideo}>
          {subscribers.length > 0 ? (
            <UserVideoComponent streamManager={subscribers[0]} />
          ) : (
            <></>
          )}
        </div>
        <div className={styles.userVideo}>
          {subscribers.length > 1 ? (
            <UserVideoComponent streamManager={subscribers[1]} />
          ) : (
            <></>
          )}
        </div>
        <div className={styles.userVideo}>
          {subscribers.length > 2 ? (
            <UserVideoComponent streamManager={subscribers[2]} />
          ) : (
            <></>
          )}
        </div>
        <div className={styles.userVideo}>
          {subscribers.length > 3 ? (
            <UserVideoComponent streamManager={subscribers[3]} />
          ) : (
            <></>
          )}
        </div>
        <div className={styles.userVideo}>
          {subscribers.length > 4 ? (
            <UserVideoComponent streamManager={subscribers[4]} />
          ) : (
            <></>
          )}
        </div>
        {/* <div className={styles.chaticon}>🗨️</div> */}
      </div>
    </div>
  );
};

VideoScreen.propTypes = {
  roomId: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
  userList: PropTypes.array.isRequired,
  roomType: PropTypes.string.isRequired,
};

export default VideoScreen;
