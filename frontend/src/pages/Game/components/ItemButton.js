// ItemButton.js
import React from "react";
import PropTypes from "prop-types";
import styles from "../Footer.module.css";
import ActionButton from "./ActionButton";

const ItemButton = ({ itemName, onUseItem }) => {
  const handleItemUse = () => {
    // 사용할 아이템에 따라 처리 로직 추가
    onUseItem(itemName);
  };

  return (
    <ActionButton
      className={styles.itemButton}
      color="#3498db" // 파란색으로 변경
      text={itemName}
      onClick={handleItemUse}
    />
  );
};

ItemButton.propTypes = {
  itemName: PropTypes.string.isRequired,
  onUseItem: PropTypes.func.isRequired,
};

export default ItemButton;
