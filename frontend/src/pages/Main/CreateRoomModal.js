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
    problemId: 0,
    timeLimit: 60,
    language: "java",
    codeReview: true,
    master: "",
  });

  const [problems, setProblems] = useState([]); // 문제 목록을 저장할 상태
  const [tiers, setTiers] = useState([]); // 티어 정보 상태 추가

  // 티어 정보를 불러오는 함수
  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/tiers`
        );
        setTiers(response.data.result || []);
      } catch (error) {
        console.error("티어 정보를 불러오는 데 실패했습니다.", error);
        setTiers([]);
      }
    };
    fetchTiers();
  }, []);

  // 선택된 티어가 변경될 때마다 문제 목록을 불러오는 로직
  useEffect(() => {
    const fetchProblemsByTier = async () => {
      if (!roomData.problemTier) {
        setProblems([]);
        return;
      }
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/problems?tier-id=${roomData.problemTier}`
        );
        // '랜덤문제' 옵션을 문제 목록에 추가합니다.
        const randomProblemOption = {
          problemId: "random", // 랜덤 문제를 식별할 수 있는 고유 값
          title: "랜덤문제",
        };
        setProblems([randomProblemOption, ...(response.data.result || [])]);
      } catch (error) {
        console.error("문제 목록을 불러오는 데 실패했습니다.", error);
        setProblems([]);
      }
    };

    fetchProblemsByTier();
  }, [roomData.problemTier, tiers]); // tiers도 의존성 배열에 추가합니다.

  // 입력값이 변경될 때 호출되는 핸들러 함수를 정의합니다.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // 폼 제출 시 페이지 리로드 방지

    if (roomData.roomName.length === 0 || roomData.roomName.length > 10) {
      alert("방 이름은 최소 1자, 최대 10자 이내입니다.");
      return; // 함수 실행 종료
    }

    // 비밀번호 설정이 되어있고, 비밀번호 길이가 4자리가 아닌 경우 경고창 표시
    if (roomData.hasPassword && roomData.roomPassword.length !== 4) {
      alert("비밀번호는 4자리 숫자여야 합니다.");
      return; // 함수 실행 종료
    }

    // 티어 선택 검증
    if (!roomData.problemTier) {
      alert("티어를 선택해주세요.");
      return; // 함수 실행 종료
    }

    // 문제 번호 선택 검증
    if (!roomData.problemId) {
      alert("문제를 선택해주세요.");
      return; // 함수 실행 종료
    }

    // '랜덤문제' 옵션이 선택되었고 문제 목록이 존재하는 경우
    if (roomData.problemId === "random" && problems.length > 0) {
      // '랜덤문제'를 제외한 문제 목록에서 랜덤하게 하나를 선택합니다.
      // 이때, '랜덤문제' 자체는 문제 목록에 포함되지 않으므로, 모든 문제가 선택 대상이 됩니다.
      const randomIndex = Math.floor(Math.random() * problems.length);
      const randomProblem = problems[randomIndex];

      // 방을 만들기 전에 roomData 상태를 직접 수정하지 않고,
      // 선택된 랜덤 문제의 ID와 기타 필요한 정보를 createRoom 함수에 직접 전달합니다.
      createRoom({
        ...roomData,
        problemId: randomProblem.problemId, // 랜덤하게 선택된 문제의 ID
      });
    } else {
      // '랜덤문제'가 아닌 경우, 현재 roomData로 방을 생성합니다.
      createRoom(roomData);
    }

    closeModal(); // 모달 닫기 함수 호출
    // 여기에 방 만들기 성공 후의 로직 추가 (예: navigate("/room") 등)
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
      // 방 타입이 'item'일 경우 코드 리뷰를 false로 설정
      codeReview: type === "item" ? false : prevData.codeReview,
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
            minLength="1"
            maxLength="10"
            placeholder="1 ~ 10글자를 입력해주세요."
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
              maxLength="4"
              pattern="\d{4}"
              title="4자리 숫자를 입력해주세요."
              placeholder="4자리 숫자를 입력해주세요."
            />
          )}
        </div>

        {/* 티어 선택 드롭다운 */}
        <div className={`${styles.roomSectionTitle} ${styles.inputField}`}>
          <span>티어 선택</span>
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
          <span>문제 이름</span>
          <select
            name="problemId"
            value={roomData.problemId}
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

        {/* 시간 제한 슬라이더 */}
        <div className={`${styles.roomSectionTitle} ${styles.inputField}`}>
          <span>시간 제한</span>
          <input
            type="range"
            name="timeLimit"
            min="10"
            max="120"
            step="10"
            value={roomData.timeLimit}
            onChange={handleChange}
            className={styles.timeSlider} // 스타일을 적용하기 위한 클래스
          />
          <span>{roomData.timeLimit} 분</span> {/* 현재 선택된 시간을 표시 */}
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
          {/* Python
          <input
            type="checkbox"
            name="language"
            value="python"
            checked={roomData.language === "python"}
            onChange={() => handleChangeLanguage("python")}
          /> */}
        </div>

        {/* 코드 리뷰 체크박스 */}
        <div
          className={`${styles.roomSectionTitle} ${styles.codeReviewCheckbox}`}
        >
          <span>코드 리뷰</span>
          <input
            type="checkbox"
            name="codeReview"
            checked={roomData.codeReview}
            onChange={() => {
              // 방 타입이 'item'이 아닐 때만 코드 리뷰 상태를 변경할 수 있도록 함
              if (roomData.roomType !== "item") {
                setRoomData((prevData) => ({
                  ...prevData,
                  codeReview: !prevData.codeReview,
                }));
              }
            }}
            // 방 타입이 'item'일 경우 체크박스를 비활성화
            disabled={roomData.roomType === "item"}
          />
        </div>
      </div>

      {/* 추가적인 방 정보에 대한 유사한 입력 필드를 추가하세요 */}

      {/* 방 만들기 및 취소 버튼 */}
      <div className={styles.createActionButtons}>
        <button onClick={closeModal}>취소</button>
        <button onClick={handleSubmit}>방 만들기</button>
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
