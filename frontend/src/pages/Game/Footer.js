// Footer.js
import React, { useState } from "react";
import styles from "./Footer.module.css";
import ItemButton from "./components/ItemButton";
import ActionButton from "./components/ActionButton";

import { useSpring, animated } from "@react-spring/web";
import { toggleInkSpraying } from "./slices/octopusSlice";
import { toggleChickenWalking } from "./slices/featureSlice";
import { useDispatch } from "react-redux";
import waterBalloonImage from "../../assets/images/waterBalloon.png"; // 물풍선 이미지 경로

const Footer = () => {
  const dispatch = useDispatch();
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
  const handleRun = () => {
    console.log("코드 실행");
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
          onClick={() => {}}
        />
        <ActionButton
          className={styles.button}
          color="#27ae60"
          text="코드 실행"
          onClick={() => {}}
        />
        <ActionButton
          className={styles.button}
          color="#e74c3c"
          text="코드 제출"
          onClick={() => {}}
        />
      </animated.div>
    </div>
  );
};

Footer.propTypes = {}; // 필요한 경우에만 prop-types를 추가

export default Footer;
