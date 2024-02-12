import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./ItemShopModal.module.css";
import axios from "axios";

// 이미지 import
import waterBalloonImg from "../../assets/images/waterBalloon.png";
import octopusImg from "../../assets/images/octopus.png";
import chickImg from "../../assets/images/chick.png";
import magicImg from "../../assets/images/magic.png";
import shieldImg from "../../assets/images/shield.png";

// 이미지를 itemId와 매핑하기 위한 객체
const itemImages = {
  1: waterBalloonImg,
  2: octopusImg,
  3: chickImg,
  4: magicImg,
  5: shieldImg,
};

const Item = ({ name, description, count, img, coin, onBuy }) => {
  return (
    <div className={styles.item}>
      <div className={styles.itemImageContainer}>
        <img src={img} alt={name} className={styles.itemImage} />
        <div className={styles.itemCoin}>코인: {coin}</div>
      </div>
      <div className={styles.itemContent}>
        <div className={styles.itemHeader}>
          <div className={styles.itemName}>{name}</div>
          <div className={styles.itemCount}>보유 갯수: {count}</div>
        </div>
        <div className={styles.itemBody}>
          <div className={styles.itemDescription}>{description}</div>
          <button className={styles.buyButton} onClick={onBuy}>
            구매
          </button>
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

const ItemShopModal = ({ closeModal }) => {
  const [items, setItems] = useState([]);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    axios
      .get("http://i10d104.p.ssafy.io/api/tiers")
      .then((response) => {
        const { memberCoin, memberItemInventory } = response.data.result;
        setCoins(memberCoin);
        const updatedItems = memberItemInventory.map((item) => ({
          ...item,
          name: item.itemDescription, // 아이템 설명
          description: item.itemDescription, // 아이템 설명
          count: item.memberCount, // 아이템 보유 갯수
          img: itemImages[item.itemId], // itemId에 따라 이미지 할당
          coin: item.itemPrice, // 아이템 가격
        }));
        setItems(updatedItems);
      })
      .catch((error) => console.error("에러 발생!", error));
  }, []);

  return (
    <div className={styles.itemShopModal}>
      <div className={styles.titleBox}>아이템 상점</div>
      <button className={styles.closeButton} onClick={closeModal}>
        &times;
      </button>
      <div className={styles.coinsDisplay}>보유 코인: {coins}</div>
      <div className={styles.itemsContainer}>
        {items.map((item, index) => (
          <Item
            key={index}
            name={item.name}
            description={item.description}
            count={item.count}
            onBuy={() => {
              /* 구매 로직 처리 */
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
};

export default ItemShopModal;
