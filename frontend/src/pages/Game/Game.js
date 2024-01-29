import React from "react";
import { Link } from "react-router-dom";
import { Counter } from "../../utils/counter/Counter";

import Header from "./Header"; // Header 컴포넌트의 경로에 맞게 수정하세요.
import VideoScreen from "./VideoScreen";
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
      <VideoScreen />
      <div>
        <Counter />
      </div>
    </div>
  );
}

export default Game;
