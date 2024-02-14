import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import NicknameModal from "./NicknameModal";
import imgfile from "../../assets/images/loginlogo.png";
import background from "../../assets/images/loginback.PNG";
import styles from "./Login.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import kakaoImg from "../../assets/images/kakao_login_large_wide.png";
import googleImg from "../../assets/images/web_neutral_sq_ctn@2x.png";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const data = await fetchAccessToken(code); // fetchAccessToken 함수는 서버로부터 응답을 받아오는 함수

        // 로그인 성공 후 isNew 상태에 따라 조건부 리디렉션
        if (data && data.isNew) {
          setIsNicknameModalOpen(true); // isNew가 true면 모달을 열어 닉네임 설정 유도
        } else {
          navigate("/main"); // isNew가 false면 바로 메인 페이지로 이동
        }
      }
    };

    handleOAuthRedirect();
  }, [navigate]); // navigate를 의존성 배열에 추가

  useEffect(() => {
    // 페이지 로드 시 로컬 스토리지에서 'isNew' 값을 확인하여
    // 신규 사용자일 경우 닉네임 모달을 열어야 하는 로직
    const isNew = localStorage.getItem("isNew") === "true";
    if (isNew) {
      setIsNicknameModalOpen(true);
    }
  }, []); // 컴포넌트 마운트 시 실행되는 useEffect

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

      // 사용자가 새로운 사용자인지 확인 후 조건에 따라 페이지 이동
      if (data.result.isNew) {
        navigate("/nickname"); // 닉네임 생성 경로로 이동
      } else {
        navigate("/main"); // 메인 페이지로 이동
      }
    } catch (error) {
      console.error("액세스 토큰을 가져오는 데 실패했습니다:", error);
    }
  };

  const kakaoLoginHandler = () => {
    // window.location.href = process.env.REACT_APP_KAKAO_URL;
    window.location.replace(process.env.REACT_APP_KAKAO_URL);
  };

  const googleLoginHandler = () => {
    window.location.replace(process.env.REACT_APP_GOOGLE_URL);
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

      {isNicknameModalOpen && (
        <NicknameModal close={() => setIsNicknameModalOpen(false)} />
      )}
    </div>
  );
};

export default Login;
