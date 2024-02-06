import React from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import imgfile from "../../assets/images/loginlogo.png";
import background from "../../assets/images/loginback.PNG";
import "./Login.module.css";
import styles from "./Login.module.css";

const Login = () => {
  // Kakao 로그인 핸들러
  const dispatch = useDispatch();

  const kakaoLoginHandler = async () => {
    try {
      const response = await fetch(
        "http://i10d104.p.ssafy.io/oauth2/authorization/kakao"
      );
      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("서버에서 JSON 형식의 데이터를 반환하지 않았습니다.");
      }

      const data = await response.json();
      dispatch(loginSuccess(data)); // 로그인 성공 시 액션 디스패치
      console.log(response);
    } catch (error) {
      console.error("Kakao 로그인 중 오류 발생:", error);
      // 적절한 오류 처리
    }
  };

  // Google 로그인 핸들러
  const googleLoginHandler = () => {
    window.location.href =
      "http://192.168.100.147:8080/oauth2/authorization/google";
  };

  // 페이지 배경 스타일
  const backgroundStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "740px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  // 로고 스타일
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
      <button
        type="button"
        onClick={googleLoginHandler}
        className={`${styles.googleButton} `}
      >
        구글 계정으로 로그인
      </button>

      {/* Google 로그인 버튼을 사용할 경우 아래 주석 부분을 활성화하세요 */}
      {/* 
      <GoogleOAuthProvider clientId="YourGoogleClientId">
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
      */}
    </div>
  );
};

export default Login;
