// 로그인 컴포넌트 업데이트

import React, { useState } from "react";
import imgfile from "../../assets/images/loginlogo.png";
import background from "../../assets/images/loginback.PNG";
import NicknameModal from "./NicknameModal";
import "./Login.module.css";
import styles from "./Login.module.css";

const Login = () => {
  // useState 훅을 사용하여 상태를 선언합니다.
  const [isKakaoModalOpen, setKakaoModalOpen] = useState(false);
  const [isGoogleModalOpen, setGoogleModalOpen] = useState(false);

  const openKakaoModal = () => {
    setKakaoModalOpen(true);
  };

  const openGoogleModal = () => {
    setGoogleModalOpen(true);
  };

  const closeModals = () => {
    setKakaoModalOpen(false);
    setGoogleModalOpen(false);
  };

  const backgroundStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "740px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const logoStyle = {
    // 로고에 대한 추가적인 스타일을 필요에 따라 정의합니다.
  };

  return (
    <div className={styles.loginmainContainer} style={backgroundStyle}>
      {/* 로그인 내용은 여기에 넣으세요 */}
      <div className={styles.loginlogo} style={logoStyle}>
        <img className={styles.loginlogoImg} src={imgfile} alt="로고" />
      </div>

      {/* 카카오 로그인 버튼 */}
      <button onClick={openKakaoModal} className={styles.kakaoButton}>
        카카오로 로그인하기
      </button>

      {/* 구글 로그인 버튼 */}
      <button onClick={openGoogleModal} className={styles.googleButton}>
        구글로 로그인하기
      </button>

      {/* 모달 */}
      {isKakaoModalOpen && <NicknameModal onClose={closeModals} />}
      {isGoogleModalOpen && <NicknameModal onClose={closeModals} />}
    </div>
  );
};

export default Login;
