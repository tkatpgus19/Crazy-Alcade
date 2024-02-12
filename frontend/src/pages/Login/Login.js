import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import imgfile from "../../assets/images/loginlogo.png";
import background from "../../assets/images/loginback.PNG";
import styles from "./Login.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import kakaoImg from "../../assets/images/kakao_login_large_wide.png";
import googleImg from "../../assets/images/web_neutral_sq_ctn@2x.png";

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

    // 쿠키를 확인하여 리다이렉션 처리하는 로직 추가
    const checkRedirectCookie = () => {
      const cookies = document.cookie.split("; ").reduce((acc, current) => {
        const [key, value] = current.split("=");
        acc[key] = value;
        return acc;
      }, {});

      const nextUrl = cookies["next"]; // 쿠키에서 리다이렉션할 URL을 담고 있는 'next' 키 확인
      if (nextUrl) {
        navigate(nextUrl); // useNavigate 훅을 사용하여 해당 URL로 리다이렉트
      }
    };

    checkRedirectCookie();
  }, [location, navigate]); // navigate 함수를 의존성 배열에 추가

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
    // window.location.href = process.env.REACT_APP_KAKAO_URL;
    window.location.replace(
      "http://172.30.1.11:8081/oauth2/authorization/kakao?redirect_uri=http://localhost:3000/login-redirection&mode=login"
    );
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
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  return (
    <div className={styles.loginmainContainer} style={backgroundStyle}>
      <div className={styles.loginlogo}>
        <img className={styles.loginlogoImg} src={imgfile} alt="로고" />
      </div>

      <div className={styles.kakaoLogin} onClick={kakaoLoginHandler}>
        <img src={kakaoImg} width={"300px"} />
      </div>

      <div className={styles.googleLogin} onClick={googleLoginHandler}>
        <img src={googleImg} width={"300px"} style={{ borderRadius: "7px" }} />
      </div>

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
