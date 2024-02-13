import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styles from "./NicknameModal.module.css"; // 스타일시트 임포트

const NicknameModal = ({ close }) => {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log("닉네임 제출: ", nickname);
    // 닉네임 제출 로직 구현
    // API 호출이 성공했다고 가정하고, isNew 값을 업데이트
    localStorage.setItem("isNew", "false");
    close(); // 모달 닫기
    navigate("/main");
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>닉네임 설정</h2>
        <input
          type="text"
          placeholder="닉네임 입력"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className={styles.inputField}
        />
        <button onClick={handleSubmit} className={styles.submitButton}>
          제출
        </button>
        <button onClick={close} className={styles.closeButton}>
          닫기
        </button>
      </div>
    </div>
  );
};

NicknameModal.propTypes = {
  close: PropTypes.func.isRequired,
};

export default NicknameModal;
