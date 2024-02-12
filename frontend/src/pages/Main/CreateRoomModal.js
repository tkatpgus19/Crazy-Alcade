import React, { useState, useEffect } from "react";
import axios from "axios";
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
    problemTier: 0,
    problemNo: 0,
    timeLimit: 0,
    language: "java",
    codeReview: true,
    master: "",
  });

  const [problems, setProblems] = useState([]); // 문제 목록을 저장할 상태
  const [tiers, setTiers] = useState([]); // 티어 정보 상태 추가

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(
          "https://i10d104.p.ssafy.io/api/problems?tier-id=1"
        );
        // 'result' 배열을 상태에 저장
        setProblems(response.data.result);
      } catch (error) {
        console.error("문제 목록을 불러오는 데 실패했습니다.", error);
        setProblems([]); // 오류 발생 시 빈 배열 설정
      }
    };

    fetchProblems();

    // 티어 정보를 불러오는 함수
    const fetchTiers = async () => {
      try {
        const response = await axios.get(
          "https://i10d104.p.ssafy.io/api/tiers"
        );
        // API 응답에서 'result' 배열을 추출하여 'tiers' 상태에 설정
        setTiers(response.data.result || []); // 'result'가 없는 경우 빈 배열을 기본값으로 사용
      } catch (error) {
        console.error("티어 정보를 불러오는 데 실패했습니다.", error);
        setTiers([]); // 오류 발생 시 빈 배열 설정
      }
    };

    fetchTiers();
  }, []);

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
    console.log(roomData);
    createRoom(roomData); // 방 만들기 함수 호출
    closeModal(); // 모달 닫기 함수 호출

    // 방 만들기가 성공하면 "/room"으로 이동합니다.
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

      <div
        style={{
          background: "#00B9FF",
          border: "2px solid black",
          borderRadius: "8px",
        }}
      >
        {/* 방 타입 체크박스 */}
        <div
          className={`${styles.roomSectionTitle} ${styles.languageCheckbox}`}
        >
          <span>방 타입</span>
          노말전
          <input
            type="checkbox"
            name="roomType"
            value="normal"
            checked={roomData.roomType === "normal"}
            onChange={() => handleChangeRoomType("normal")}
          />
          아이템전
          <input
            type="checkbox"
            name="roomType"
            value="item"
            checked={roomData.roomType === "item"}
            onChange={() => handleChangeRoomType("item")}
          />
        </div>

        {/* 방 이름 입력란 */}
        <div className={`${styles.roomSectionTitle} ${styles.inputField}`}>
          <span>방 이름</span>
          <input
            type="text"
            name="roomName"
            value={roomData.name}
            onChange={handleChange}
          />
        </div>

        {/* 비밀번호 입력란 */}
        <div className={`${styles.roomSectionTitle} ${styles.inputField}`}>
          <span>비밀번호</span>
          <input
            type="checkbox"
            name="hasPassword"
            checked={roomData.hasPassword}
            onChange={handleChange}
          />
          {roomData.hasPassword && (
            <input
              type="password"
              name="roomPassword"
              value={roomData.password}
              onChange={handleChange}
            />
          )}
        </div>

        {/* 티어 선택 드롭다운 */}
        <div className={`${styles.roomSectionTitle} ${styles.inputField}`}>
          <span>티어 선택 : </span>
          <select
            name="problemTier"
            value={roomData.problemTier}
            onChange={handleChange}
          >
            <option value="">선택하세요</option>
            {tiers.map((tier, index) => (
              <option key={index} value={tier.tierId}>
                {tier.tierName}
              </option>
            ))}
          </select>
        </div>

        {/* 문제 번호 선택 드롭다운 */}
        <div className={`${styles.roomSectionTitle} ${styles.inputField}`}>
          <span>문제 이름 : </span>
          <select
            name="problemNo"
            value={roomData.problemNo}
            onChange={handleChange}
          >
            <option value="">문제를 선택하세요</option>
            {problems.map((problem, index) => (
              <option key={index} value={problem.problemId}>
                {problem.platform} {problem.no} {problem.title}
              </option>
            ))}
          </select>
        </div>

        {/* 시간 제한 드롭다운 */}
        <div className={`${styles.roomSectionTitle} ${styles.inputField}`}>
          <span>시간 제한</span>
          <input
            type="number"
            name="timeLimit"
            value={roomData.timeLimit}
            onChange={handleChange}
          />
        </div>

        {/* 풀이 언어 체크박스 */}
        <div
          className={`${styles.roomSectionTitle} ${styles.languageCheckbox}`}
        >
          <span>풀이 언어</span>
          Java
          <input
            type="checkbox"
            name="language"
            value="java"
            checked={roomData.language === "java"}
            onChange={() => handleChangeLanguage("java")}
          />
          Python
          <input
            type="checkbox"
            name="language"
            value="python"
            checked={roomData.language === "python"}
            onChange={() => handleChangeLanguage("python")}
          />
        </div>

        {/* 코드 리뷰 체크박스 */}
        <div
          className={`${styles.roomSectionTitle} ${styles.codeReviewCheckbox}`}
        >
          <span>코드 리뷰</span>
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
        </div>
      </div>

      {/* 추가적인 방 정보에 대한 유사한 입력 필드를 추가하세요 */}

      {/* 방 만들기 및 취소 버튼 */}
      <div className={styles.createActionButtons}>
        <button onClick={handleSubmit}>방 만들기</button>
        <button onClick={closeModal}>취소</button>
      </div>
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
