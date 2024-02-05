import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Timer.module.css";

const Timer = ({ initialTime }) => {
  const [remainingTime, setRemainingTime] = useState(initialTime);

  useEffect(() => {
    setRemainingTime(initialTime); // 컴포넌트가 마운트될 때 초기값으로 설정

    // 1초마다 remainingTime을 1씩 감소
    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    // 컴포넌트가 언마운트되면 clearInterval을 통해 interval 정리
    return () => clearInterval(intervalId);
  }, [initialTime]); // initialTime이 변경될 때마다 useEffect 다시 실행

  return <div className={styles.timer}>TIME {formatTime(remainingTime)}</div>;
};

Timer.propTypes = {
  initialTime: PropTypes.number.isRequired,
};

// 남은 시간을 '분:초' 형식으로 변환하는 함수
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export default Timer;
