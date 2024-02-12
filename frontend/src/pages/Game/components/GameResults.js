import React from "react";
import styles from "./GameResults.module.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const GameResults = ({ roomType }) => {
  const navigate = useNavigate();

  const players = [
    { rank: 1, name: "김세현", time: "100ms", memory: "13420KB" },
    { rank: 2, name: "현직개발자", time: "120ms", memory: "53165KB" },
    { rank: 3, name: "림수빈", time: "130ms", memory: "13420KB" },
    { rank: 4, name: "한독냉", time: "420ms", memory: "51265KB" },
    { rank: 5, name: "창준팕", time: "1200ms", memory: "134220KB" },
    { rank: "-", name: "김규리", time: "RETIRE", memory: "" },
    // ... Add more players here
  ];

  const playerResult = { rank: 2, level: "28", coins: "+ 300" };

  const exitClick = () => {
    if (roomType === "normal") {
      navigate("/review"); // 노말 게임일 때 리뷰 페이지로 이동
    } else {
      navigate("/main"); // 아이템 게임일 때 메인 페이지로 이동
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.resultsWindow}>
        <div className={styles.header}>게임 결과</div>
        <ul className={styles.leaderboard}>
          {/* Header row */}
          <li className={styles.leaderboardHeader}>
            <span className={styles.rank}>Rank</span>
            <span className={styles.name}>Name</span>
            <span className={styles.headerTime}>Time</span>
            <span className={styles.headerMemory}>Memory</span>
          </li>
          {/* Players list */}
          {players.map((player, index) => (
            <li
              key={index}
              className={`${styles[`rank${player.rank}`]} ${player.rank === "-" ? styles.retiredPlayer : ""}`}
            >
              <span className={styles.rank}>{player.rank}</span>
              <span className={styles.name}>{player.name}</span>
              <span className={styles.time}>{player.time}</span>
              <span className={styles.memory}>{player.memory}</span>
            </li>
          ))}
        </ul>
        <div className={styles.footerSection}>
          <div className={styles.playerSection}>
            <div className={styles.playerInfo}>
              <div className={styles.playerRank}>{playerResult.rank}등</div>
              <div className={styles.playerRewards}>
                레벨 {playerResult.level}
                <span className={styles.coins}>{playerResult.coins}</span>
              </div>
            </div>
          </div>
          <button
            className={
              roomType === "normal" ? styles.reviewButton : styles.exitButton
            }
            onClick={exitClick}
          >
            {roomType === "normal" ? "리뷰화면으로" : "나가기"}
          </button>
        </div>
      </div>
    </div>
  );
};

GameResults.propTypes = {
  roomType: PropTypes.string.isRequired,
};

export default GameResults;
