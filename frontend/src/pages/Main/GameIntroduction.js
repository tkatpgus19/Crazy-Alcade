import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import imgfile from "../../assets/images/logo.png";
import background from "../../assets/images/mainback.png";
import gameIntroImg from "../../assets/images/gameintro.png";

import "./GameIntroduction.module.css";
import styles from "./GameIntroduction.module.css";

const GameIntroduction = () => {
  const [currentPage, setCurrentPage] = useState("intro"); // 현재 보여줄 페이지 상태 관리
  const navigate = useNavigate();

  // 현재 페이지에 따라 버튼 클래스를 결정하는 함수
  const getButtonClass = (page) =>
    currentPage === page
      ? `${styles.tabButton} ${styles.tabButtonActive}`
      : styles.tabButton;

  const backgroundStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "100vh",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "space-between",
  };

  const logoStyle = {
    // 로고에 대한 추가 스타일을 여기에 추가
  };

  // 게임 소개 페이지 내용
  const GameIntroContent = () => (
    <div>
      <img src={gameIntroImg} alt="게임 소개" className="gameIntroImage" />
      {/* 게임 소개 내용 */}
    </div>
  );

  // 아이템 도감 페이지 내용
  const ItemDexContent = () => (
    <div>
      <h1>아이템 도감</h1>
      {/* 아이템 목록을 보여주는 컴포넌트 또는 내용 */}
    </div>
  );

  // 경험치 표 페이지 내용
  const ExpTableContent = () => (
    <div>
      <h1>경험치 표</h1>
      {/* 경험치 표를 보여주는 컴포넌트 또는 내용 */}
    </div>
  );

  return (
    <div
      className={styles.mainContainer}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className={styles.header}>
        <div className={styles.logo}>
          <img src={imgfile} alt="로고" />
        </div>{" "}
        <button
          className={styles.gameInfoButton}
          onClick={() => setCurrentPage("intro")}
        >
          게임 정보
        </button>
        <button className={styles.exitButton} onClick={() => navigate("/main")}>
          뒤로 가기
        </button>
      </div>

      <div className={styles.buttonContent}>
        <div className={styles.tabButtons}>
          <button
            className={getButtonClass("intro")}
            onClick={() => setCurrentPage("intro")}
          >
            게임 소개
          </button>
          <button
            className={getButtonClass("itemdex")}
            onClick={() => setCurrentPage("itemdex")}
          >
            아이템 도감
          </button>
          <button
            className={getButtonClass("exptable")}
            onClick={() => setCurrentPage("exptable")}
          >
            경험치 표
          </button>
        </div>

        <div className={styles.contentArea}>
          {currentPage === "intro" && <GameIntroContent />}
          {currentPage === "itemdex" && <ItemDexContent />}
          {currentPage === "exptable" && <ExpTableContent />}
        </div>
      </div>
    </div>
  );
};
export default GameIntroduction;
