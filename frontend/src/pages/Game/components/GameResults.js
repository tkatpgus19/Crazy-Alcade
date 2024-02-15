import React, { useState, useEffect } from "react";
import styles from "./GameResults.module.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GameResults = ({ roomType, roomId, userInfo }) => {
  const navigate = useNavigate();
  const [gameResult, setGameResult] = useState(null); // gameResult 상태 추가
  const [levelResult, setLevelResult] = useState(null); // gameResult 상태 추가

  const [currentExp, setCurrentExp] = useState(userInfo.tempExp);

  // 게임 결과 API 호출
  useEffect(() => {
    if (!roomId) return; // roomId가 없으면 API 호출하지 않음

    const fetchGameResult = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_BASE_URL}/rooms/${roomId}/rank`;
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { result } = response.data;
        setGameResult(result); // API 응답을 상태에 저장
      } catch (error) {
        console.error("Error fetching game result:", error);
      }
    };

    fetchGameResult();
  }, [roomId]);

  // 코인, 경험치 획득 API 호출
  useEffect(() => {
    const fetchCoinExp = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_BASE_URL}/members/reward`;
        const token = localStorage.getItem("accessToken");
        // console.log(
        //   gameResult.myRank.getExp +
        //     " " +
        //     gameResult.myRank.getCoin +
        //     "경험치코인"
        // );
        const response = await axios.put(
          apiUrl,
          {
            putCoinValue: gameResult.myRank.getCoin,
            putExpValue: gameResult.myRank.getExp,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { result } = response.data;
        setLevelResult(result);

        // console.log(
        //   gameResult.myRank.getCoin,
        //   gameResult.myRank + " " + getExp + " 획득!"
        // );
      } catch (error) {
        console.error("Error fetching game result:", error);
      }
    };
    fetchCoinExp();
  }, [gameResult]);

  const exitClick = () => {
    if (roomType === "normal") {
      navigate("/review");
    } else {
      navigate("/main");
    }
  };

  if (!gameResult || !levelResult) {
    // gameResult가 아직 없을 때 로딩 상태 표시
    return <div>Loading...</div>;
  }

  const { totalRanks, myRank } = gameResult;
  const { levelId, levelUp } = levelResult;

  const players = totalRanks.map((rankInfo) => ({
    rank: rankInfo.rank,
    name: rankInfo.nickname,
    time: rankInfo.time === "-" ? "RETIRE" : rankInfo.time,
    memory: rankInfo.memory === "-" ? "" : `${rankInfo.memory}`,
  }));

  const playerResult = {
    rank: myRank.rank,
    level: userInfo.levelId, // 임의의 레벨 정보
    exp: userInfo.tempExp,
    coins: `+ ${myRank.getCoin}`, // 획득한 경험치 정보 변경
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.resultsWindow}>
        <div className={styles.header}>게임 결과</div>
        <ul className={styles.leaderboard}>
          <li className={styles.leaderboardHeader}>
            <span className={styles.rank}>Rank</span>
            <span className={styles.name}>Name</span>
            <span className={styles.headerTime}>Time</span>
            <span className={styles.headerMemory}>Memory</span>
          </li>
          {players.map((player, index) => (
            <li
              key={index}
              className={`${styles[`rank${player.rank}`]} ${
                player.rank === "-" ? styles.retiredPlayer : ""
              } ${player.name === userInfo.nickname ? styles.myRankHighlight : ""}`}
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className={styles.playerRewards}>레벨 {levelId}</div>
                {levelUp && <span className={styles.up}>Level Up!</span>}
              </div>

              {/* 경험치 바 */}
              <div className={styles.expBar}>
                <div
                  className={styles.expFill}
                  style={{
                    width: `${
                      levelUp
                        ? ((userInfo.tempExp +
                            gameResult.myRank.getExp -
                            userInfo.expLimit) /
                            userInfo.expLimit) *
                          100
                        : ((userInfo.tempExp + gameResult.myRank.getExp) /
                            userInfo.expLimit) *
                          100
                    }%`,
                  }} // 경험치에 따라 바의 길이 조절
                ></div>
                <div className={styles.expText}>
                  {`${levelUp ? userInfo.tempExp + gameResult.myRank.getExp - userInfo.expLimit : userInfo.tempExp + gameResult.myRank.getExp} / ${userInfo.expLimit}`}
                </div>
              </div>
              {/* 코인 추가*/}
              <span className={styles.coins}>{playerResult.coins}</span>
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
  roomId: PropTypes.string.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default GameResults;
