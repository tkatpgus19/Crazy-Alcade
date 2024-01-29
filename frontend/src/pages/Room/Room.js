import React from "react";
import Background from "../../components/Background";
import RoomHeader from "./RoomHeader";
import RoomHeader2 from "./RoomHeader2";
import GrayBox from "../../components/graybox/GrayBox";
import BlueBox from "./BlueBox";
import ChatBox from "./ChatBox";
import MiniBox from "./MiniBox";
import StartButton from "./Start";
import "./RoomRight.css"; // CSS 파일 import
import ThreeButton from "./ThreeButton";
import "./RoomLeft.css";

const Room = () => {
  return (
    <Background>
      <RoomHeader roomTitle="1. 너만 오면 고" />
      <RoomHeader2
        gametitle="1557. 왜 이렇게 빨리 끝나나요"
        onExitClick={() => alert("Exit clicked")}
      />
      <GrayBox>
        <BlueBox>
          <div className="three-box-container">
            <MiniBox />
            <MiniBox />
            <MiniBox />
          </div>
          <div className="three-box-container">
            <MiniBox />
            <MiniBox />
            <MiniBox />
          </div>
        </BlueBox>
        <div className="chat-start-container">
          <ChatBox></ChatBox>
          <div className="button-container">
            <StartButton />
            <div className="three-button-container">
              <ThreeButton>버튼1</ThreeButton>
              <ThreeButton>버튼2</ThreeButton>
              <ThreeButton>버튼3</ThreeButton>
            </div>
          </div>
        </div>
      </GrayBox>
    </Background>
  );
};

export default Room;
