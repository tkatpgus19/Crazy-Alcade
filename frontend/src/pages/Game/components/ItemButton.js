import React from "react";
import PropTypes from "prop-types";
import styles from "./ItemButton.module.css";

const ItemButton = ({ icon, itemName, onUseItem, disabled, count }) => {
  const handleItemUse = () => {
    // 사용할 아이템에 따라 처리 로직 추가
    onUseItem(itemName);
  };

  return (
    <div className={styles.itemButtonContainer}>
      {" "}
      {/* 아이템 버튼 및 카운트를 포함할 컨테이너 추가 */}
      <button
        className={disabled ? styles.disabledButton : styles.itemButton}
        disabled={disabled}
        onClick={handleItemUse}
      >
        <img src={icon} width={30} height={30} alt="Item Icon" />
      </button>
      {!disabled && <div className={styles.itemCount}>{count}</div>}{" "}
      {/* 개수 표시 */}
    </div>
  );
};

ItemButton.propTypes = {
  icon: PropTypes.string.isRequired,
  itemName: PropTypes.string.isRequired,
  onUseItem: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  count: PropTypes.number.isRequired, // 개수 prop 추가
};

export default ItemButton;
