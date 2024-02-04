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
import { isResultExpanded } from "./slices/executionResultSlice"; // 올바른 경로로 수정

import waterBalloonImage from "../../assets/images/waterBalloon.png"; // 물풍선 이미지 경로

const Footer = () => {
  const dispatch = useDispatch();
  const code = useSelector((state) => state.code.content); // 코드 상태 선택
  const lang = useSelector((state) => state.code.lang); // 언어 상태 선택

  const [isAnimating, setIsAnimating] = useState(false);

  // 애니메이션 상태에 따른 스프링 정의
  const animProps = useSpring({
    to: async (next, cancel) => {
      if (isAnimating) {
        await next({
          transform: "translateY(-100px)",
          config: { duration: 1000 },
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));

        await next({
          transform: "translateY(0px)",
          config: { duration: 300 },
        });
      }
    },
    from: { transform: "translateY(0px)" },
    reset: isAnimating,
    reverse: isAnimating,
    onRest: () => setIsAnimating(false),
  });

  // 아이템 사용 함수
  const handleUseItem = (item) => {
    console.log(`아이템 사용: ${item}`);

    // 각 아이템에 대한 효과 로직 추가
    if (item === "아이템1") {
      dispatch(toggleInkSpraying());
    } else if (item === "아이템2") {
      dispatch(toggleChickenWalking());
    } else if (item === "아이템3") {
      setIsAnimating(true);
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
  const handleSubmit = () => {
    console.log("코드 제출");
  };

  const springs = useSpring({
    from: { x: 0 },
    to: { x: 100 },
  });

  return (
    <div className={styles.footer}>
      {/* <animated.div
        style={{
          width: 80,
          height: 40,
          background: "#ff6d6d",
          borderRadius: 8,
          ...springs,
        }}
      /> */}
      {/* 내 아이템 영역 */}
      <div className={styles.itemContainer}>
        <div className={styles.itemHeader}>내 아이템</div>
        {/* 각각의 아이템 버튼을 ItemButton 컴포넌트로 대체 */}
        <ItemButton
          itemName="아이템1"
          onUseItem={() => handleUseItem("아이템1")}
        />
        <ItemButton
          itemName="아이템2"
          onUseItem={() => handleUseItem("아이템2")}
        />
        <ItemButton
          itemName="아이템3"
          onUseItem={() => handleUseItem("아이템3")}
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

Footer.propTypes = {}; // 필요한 경우에만 prop-types를 추가

export default Footer;
