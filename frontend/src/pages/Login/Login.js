import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import imgfile from "../../assets/images/loginlogo.png";
import background from "../../assets/images/loginback.PNG";
import styles from "./Login.module.css";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const code = new URLSearchParams(location.search).get("code");
      if (code) {
        await fetchAccessToken(code);
      }
    };

    handleOAuthRedirect();
  }, [location]);

  const fetchAccessToken = async (code) => {
    try {
      // 서버에 코드를 보내고 액세스 토큰을 요청하는 URL과 방식을 확인하세요.
      const response = await fetch(process.env.REACT_APP_KAKAO_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      localStorage.setItem("loginResponse", JSON.stringify(data)); // 전체 데이터를 loginResponse라는 키로 저장

      if (!data || !data.result) {
        throw new Error("Invalid data from server");
      }

      // 필요한 값을 각각 저장
      localStorage.setItem("accessToken", data.result.accessToken);
      localStorage.setItem("memberId", data.result.memberId.toString());
      localStorage.setItem("isNew", data.result.new.toString());
      localStorage.setItem("isConnected", data.result.connected.toString());

      dispatch(loginSuccess(data.result));
      navigate("/main"); // useHistory의 history.push('/main') 대신 useNavigate를 사용
    } catch (error) {
      console.error("Failed to fetch access token:", error);
    }
  };

  const kakaoLoginHandler = () => {
    window.location.href = process.env.REACT_APP_KAKAO_URL;
  };

  const googleLoginHandler = () => {
    window.location.href = process.env.REACT_APP_GOOGLE_URL;
  };

  const navigateToMain = () => {
    navigate("/main");
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

  return (
    <div className={styles.loginmainContainer} style={backgroundStyle}>
      <div className={styles.loginlogo}>
        <img className={styles.loginlogoImg} src={imgfile} alt="로고" />
      </div>

      <button
        type="button"
        onClick={kakaoLoginHandler}
        className={`${styles.kakaoButton}`}
      >
        카카오 계정으로 로그인
      </button>

      <button
        type="button"
        onClick={googleLoginHandler}
        className={`${styles.googleButton}`}
      >
        구글 계정으로 로그인
      </button>

      {/* Add a new button for navigating to "/main" */}
      <button
        type="button"
        onClick={navigateToMain}
        className={`${styles.mainButton}`}
      >
        이동하기
      </button>
    </div>
  );
};

export default Login;
