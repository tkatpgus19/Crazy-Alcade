import React from "react";
import PropTypes from "prop-types";
import styles from "./ItemShopModal.module.css";

const Item = ({ itemName, itemDescription, itemCount, onBuy, img, coin }) => {
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
          <div className={styles.itemName}>{itemName}</div>
          <div className={styles.itemCount}>보유 갯수: {itemCount}</div>
        </div>
        <div className={styles.itemBody}>
          <div className={styles.itemDescription}>{itemDescription}</div>
          <button className={styles.buyButton} onClick={onBuy}>
            구매
          </button>
        </div>
      </div>
    </div>
  );
};

Item.propTypes = {
  itemName: PropTypes.string.isRequired,
  itemDescription: PropTypes.string.isRequired,
  itemCount: PropTypes.number.isRequired,
  onBuy: PropTypes.func.isRequired,
  img: PropTypes.string,
  coin: PropTypes.number,
};

const ItemShopModal = ({ closeModal, items, coins }) => {
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
            itemName={item.name}
            itemDescription={item.description}
            itemCount={item.count}
            onBuy={() => {
              /* handle purchase logic here */
            }}
          />
        ))}
      </div>
    </div>
  );
};

ItemShopModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ),
  coins: PropTypes.number, // coins prop에 대한 PropTypes 정의
};

export default ItemShopModal;
