import React, { useState } from "react";
import imgfile from "../../assets/images/loginlogo.png";
import background from "../../assets/images/loginback.PNG";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./Login.module.css";
import styles from "./Login.module.css";

const Login = () => {
  // Kakao 로그인을 위한 상수들
  const KAKAO_REST_API_KEY = "e7b3942c338a483fd83097c16ceed087";
  const KAKAO_REDIRECT_URI =
    "http://192.168.123.109:3000/login/oauth2/code/kakao";
  const KAKAO_LINK = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

  // Kakao 로그인 핸들러
  const kakaoLoginHandler = () => {
    window.location.href = KAKAO_LINK;
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

      {/* Kakao 로그인 버튼 */}
      <button
        type="button"
        onClick={kakaoLoginHandler}
        className={`${styles.kakaoButton} `}
      >
        카카오 계정으로 로그인
      </button>

      {/* Google 로그인 버튼 */}
      <GoogleOAuthProvider clientId="1085234842575-i7dg223j28dr0dg5tvrhq85s560ue06h.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={(res) => {
            console.log(res);
            // Google 로그인 성공 시 추가 작업 수행
          }}
          onFailure={(err) => {
            console.log(err);
            // Google 로그인 실패 시 추가 작업 수행
          }}
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default Login;
