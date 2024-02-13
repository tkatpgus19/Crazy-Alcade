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

const Item = ({ key, itemId, name, description, count, img, coin, onBuy }) => {
  const handleBuyClick = () => {
    onBuy(itemId, 1); // 구매 수량을 1로 고정하여 구매 함수 호출
  };

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
          <button className={styles.buyButton} onClick={handleBuyClick}>
            구매
          </button>
        </div>
      </div>
    </div>
  );
};
Item.propTypes = {
  key: PropTypes.number.isRequired,
  itemId: PropTypes.number.isRequired,
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
    const apiUrl = `${process.env.REACT_APP_BASE_URL}/members/inventory`;
    const token = localStorage.getItem("accessToken");

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const { memberCoin, memberItemInventory } = response.data.result;
        setCoins(memberCoin);
        const updatedItems = memberItemInventory.map((item) => ({
          ...item,
          name: item.name, // 아이템 설명
          description: item.itemDescription, // 아이템 설명
          count: item.memberCount, // 아이템 보유 갯수
          img: itemImages[item.itemId], // itemId에 따라 이미지 할당
          coin: item.itemPrice, // 아이템 가격
        }));
        setItems(updatedItems);
      })
      .catch((error) => console.error("에러 발생!", error));
  }, []);

  // 아이템 구매 함수
  // 아이템 구매 로직 처리
  const buyItem = (itemId, putValue) => {
    const apiUrl = `${process.env.REACT_APP_BASE_URL}/items/members/add`;
    const token = localStorage.getItem("accessToken");

    axios
      .put(
        apiUrl,
        { itemId, putValue },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log("구매 성공:", response.data);
        const itemPrice = items.find((item) => item.itemId === itemId).coin; // 구매 아이템 가격 찾기
        setCoins((prevCoins) => prevCoins - itemPrice); // 코인 차감
        setItems((prevItems) =>
          prevItems.map((item) => {
            if (item.itemId === itemId) {
              return { ...item, count: item.count + putValue }; // 아이템 수량 증가
            }
            return item;
          })
        );
      })
      .catch((error) => {
        console.error("구매 실패:", error);
      });
  };
  // 테스트용 돈복사
  const showMeTheMoney = () => {
    const apiUrl = `${process.env.REACT_APP_BASE_URL}/members/coin/add`;
    const token = localStorage.getItem("accessToken");
    axios.put(
      apiUrl,
      { putValue: 10000 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  return (
    <div className={styles.itemShopModal}>
      <div className={styles.titleBox}>아이템 상점</div>
      <button className={styles.closeButton} onClick={closeModal}>
        &times;
      </button>
      <div className={styles.coinsDisplay}>보유 코인: {coins}</div>
      <button className={styles.coinsDisplay} onClick={showMeTheMoney}>
        돈복사
      </button>
      <div className={styles.itemsContainer}>
        {items.map((item, index) => (
          <Item
            key={item.itemId} // key prop을 여기서 전달
            itemId={index + 1}
            name={item.name}
            description={item.description}
            count={item.count}
            onBuy={buyItem}
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
