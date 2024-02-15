import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styles from "./NicknameModal.module.css"; // 스타일시트 임포트

const NicknameModal = ({ close }) => {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  // 닉네임 업데이트 함수
  const updateNickname = async (newNickname) => {
    const accessToken = localStorage.getItem("accessToken"); // 액세스 토큰 가져오기
    if (!accessToken) {
      console.error("Access token not found.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/members/nickname`,
        {
          method: "PUT", // HTTP 메소드 설정
          headers: {
            Authorization: `Bearer ${accessToken}`, // Bearer 토큰을 헤더에 포함
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nickname: newNickname }), // 요청 본문에 닉네임 포함
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update nickname.");
      }

      const data = await response.json();

      console.log("Nickname updated successfully: ", data);

      // 업데이트 성공 후 로컬 스토리지에 닉네임 저장
      localStorage.setItem("nickname", newNickname);

      // 업데이트 성공 후 로직
      localStorage.setItem("isNew", "false"); // isNew 상태 업데이트
      close(); // 모달 닫기
      navigate("/main"); // 메인 페이지로 리디렉션
    } catch (error) {
      console.error("Error updating nickname: ", error);
    }
  };

  const handleSubmit = () => {
    console.log("닉네임 제출: ", nickname);
    // localStorage.setItem("isNew", "false");
    updateNickname(nickname); // 닉네임 업데이트 함수 호출
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
