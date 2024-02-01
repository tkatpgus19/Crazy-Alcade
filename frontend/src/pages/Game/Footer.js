// Footer.js
import React from "react";
import PropTypes from "prop-types";
import styles from "./Footer.module.css";
import ItemButton from "./components/ItemButton"; // ItemButton 컴포넌트 임포트
import ActionButton from "./components/ActionButton";

const Footer = ({ onSave, onRun, onSubmit, onUseItem }) => {
  const handleItemUse = (item) => {
    // 사용할 아이템에 따라 처리 로직 추가
    onUseItem(item);
  };

  return (
    <div className={styles.footer}>
      {/* 내 아이템 영역 */}
      <div className={styles.itemContainer}>
        <div className={styles.itemHeader}>내 아이템</div>
        {/* 각각의 아이템 버튼을 ItemButton 컴포넌트로 대체 */}
        <ItemButton itemName="아이템1" onUseItem={onUseItem} />
        <ItemButton itemName="아이템2" onUseItem={onUseItem} />
        <ItemButton itemName="아이템3" onUseItem={onUseItem} />
      </div>

      {/* 기존 버튼들 유지 */}
      <ActionButton
        className={styles.button}
        color="#3498db"
        text="임시 저장"
        onClick={onSave}
      />
      <ActionButton
        className={styles.button}
        color="#27ae60"
        text="코드 실행"
        onClick={onRun}
      />
      <ActionButton
        className={styles.button}
        color="#e74c3c"
        text="코드 제출"
        onClick={onSubmit}
      />
    </div>
  );
};

Footer.propTypes = {
  onSave: PropTypes.func.isRequired,
  onRun: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUseItem: PropTypes.func.isRequired,
};

export default Footer;
