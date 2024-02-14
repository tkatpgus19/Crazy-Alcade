import React, { useEffect, useState, useRef } from "react";

import NicknameModal from "./NicknameModal";
import imgfile from "../../assets/images/loginlogo.png";
import background from "../../assets/images/loginback.PNG";
import styles from "./Login.module.css";

import kakaoImg from "../../assets/images/kakao_login_large_wide.png";
import googleImg from "../../assets/images/web_neutral_sq_ctn@2x.png";
import roomBackgroundMusicLogin from "../../assets/music/login.mp3";
import cloudImage1 from "../../assets/images/cloud1.png";
import cloudImage2 from "../../assets/images/cloud2.png";

const Login = () => {
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [showLoginButtons, setShowLoginButtons] = useState(false); // 로그인 버튼 표시 상태 관리
  const audioRef = useRef(new Audio(roomBackgroundMusicLogin));

  useEffect(() => {
    // 오디오 객체 생성 및 설정
    audioRef.current = new Audio(roomBackgroundMusicLogin);
    // 컴포넌트 언마운트 시 오디오 정지
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleStartClick = () => {
    setShowLoginButtons(true); // 로그인 버튼 표시
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("배경음악 재생에 실패했습니다: ", error);
      });
    }
  };

  useEffect(() => {
    const checkNew = localStorage.getItem("isNew");

    if (checkNew === "true") {
      setIsNicknameModalOpen(true);
    }
  }, []);

  const kakaoLoginHandler = () => {
    // window.location.href = process.env.REACT_APP_KAKAO_URL;
    window.location.replace(process.env.REACT_APP_KAKAO_URL);
  };

  const googleLoginHandler = () => {
    window.location.replace(process.env.REACT_APP_GOOGLE_URL);
  };

  const backgroundStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  return (
    <div className={styles.loginmainContainer} style={backgroundStyle}>
      <img
        src={cloudImage1}
        alt="Cloud"
        className={styles.cloud}
        style={{ left: "10%" }}
      />
      <img
        src={cloudImage2}
        alt="Cloud"
        className={styles.cloud}
        style={{ left: "30%" }}
      />

      <img
        src={cloudImage1}
        alt="Cloud"
        className={styles.cloud}
        style={{ left: "20%" }}
      />

      <img
        src={cloudImage1}
        alt="Cloud"
        className={styles.cloud}
        style={{ left: "0%" }}
      />

      <img
        src={cloudImage2}
        alt="Cloud"
        className={styles.cloud}
        style={{ left: "60%" }}
      />

      <img
        src={cloudImage2}
        alt="Cloud"
        className={styles.cloud}
        style={{ left: "76%" }}
      />

      <img
        src={cloudImage1}
        alt="Cloud"
        className={styles.cloud}
        style={{ left: "-30%" }}
      />

      <img
        src={cloudImage2}
        alt="Cloud"
        className={styles.cloud}
        style={{ left: "-45%" }}
      />

      <div className={styles.loginlogo}>
        <img className={styles.loginlogoImg} src={imgfile} alt="로고" />
      </div>

      {!showLoginButtons && (
        <button onClick={handleStartClick} className={styles.startButton}>
          Press Start
        </button>
      )}

      {showLoginButtons && (
        <>
          <div className={styles.kakaoLogin} onClick={kakaoLoginHandler}>
            <img src={kakaoImg} width={"300px"} />
          </div>
          <div className={styles.googleLogin} onClick={googleLoginHandler}>
            <img
              src={googleImg}
              width={"300px"}
              style={{ borderRadius: "7px" }}
            />
          </div>
        </>
      )}

      {isNicknameModalOpen && (
        <NicknameModal close={() => setIsNicknameModalOpen(false)} />
      )}
    </div>
  );
};

export default Login;
