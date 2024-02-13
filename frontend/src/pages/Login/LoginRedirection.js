import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function LoginRedirection() {
  const [searchParams] = useSearchParams();
  let navigate = useNavigate();

  useEffect(() => {
    async function getTokens() {
      // URL에서 각 매개변수 값을 가져옵니다.
      const accessToken = searchParams.get("access-token");
      const memberId = searchParams.get("member-id");
      const isNew = searchParams.get("is-new"); // 'isNew' 값 검색
      const isConnected = searchParams.get("is-connected");
      const nextPage = searchParams.get("next");

      console.log("accessToken", accessToken);
      console.log("memberId", memberId);
      console.log("isNew", isNew);
      console.log("isConnected", isConnected);
      console.log("nextPage", nextPage);

      // accessToken이 존재하면 로컬 스토리지에 저장
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("memberId", memberId);
        localStorage.setItem("isNew", isNew);
        localStorage.setItem("isConnected", isConnected);
      }

      // 로컬 스토리지에 accessToken이 저장되어 있다면, 사용자가 새로운지 여부에 따라 리디렉션
      if (localStorage.getItem("accessToken")) {
        if (isNew === "true") {
          // 'isNew'가 'true' 문자열인 경우
          navigate("/"); // 닉네임 생성 페이지로 이동
        } else {
          navigate("/main"); // 메인 페이지로 이동
        }
      } else {
        navigate("/"); // 로그인 페이지로 다시 이동
      }
    }

    getTokens();
  }, [searchParams, navigate]); // useEffect 의존성 배열에 searchParams와 navigate 추가

  return <div>로그인 중입니다...</div>;
}

export default LoginRedirection;
