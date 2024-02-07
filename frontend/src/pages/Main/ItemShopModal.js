import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./ItemShopModal.module.css";
import waterBalloonImg from "../../assets/images/waterBalloon.png";
import octopusImg from "../../assets/images/octopus.png";
import chickImg from "../../assets/images/chick.png";
import magicImg from "../../assets/images/magic.png";
import shieldImg from "../../assets/images/shield.png";

const Item = ({ name, description, count, img, coin }) => {
  return (
    <div className={styles.item}>
      <div className={styles.itemImageContainer}>
        <div
          className={styles.itemImage}
          style={{ backgroundImage: `url(${img})` }}
        ></div>
        <div className={styles.itemCoin}>코인: {coin}</div>{" "}
        {/* 이미지 아래 코인 가격 */}
      </div>
      <div className={styles.itemContent}>
        <div className={styles.itemHeader}>
          <div className={styles.itemName}>{name}</div>
          <div className={styles.itemCount}>보유 갯수: {count}</div>
        </div>
        <div className={styles.itemBody}>
          <div className={styles.itemDescription}>{description}</div>
          <button className={styles.buyButton}>구매</button>
        </div>
      </div>
    </div>
  );
};

Item.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  onBuy: PropTypes.func.isRequired,
  img: PropTypes.string.isRequired,
  coin: PropTypes.number.isRequired,
};

const ItemShopModal = ({ closeModal, coins }) => {
  const [items, setItems] = useState([
    {
      name: "물풍선",
      description: "알록달록 물풍선입니다",
      count: 5,
      img: waterBalloonImg,
      coin: 60,
    },
    {
      name: "문어야끼",
      description: "먹물 뿌리는 문어입니다",
      count: 5,
      img: octopusImg,
      coin: 40,
    },
    {
      name: "병아리",
      description: "이리저리 돌아다니는걸 좋아하는 병아리입니다",
      count: 5,
      img: chickImg,
      coin: 20,
    },
    {
      name: "요술봉",
      description: "뒤집어지도록 하는 요술봉입니다",
      count: 5,
      img: magicImg,
      coin: 100,
    },
    {
      name: "쉴드",
      description: "모든 아이템들을 방어하는 쉴드입니다",
      count: 5,
      img: shieldImg,
      coin: 80,
    },
  ]);

  return (
    <div className={styles.itemShopModal}>
      <div className={styles.titleBox}>아이템 상점</div>
      <button className={styles.closeButton} onClick={closeModal}>
        &times;
      </button>
      <div className={styles.coinsDisplay}>보유 코인: {coins}</div>{" "}
      {/* 보유 코인 표시 */}
      <div className={styles.itemsContainer}>
        {items.map((item, index) => (
          <Item
            key={index}
            name={item.name}
            description={item.description}
            count={item.count}
            onBuy={() => {
              /* handle purchase logic here */
            }}
            img={item.img}
            coin={item.coin}
          />
        ))}
      </div>
    </div>
  );
};

ItemShopModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  coins: PropTypes.number, // coins prop에 대한 PropTypes 정의
};

export default ItemShopModal;
