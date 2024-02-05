// ItemShopModal.js
import React from "react";
import PropTypes from "prop-types";
import styles from "./ItemShopModal.module.css";

const ItemShopModal = ({ closeModal }) => {
  return (
    <div className={styles.itemShopModal}>
      <div className={styles.titleBox}>아이템 상점</div>
      <button className={styles.closeButton} onClick={closeModal}>
        &times;
      </button>
      <div className={styles.itemContainer}>
        <div className={styles.itemImage}></div>
        <div className={styles.itemInfo}>
          <div className={styles.itemName}>아이템 이름</div>
          <div className={styles.itemDescription}>
            아이템 설명이 들어갑니다.
          </div>
          <div className={styles.itemCount}>보유 갯수: 5</div>
        </div>
      </div>
      <button className={styles.buyButton}>구매</button>
    </div>
  );
};

ItemShopModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default ItemShopModal;
