import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import PropTypes from "prop-types";
import styles from "./Timer.module.css";

import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { resetTimer } from "../slices/timerSlice";

const Timer = ({ roomId }) => {
  const dispatch = useDispatch();

  const [remainingTime, setRemainingTime] = useState();
  const client = useRef();

  // 남은 시간을 '분:초' 형식으로 변환하는 함수
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    connectSession();
  }, []);

  function connectSession() {
    const socket = new SockJS(`${process.env.REACT_APP_BASE_URL}/ws-stomp`);
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
      TIME {remainingTime ? formatTime(remainingTime) : "?? : ??"}
    </div>
  );
};

Timer.propTypes = {
  roomId: PropTypes.string.isRequired,
};

export default Timer;
