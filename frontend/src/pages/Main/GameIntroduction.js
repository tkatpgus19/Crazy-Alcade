import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import imgfile from "../../assets/images/logo.png";
import background from "../../assets/images/mainback.png";
import gameIntroImg from "../../assets/images/gameintro.png";

import "./GameIntroduction.module.css";
import styles from "./GameIntroduction.module.css";

// 이미지 import
import octopusImg from "../../assets/images/octopus.png";
import chickImg from "../../assets/images/chick.png";
import waterBalloonImg from "../../assets/images/waterBalloon.png";
import magicImg from "../../assets/images/magic.png";
import shieldImg from "../../assets/images/shield.png";

// 상세 이미지 import
import octopusDetailImg from "../../assets/images/octopusDetail.png";
import chickDetailImg from "../../assets/images/chickDetail.png";
import waterBallonDetailImg from "../../assets/images/waterBallonDetail.png";
import magicDetailImg from "../../assets/images/magicDetail.png";
import shieldDetailImg from "../../assets/images/shieldDetail.png";

const items = [
  {
    id: 1,
    name: "문어",
    image: octopusImg,
    detailImage: octopusDetailImg,
  },
  {
    id: 2,
    name: "병아리",
    image: chickImg,
    detailImage: chickDetailImg,
  },
  {
    id: 3,
    name: "물풍선",
    image: waterBalloonImg,
    detailImage: waterBallonDetailImg,
  },
  {
    id: 4,
    name: "요술봉",
    image: magicImg,
    detailImage: magicDetailImg,
  },
  {
    id: 5,
    name: "쉴드",
    image: shieldImg,
    detailImage: shieldDetailImg,
  },
];

const GameIntroduction = () => {
  const [currentPage, setCurrentPage] = useState("intro");
  const [selectedItem, setSelectedItem] = useState(null); // 선택된 아이템을 위한 상태
  const navigate = useNavigate();

  // 현재 페이지에 따라 버튼 클래스를 결정하는 함수
  const getButtonClass = (page) =>
    currentPage === page
      ? `${styles.tabButton} ${styles.tabButtonActive}`
      : styles.tabButton;

  // 게임 소개 페이지 내용
  const GameIntroContent = () => (
    <div className={styles.introImage}>
      <img src={gameIntroImg} alt="게임 소개" className="gameIntroImage" />
      {/* 게임 소개 내용 */}
    </div>
  );

  // 아이템 도감 페이지 내용
  const ItemDexContent = () => (
    <div className={styles.itemDexContainer}>
      {/* 선택된 아이템의 상세 이미지를 보여줍니다 (왼쪽 부분) */}
      <div className={styles.itemDetailContainer}>
        {selectedItem && (
          <img
            src={selectedItem.detailImage}
            alt={selectedItem.name}
            className={styles.itemDetailImage}
          />
        )}
      </div>
      {/* 아이템 목록을 보여줍니다 (오른쪽 부분) */}
      <div className={styles.itemList}>
        {items.map((item) => (
          <div
            key={item.id}
            className={styles.item}
            onClick={() => setSelectedItem(item)}
          >
            <img
              src={item.image}
              alt={item.name}
              className={styles.itemImage}
            />
          </div>
        ))}
      </div>
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
        </div>

        <div className={styles.contentArea}>
          {currentPage === "intro" && <GameIntroContent />}
          {currentPage === "itemdex" && <ItemDexContent />}
        </div>
      </div>
    </div>
  );
};
export default GameIntroduction;
