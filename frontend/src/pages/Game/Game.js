import React from "react";
import { Link } from "react-router-dom";
import { Counter } from "../../utils/counter/Counter";

import Header from "./Header"; // Header 컴포넌트의 경로에 맞게 수정하세요.
//import VideoChat from "./VideoChat"; // VideoChat 컴포넌트의 경로에 맞게 수정하세요.
// import ChatBox from "./ChatBox"; // ChatBox 컴포넌트의 경로에 맞게 수정하세요.

function Game() {
  return (
    <div>
      <Header
        roomTitle="1. 너만 오면 고"
        language="Python"
        remainingTime={20} // 예시로 120초 설정
        onExitClick={() => alert("Exit clicked")}
      />
      <h1>게임 페이지입니다</h1>
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
      <div>
        <Counter />
      </div>
    </div>
  );
}

export default Game;
