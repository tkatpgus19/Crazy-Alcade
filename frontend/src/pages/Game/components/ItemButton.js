// ItemButton.js
import React from "react";
import PropTypes from "prop-types";
import styles from "./ItemButton.module.css";

const ItemButton = ({ icon, itemName, onUseItem, disabled }) => {
  const handleItemUse = () => {
    // 사용할 아이템에 따라 처리 로직 추가
    onUseItem(itemName);
  };

  return (
    <button
      className={disabled ? styles.disabledButton : styles.itemButton}
      color="#3498db" // 파란색으로 변경
      disabled={disabled}
      onClick={handleItemUse}
    >
      <img src={icon} width={30} height={30} alt="Item Icon" />
    </button>
  );
};

ItemButton.propTypes = {
  icon: PropTypes.string.isRequired,
  itemName: PropTypes.string.isRequired,
  onUseItem: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default ItemButton;
