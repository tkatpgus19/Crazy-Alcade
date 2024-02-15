import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import PropTypes from "prop-types";
import styles from "./Timer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { resetTimer } from "../slices/timerSlice";

const Timer = ({ roomId }) => {
  const dispatch = useDispatch();

  const [remainingTime, setRemainingTime] = useState();
  const client = useRef();

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    console.log("타이머 구독 합니다!!!");
    connectSession();
  }, []);

  function connectSession() {
    const socket = new SockJS(`${process.env.REACT_APP_SOCKET_URL}`);
    client.current = Stomp.over(socket);
    client.current.connect({}, onConnected, onError);
  }

  function onConnected() {
    client.current.subscribe(`/sub/timer/` + roomId, onTimerReceived);
  }

  function onError() {
    alert("error");
  }

  function onTimerReceived(payload) {
    setRemainingTime(JSON.parse(payload.body));
  }

  // Game.js로 쏴라
  useEffect(() => {
    if (remainingTime === 0) {
      dispatch(resetTimer()); // 게임 종료 알림.
      client.current.disconnect();
    }
  }, [remainingTime]);

  return (
    <div
      className={`${styles.timer} ${remainingTime < 60 ? styles.redTimer : ""}`}
    >
      {/* 타이머 아이콘 */}
      TIME {remainingTime ? formatTime(remainingTime) : "??:??"}
    </div>
  );
};

Timer.propTypes = {
  roomId: PropTypes.string.isRequired,
};

export default Timer;
