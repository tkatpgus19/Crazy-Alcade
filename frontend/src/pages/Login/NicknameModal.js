import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NicknameModal.module.css";

function NicknameCreation() {
  const [nickname, setNickname] = useState("");
  let navigate = useNavigate();

  const handleNicknameSubmit = () => {
    // 서버에 닉네임을 보내는 로직을 여기에 작성합니다
    console.log("닉네임이 제출되었습니다:", nickname);
    navigate("/main"); // 제출 후 메인 페이지로 이동
  };

  return (
    <div className={styles.nicknameContainer}>
      {/* 닉네임 입력을 위한 모달 표시 */}
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="닉네임을 입력하세요"
      />
      <button onClick={handleNicknameSubmit}>시작하기</button>
    </div>
  );
}

export default NicknameCreation;
