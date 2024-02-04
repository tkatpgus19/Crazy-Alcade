import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom"; // React Router v6에서는 useHistory 대신 useNavigate를 사용
import styles from "./CreateRoomModal.module.css";

// CreateRoomModal 컴포넌트 정의
const CreateRoomModal = ({ closeModal, createRoom }) => {
  // useNavigate 훅을 사용하여 navigate 함수를 얻습니다.
  const navigate = useNavigate();

  // 방 정보를 담는 상태를 설정합니다.
  const [roomData, setRoomData] = useState({
    roomType: "normal",
    roomName: "",
    hasPassword: false,
    roomPassword: "",
    problemTier: "",
    problemNo: "",
    timeLimit: "",
    language: "java",
    codeReview: true,
    master: "김진영",
  });

  // 입력값이 변경될 때 호출되는 핸들러 함수를 정의합니다.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 폼을 제출할 때 호출되는 핸들러 함수를 정의합니다.
  const handleSubmit = () => {
    createRoom(roomData); // 방 만들기 함수 호출
    closeModal(); // 모달 닫기 함수 호출

    // 방 만들기가 성공하면 "/room"으로 이동합니다.
    navigate("/room");
  };

  // 풀이 언어 변경 핸들러 함수
  const handleChangeLanguage = (selectedLanguage) => {
    setRoomData((prevData) => ({
      ...prevData,
      language: selectedLanguage,
    }));
  };

  // 방 타입 토글 함수
  const handleChangeRoomType = (type) => {
    setRoomData((prevData) => ({
      ...prevData,
      roomType: type,
    }));
  };

  // 렌더링 결과를 반환합니다.
  return (
    <div className={styles.createRoomModal}>
      <div className={styles.roomTitleContainer}>
        <div className={styles.roomTitle}>방 만들기</div>
      </div>

      {/* 방 타입 체크박스 */}
      <div className={styles.roomSectionTitle}>방 타입:</div>
      <div className={styles.languageCheckbox}>
        <label>
          노말전
          <input
            type="checkbox"
            name="roomType"
            value="normal"
            checked={roomData.roomType === "normal"}
            onChange={() => handleChangeRoomType("normal")}
          />
        </label>
        <label>
          아이템전
          <input
            type="checkbox"
            name="roomType"
            value="item"
            checked={roomData.roomType === "item"}
            onChange={() => handleChangeRoomType("item")}
          />
        </label>
      </div>

      {/* 방 이름 입력란 */}
      <div className={styles.roomSectionTitle}>방 이름:</div>
      <input
        type="text"
        name="roomName"
        value={roomData.name}
        onChange={handleChange}
      />

      {/* 비밀번호 입력란 */}
      <div className={styles.roomSectionTitle}>
        <label>
          비밀번호:
          <input
            type="checkbox"
            name="hasPassword"
            checked={roomData.hasPassword}
            onChange={handleChange}
          />
        </label>
      </div>
      {roomData.hasPassword && (
        <input
          type="password"
          name="roomPassword"
          value={roomData.password}
          onChange={handleChange}
        />
      )}

      {/* 티어 선택 드롭다운 */}
      <div className={styles.roomSectionTitle}>티어 선택:</div>
      <select name="problemTier" value={roomData.tier} onChange={handleChange}>
        <option value="">선택하세요</option>
        <option value="bronze">Bronze</option>
        <option value="silver">Silver</option>
        <option value="gold">Gold</option>
      </select>

      {/* 문제 번호 입력란 */}
      <div className={styles.roomSectionTitle}>문제 번호:</div>
      <input
        type="text"
        name="problemNo"
        value={roomData.problemNumber}
        onChange={handleChange}
      />

      {/* 시간 제한 드롭다운 */}
      <div className={styles.roomSectionTitle}>시간 제한:</div>
      <select
        name="timeLimit"
        value={roomData.timeLimit}
        onChange={handleChange}
      >
        <option value="">선택하세요</option>
        <option value="1h">1시간</option>
        <option value="1h30m">1시간 30분</option>
        <option value="2h">2시간</option>
        <option value="2h30m">2시간 30분</option>
      </select>

      {/* 풀이 언어 체크박스 */}
      <div className={styles.roomSectionTitle}>풀이 언어:</div>
      <div className={styles.languageCheckbox}>
        <label>
          Java
          <input
            type="checkbox"
            name="language"
            value="java"
            checked={roomData.language === "java"}
            onChange={() => handleChangeLanguage("java")}
          />
        </label>
        <label>
          Python
          <input
            type="checkbox"
            name="language"
            value="python"
            checked={roomData.language === "python"}
            onChange={() => handleChangeLanguage("python")}
          />
        </label>
      </div>

      {/* 코드 리뷰 체크박스 */}
      <div className={styles.roomSectionTitle}>코드 리뷰:</div>
      <div className={styles.codeReviewCheckbox}>
        <label>
          o
          <input
            type="checkbox"
            name="codeReview"
            checked={roomData.codeReview}
            onChange={() =>
              setRoomData((prevData) => ({
                ...prevData,
                codeReview: !prevData.codeReview,
              }))
            }
          />
        </label>
        <label>
          x
          <input
            type="checkbox"
            name="codeReviewReject"
            checked={!roomData.codeReview}
            onChange={() =>
              setRoomData((prevData) => ({
                ...prevData,
                codeReview: !prevData.codeReview,
              }))
            }
          />
        </label>
      </div>

      {/* 추가적인 방 정보에 대한 유사한 입력 필드를 추가하세요 */}

      {/* 방 만들기 및 취소 버튼 */}
      <button onClick={handleSubmit}>방 만들기</button>
      <button onClick={closeModal}>취소</button>
    </div>
  );
};

// 속성 검증을 통해 부모 컴포넌트로부터 전달받은 함수들이 올바른지 확인합니다.
CreateRoomModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  createRoom: PropTypes.func.isRequired,
};

// CreateRoomModal 컴포넌트를 내보냅니다.
export default CreateRoomModal;
