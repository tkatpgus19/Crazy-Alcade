import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./CreateRoomModal.module.css";

// CreateRoomModal 컴포넌트를 정의합니다.
const CreateRoomModal = ({ closeModal, createRoom }) => {
  // 방 정보를 담는 상태를 설정합니다.
  const [roomData, setRoomData] = useState({
    name: "",
    password: "",
    tier: "",
    problemNumber: "",
    timeLimit: "",
    languages: { java: false, python: false },
    codeReview: false,
  });

  // 입력값이 변경될 때 호출되는 핸들러 함수를 정의합니다.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomData({
      ...roomData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 폼을 제출할 때 호출되는 핸들러 함수를 정의합니다.
  const handleSubmit = () => {
    createRoom(roomData); // 방 만들기 함수 호출
    closeModal(); // 모달 닫기 함수 호출
  };

  // 렌더링 결과를 반환합니다.
  return (
    <div className={styles.createRoomModal}>
      <div className={styles.roomTitleContainer}>
        <div className={styles.roomTitle}>방 만들기</div>
      </div>
      {/* 방 이름 입력란 */}
      <label>방 이름:</label>
      <input
        type="text"
        name="name"
        value={roomData.name}
        onChange={handleChange}
      />

      {/* 비밀번호 입력란 */}
      <label>비밀번호:</label>
      <input
        type="password"
        name="password"
        value={roomData.password}
        onChange={handleChange}
      />

      {/* 티어 선택 드롭다운 */}
      <label>티어 선택:</label>
      <select name="tier" value={roomData.tier} onChange={handleChange}>
        <option value="">선택하세요</option>
        <option value="bronze">Bronze</option>
        <option value="silver">Silver</option>
        <option value="gold">Gold</option>
      </select>

      {/* 문제 번호 입력란 */}
      <label>문제 번호:</label>
      <input
        type="text"
        name="problemNumber"
        value={roomData.problemNumber}
        onChange={handleChange}
      />

      {/* 시간 제한 입력란 */}
      <label>시간 제한:</label>
      <input
        type="text"
        name="timeLimit"
        value={roomData.timeLimit}
        onChange={handleChange}
      />

      {/* 풀이 언어 체크박스 */}
      <label>풀이 언어:</label>
      <div className={styles.languageCheckbox}>
        <label>
          Java
          <input
            type="checkbox"
            name="languages"
            value="java"
            checked={roomData.languages.java}
            onChange={handleChange}
          />
        </label>
        <label>
          Python
          <input
            type="checkbox"
            name="languages"
            value="python"
            checked={roomData.languages.python}
            onChange={handleChange}
          />
        </label>
      </div>

      {/* 코드 리뷰 체크박스 */}
      <div>
        <label>코드 리뷰: </label>
        <div>
          <label>
            o
            <input
              type="checkbox"
              name="codeReviewApprove"
              checked={roomData.codeReviewApprove}
              onChange={handleChange}
            />
          </label>
          <label>
            x
            <input
              type="checkbox"
              name="codeReviewReject"
              checked={roomData.codeReviewReject}
              onChange={handleChange}
            />
          </label>
        </div>
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
