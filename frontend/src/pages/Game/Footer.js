// Footer.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./Footer.module.css";
import ItemButton from "./components/ItemButton";
import ActionButton from "./components/ActionButton";

import { useSpring, animated } from "@react-spring/web";
import { toggleInkSpraying } from "./slices/octopusSlice";
import { toggleChickenWalking } from "./slices/featureSlice";
import { setExecutionResult } from "./slices/executionResultSlice"; // 올바른 경로로 수정
import { setLoading } from "./slices/loadingSlice"; // 올바른 경로로 수정
import { toggleWebIDEFlip } from "./slices/webIDESlice";
import { toggleWaterBalloonAnimation } from "./slices/waterBalloonSlice";
import { toggleShield, resetShield } from "./slices/animationControlSlice";

import waterBalloonImage from "../../assets/images/waterBalloon.png"; // 물풍선 이미지 경로

const Footer = () => {
  const code = useSelector((state) => state.code.content); // 코드 상태 선택
  const lang = useSelector((state) => state.code.lang); // 언어 상태 선택

  const dispatch = useDispatch();
  const isAnimating = useSelector((state) => state.waterBalloon.isAnimating);
  const isFlipped = useSelector((state) => state.webIDE.isFlipped); // 가정: webIDE 슬라이스에서 isFlipped 상태를 관리

  const animProps = useSpring({
    transform: isAnimating ? "translateY(-100px)" : "translateY(0px)",
    config: { duration: isAnimating ? 3000 : 300 },
  });

  // 아이템 사용 함수
  const handleUseItem = (item) => {
    console.log(`아이템 사용: ${item}`);

    // 각 아이템에 대한 효과 로직 추가
    if (item === "아이템1") {
      dispatch(toggleInkSpraying());

      setTimeout(() => {
        dispatch(toggleInkSpraying());
      }, 5000); // 5000ms = 5초
    } else if (item === "아이템2") {
      dispatch(toggleChickenWalking());

      setTimeout(() => {
        dispatch(toggleChickenWalking());
      }, 5000); // 5000ms = 5초
    } else if (item === "아이템3") {
      dispatch(toggleWaterBalloonAnimation(true)); // 애니메이션 시작

      setTimeout(() => {
        // 5초 후에 애니메이션 상태를 false로 설정하여 애니메이션 종료
        dispatch(toggleWaterBalloonAnimation(false));
      }, 5000);
    } else if (item === "아이템4") {
      dispatch(toggleWebIDEFlip());
      // setTimeout 콜백 내에서 isFlipped 상태를 확인
      setTimeout(() => {
        if (!isFlipped) dispatch(toggleWebIDEFlip());
      }, 5000); // 5000ms = 5초
    } else if (item === "아이템5") {
      if (isFlipped) dispatch(toggleWebIDEFlip());
      dispatch(toggleShield());
      setTimeout(() => dispatch(resetShield()), 0); // 바로 상태를 리셋하여 다른 애니메이션에 영향을 주지 않음
    }
  };

  // 임시 저장 함수
  const handleSave = () => {
    console.log("임시 저장");
  };

  // 코드 실행 함수
  const handleRun = async () => {
    dispatch(setLoading(true)); // 로딩 시작
    console.log("코드 실행");

    const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/problems/1/codes/execute`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lang: lang,
        content: code,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data); // 실행 결과 처리
      dispatch(setExecutionResult(data)); // Redux 상태 업데이트
    } else {
      // 오류 처리
      console.error("서버에서 문제가 발생했습니다.");
      dispatch(setExecutionResult("Error executing code.")); // 오류 메시지 저장
    }
    // API 요청이 완료된 후 로딩 상태를 false로 설정
    dispatch(setLoading(false));
  };

  // 코드 제출 함수
  const handleSubmit = async () => {
    dispatch(setLoading(true)); // 로딩 상태를 true로 설정
    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/problems/1/codes/submit`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lang: lang, // 언어 설정
          content: code,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setExecutionResult(data)); // 결과를 저장
      } else {
        console.error("서버에서 문제가 발생했습니다.");
        dispatch(setExecutionResult({ message: "Error submitting code." })); // 오류 메시지 저장
      }
    } catch (error) {
      console.error("요청 처리 중 에러 발생:", error);
      dispatch(setExecutionResult({ message: "Error submitting code." }));
    } finally {
      dispatch(setLoading(false)); // 로딩 상태를 false로 설정
    }
  };

  return (
    <div className={styles.footer}>
      {/* 내 아이템 영역 */}
      <div className={styles.itemContainer}>
        <div className={styles.itemHeader}>내 아이템</div>
        {/* 각각의 아이템 버튼을 ItemButton 컴포넌트로 대체 */}
        <ItemButton
          itemName="문어"
          onUseItem={() => handleUseItem("아이템1")}
        />
        <ItemButton
          itemName="병아리"
          onUseItem={() => handleUseItem("아이템2")}
        />
        <ItemButton
          itemName="물풍선"
          onUseItem={() => handleUseItem("아이템3")}
        />
        <ItemButton
          itemName="요술봉"
          onUseItem={() => handleUseItem("아이템4")}
        />
        <ItemButton
          itemName="쉴드"
          onUseItem={() => handleUseItem("아이템5")}
        />
      </div>
      {/* 액션 버튼들 */}
      <animated.div style={animProps} className={styles.buttonContainer}>
        {isAnimating && (
          <img
            src={waterBalloonImage}
            alt="Water Balloon"
            className={styles.waterBalloon}
          />
        )}
        <ActionButton
          className={styles.button}
          color="#3498db"
          text="임시 저장"
          onClick={handleSave}
        />
        <ActionButton
          className={styles.button}
          color="#27ae60"
          text="코드 실행"
          onClick={handleRun}
        />
        <ActionButton
          className={styles.button}
          color="#e74c3c"
          text="코드 제출"
          onClick={handleSubmit}
        />
      </animated.div>
    </div>
  );
};

export default Footer;
