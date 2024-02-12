// // KakaoRedirection.js

// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const KakaoRedirection = () => {
//   // 1. URL에서 "code" 파라미터를 추출하여 코드에 저장
//   const code = new URL(window.location.href).searchParams.get("code");
//   // 2. 페이지 리다이렉션을 위한 navigate 함수 가져오기
//   const navigate = useNavigate();

//   useEffect(() => {
//     // 3. Kakao OAuth 엔드포인트로 코드를 전송하여 사용자 정보를 받아오기
//     axios
//       .get(`http://192.168.123.111:8080/login/oauth2/code/kakao?code=${code}`)
//       .then((response) => {
//         // 4. 받아온 데이터를 콘솔에 출력 (사용자 정보 확인용)
//         console.log(response.data);
//         // 5. 받아온 사용자 정보 중에서 이름만을 로컬 스토리지에 저장
//         localStorage.setItem("name", response.data.user_name); // 이름만 저장 (토큰 등 다른 정보도 저장 가능)
//         // 6. 로그인 성공 후 "/" 경로로 페이지 리다이렉션
//         navigate("/test");
//       })
//       .then((res) => console.log(res))
//       .catch((err) => {
//         // 7. 요청이 실패한 경우 에러 메시지를 콘솔에 출력
//         console.log("에러났음ㅋㅋ" + err);
//       });
//   }, [code, navigate]);

//   // 8. Kakao 로그인 성공 시 화면에 표시할 UI 구현
//   return <div>Kakao 로그인 성공화면.</div>;
// };

// export default KakaoRedirection;
