// Footer.js
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

import styles from "./Footer.module.css";
import ItemButton from "./components/ItemButton";
import ActionButton from "./components/ActionButton";

import { useSpring, animated } from "@react-spring/web";
import { toggleInkSpraying, resetInkSpraying } from "./slices/octopusSlice";
import {
  resetChickenWalking,
  toggleChickenWalking,
} from "./slices/featureSlice";
import { setExecutionResult } from "./slices/executionResultSlice"; // 올바른 경로로 수정
import { setLoading } from "./slices/loadingSlice"; // 올바른 경로로 수정
import { toggleWebIDEFlip, resetWebIDEFlip } from "./slices/webIDESlice";
import {
  resetWaterBalloonAnimation,
  toggleWaterBalloonAnimation,
} from "./slices/waterBalloonSlice";
import { toggleShield, resetShield } from "./slices/animationControlSlice";

import octopusIcon from "../../assets/images/octopus.png";
import chickIcon from "../../assets/images/chick.png";
import balloonIcon from "../../assets/images/waterBalloon.png";
import magicIcon from "../../assets/images/magic.png";
import shieldIcon from "../../assets/images/shield.png";

import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const Footer = ({ roomInfo, userInfo }) => {
  const dispatch = useDispatch();

  const [isItem, setItem] = useState(false);
  const [currentItem, setCurrentItem] = useState(1);

  const code = useSelector((state) => state.code.content); // 코드 상태 선택
  const lang = useSelector((state) => state.code.lang); // 언어 상태 선택

  const isSprayingInk = useSelector((state) => state.octopus.isSprayingInk);
  const isChickenWalking = useSelector((state) => state.feature.chickenWalking);
  const isAnimating = useSelector((state) => state.waterBalloon.isAnimating);
  const isFlipped = useSelector((state) => state.webIDE.isFlipped); // 가정: webIDE 슬라이스에서 isFlipped 상태를 관리

  const client = useRef();

  useEffect(() => {
    if (roomInfo.roomType === "item") {
      setItem(true);
      console.log("아이템전입니다");
    }
    connectSession();
  }, []);

  const connectSession = () => {
    const socket = new SockJS(`${process.env.REACT_APP_SOCKET_URL}`);
    client.current = Stomp.over(socket);
    client.current.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    client.current.subscribe(`/sub/game/` + roomInfo.roomId, onStatusReceived);
  };

  const onStatusReceived = (payload) => {
    const data = JSON.parse(payload.body);
    console.log(
      `${data.nickname}이 ${data.victim}에게  ${data.itemNo}번 아이템 공격함`
    );
    // 공겨 당한 자가 나이면
    if (data.victim === localStorage.getItem("nickname")) {
      console.log(`나는 ${userInfo.nickname} 라서 ${data.victim}과 같아 아픔`);
      const item = data.itemNo;
      // 나한테 아이템 표시. // 쉴드는 따로
      if (item === 1) {
        if (!isSprayingInk) dispatch(toggleInkSpraying());
        setTimeout(() => {
          // 5초 후에 애니메이션 상태를 false로 설정하여 애니메이션 종료
          dispatch(resetInkSpraying());
        }, 5000);
      } else if (item === 2) {
        if (!isChickenWalking) dispatch(toggleChickenWalking());
        setTimeout(() => {
          // 5초 후에 애니메이션 상태를 false로 설정하여 애니메이션 종료
          dispatch(resetChickenWalking());
        }, 5000);
      } else if (item === 3) {
        if (!isAnimating) dispatch(toggleWaterBalloonAnimation(true)); // 애니메이션 시작

        setTimeout(() => {
          // 5초 후에 애니메이션 상태를 false로 설정하여 애니메이션 종료
          dispatch(resetWaterBalloonAnimation());
        }, 5000);
      } else if (item === 4) {
        dispatch(toggleWebIDEFlip());
        // setTimeout 콜백 내에서 isFlipped 상태를 확인
        setTimeout(() => {
          dispatch(resetWebIDEFlip());
        }, 5000); // 5000ms = 5초
      } else if (item === 5) {
        if (isSprayingInk == true) dispatch(toggleInkSpraying(false));
        if (isChickenWalking == true) dispatch(toggleChickenWalking(false));
        if (isAnimating == true) dispatch(toggleWaterBalloonAnimation(false));
        if (isFlipped == true) dispatch(toggleWebIDEFlip(false));
        dispatch(toggleShield());
        setTimeout(() => dispatch(resetShield()), 0); // 바로 상태를 리셋하여 다른 애니메이션에 영향을 주지 않음
      }
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  // 공격 API 전송
  const attackUser = (victim) => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/rooms/attack`, {
        roomId: roomInfo.roomId,
        nickname: userInfo.nickname,
        victim: victim,
        itemNo: currentItem,
      })
      .then((res) => {
        subItem(currentItem);
      })
      .catch((err) => console.log(err));
  };

  // 각 아이템의 개수를 itemId를 키로 하는 객체로 변환
  const itemCounts = userInfo.memberItemList.reduce((acc, item) => {
    acc[item.itemId] = item.memberItemCount;
    return acc;
  }, {});

  const animProps = useSpring({
    transform: isAnimating ? "translateY(-100px)" : "translateY(0px)",
    config: { duration: isAnimating ? 3000 : 300 },
  });

  useEffect(() => {
    console.log(`현재 선택 아이템은 ${currentItem}`);
  }, [currentItem]); // currentItem이 변경될 때마다 실행됨

  // 아이템 개수 감소 요청 API
  const subItem = async (item) => {
    //  여기에 API 요청 로직 추가
    try {
      const apiUrl = `${process.env.REACT_APP_BASE_URL}/items/members/sub`; // 환경변수나 상수로 API URL 관리
      const token = localStorage.getItem("accessToken");

      const response = await axios.put(
        apiUrl,
        {
          itemId: item,
          putValue: 1, // 아이템 개수 1 감소
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 요청 성공 시, 로직 처리 (예: 상태 업데이트)
      console.log("아이템 개수 감소 성공", response.data);
      // 아이템 개수 상태 업데이트 또는 부모 컴포넌트로부터 받은 함수 호출 등을 통해 UI를 업데이트할 수 있습니다.
    } catch (error) {
      console.error("아이템 사용 중 에러 발생", error);
    }
  };

  // 아이템 사용 함수
  const handleUseItem = async (item, itemCount) => {
    if (itemCount <= 0) {
      console.log("아이템이 없습니다.");
    } else {
      // 아이템이 있으면 상태에 현재 선택 아이템 저장.

      // 각 아이템에 대한 효과 로직 추가
      console.log(`아이템 사용: ${item}`);
      setCurrentItem(item);
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
    try {
      const apiUrl = `${process.env.REACT_APP_BASE_URL}/problems/${roomInfo.problemId}/codes/execute`;
      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        apiUrl,
        {
          lang: lang.toUpperCase(),
          content: code,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Bearer 토큰 방식을 사용하는 경우
            // Origin 헤더는 브라우저가 자동으로 설정하기 때문에 여기서 설정할 필요가 없습니다.
          },
        }
      );

      const data = response.data;
      console.log(data); // 실행 결과 처리
      dispatch(setExecutionResult(data)); // Redux 상태 업데이트
    } catch (error) {
      console.error("서버에서 문제가 발생했습니다.", error);
      // 오류가 발생했을 때 오류 메시지를 포함시켜 저장하는 것이 좋습니다.
      dispatch(setExecutionResult(error.message || "Error executing code."));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // 코드 제출 함수
  const handleSubmit = async () => {
    dispatch(setLoading(true)); // 로딩 상태를 true로 설정
    const token = localStorage.getItem("accessToken");
    const apiUrl = `${process.env.REACT_APP_BASE_URL}/problems/${roomInfo.problemId}/codes/submit`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Bearer 토큰 방식을 사용하는 경우
        },
        body: JSON.stringify({
          lang: lang.toUpperCase(), // 언어 설정
          content: code,
        }),
      });

      const data = await response.json();
      dispatch(setExecutionResult(data)); // 결과를 저장
      console.log(data);
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
        <div className={styles.itemHeader}>공격</div>
        {/* 각각의 아이템 버튼을 ItemButton 컴포넌트로 대체 */}
        {roomInfo.userList &&
          Object.values(roomInfo.userList).map((data, index) => {
            if (data != userInfo.nickname)
              return (
                <>
                  <button onClick={() => attackUser(data)}>{data}</button>
                </>
              );
          })}
      </div>
      {isItem && (
        <div className={styles.itemContainer}>
          <div className={styles.itemHeader}>내 아이템</div>
          {/* 각각의 아이템 버튼을 ItemButton 컴포넌트로 대체 */}
          <ItemButton
            icon={octopusIcon}
            itemName="문어"
            disabled={itemCounts[1] === 0} // itemId가 1인 아이템의 개수를 기반으로 비활성화 결정
            selected={currentItem == 1}
            onUseItem={() => handleUseItem(1, itemCounts[1])}
            count={itemCounts[1]}
          />
          <ItemButton
            icon={chickIcon}
            itemName="병아리"
            disabled={itemCounts[2] === 0} // itemId가 2인 아이템의 개수를 기반으로 비활성화 결정
            onUseItem={() => handleUseItem(2, itemCounts[2])}
            count={itemCounts[2]}
            selected={currentItem == 2}
          />
          <ItemButton
            icon={balloonIcon}
            itemName="물풍선"
            disabled={itemCounts[3] === 0} // itemId가 3인 아이템의 개수를 기반으로 비활성화 결정
            onUseItem={() => handleUseItem(3, itemCounts[3])}
            count={itemCounts[3]}
            selected={currentItem == 3}
          />
          <ItemButton
            icon={magicIcon}
            itemName="요술봉"
            disabled={itemCounts[4] === 0} // itemId가 4인 아이템의 개수를 기반으로 비활성화 결정
            onUseItem={() => handleUseItem(4, itemCounts[4])}
            count={itemCounts[4]}
            selected={currentItem == 4}
          />
          <ItemButton
            icon={shieldIcon}
            itemName="쉴드"
            disabled={itemCounts[5] === 0} // itemId가 5인 아이템의 개수를 기반으로 비활성화 결정
            onUseItem={() => handleUseItem(5, itemCounts[5])}
            count={itemCounts[5]}
            selected={currentItem == 5}
          />
        </div>
      )}
      {/* 액션 버튼들 */}
      <animated.div style={animProps} className={styles.buttonContainer}>
        {isAnimating && (
          <img
            src={balloonIcon}
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

Footer.propTypes = {
  roomInfo: PropTypes.object.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default Footer;
