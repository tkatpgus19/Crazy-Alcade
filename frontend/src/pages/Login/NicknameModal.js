// NicknameModal.js

import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./NicknameModal.module.css";

const NicknameModal = ({ onClose }) => {
  const [nickname, setNickname] = useState("");

  // 닉네임이 변경될 때 호출되는 함수입니다.
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  // 제출 버튼이 클릭되면 호출되는 함수입니다.
  const handleSubmit = () => {
    // 닉네임이 비어있지 않은 경우에만 처리합니다.
    if (nickname.trim() !== "") {
      // 여기에 닉네임을 사용하거나 저장하는 로직을 추가하세요.
      alert(`닉네임 제출됨: ${nickname}`);

      // 닉네임을 저장한 후에 입력 필드를 비웁니다.
      setNickname("");
    } else {
      // 닉네임이 비어있는 경우 알림을 표시하거나 제출을 막을 수 있습니다.
      alert("닉네임을 입력하세요.");
    }

    // 부모 컴포넌트로부터 전달받은 onClose 함수를 호출하여 모달을 닫습니다.
    onClose();
  };

  // 취소 버튼이 클릭되면 호출되는 함수입니다.
  const handleCancel = () => {
    // 취소 버튼 클릭 시 입력 필드를 비웁니다.
    setNickname("");

    // 부모 컴포넌트로부터 전달받은 onClose 함수를 호출하여 모달을 닫습니다.
    onClose();
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <h2>닉네임을 입력하세요</h2>
        {/* 닉네임을 입력받는 input 요소입니다. */}
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={handleNicknameChange}
        />
        {/* 버튼들을 감싸는 div입니다. */}
        <div className={styles.buttonContainer}>
          {/* 제출 버튼 */}
          <button onClick={handleSubmit}>제출</button>
          {/* 추가: 취소 버튼 */}
          <button onClick={handleCancel}>취소</button>
        </div>
      </div>
    </div>
  );
};

// 프로퍼티 타입을 검사합니다.
NicknameModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default NicknameModal;
