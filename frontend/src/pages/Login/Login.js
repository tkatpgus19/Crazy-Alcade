import React from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div>
      <h1>로그인 페이지입니다</h1>
      <ul>
        <li>
          <Link to="/">메인화면</Link>
        </li>
        <li>
          <Link to="/login">로그인화면</Link>
        </li>
        <li>
          <Link to="/room">대기화면</Link>
        </li>
        <li>
          <Link to="/game">게임화면</Link>
        </li>
      </ul>
    </div>
  );
}

export default Login;
