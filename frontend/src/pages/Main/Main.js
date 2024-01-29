import React, { Component } from "react";
import imgfile from "../../assets/images/logo.png";
import background from "../../assets/images/mainback.png";
import IntroLogout from "./IntroLogout";
import "./Main.css";

class Main extends Component {
  render() {
    // 배경 이미지 스타일 정의
    const backgroundStyle = {
      backgroundImage: `url(${background})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      height: "100vh",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "space-between",
    };

    return (
      <div className="main-container" style={backgroundStyle}>
        {/* 왼쪽 부분 (my-page) */}
        <div className="logo">
          <img className="logoimg" src={imgfile} alt="로고" />
        </div>
        <div className="my-page">
          {/* 이름 입력 칸 */}
          <div className="name-input">
            <label htmlFor="name"></label>
            <input type="text" id="name" />
          </div>
          <br />

          {/* 사진 넣는 칸 */}
          <div className="profile-picture">
            <label htmlFor="profile-pic">프로필 사진:</label>
            <input type="file" id="profile-pic" accept="image/*" />
          </div>

          <br />
          <br />
          <br />

          {/* 소개 칸 */}
          <div className="introduction">
            <p>
              <div>lv. </div>
              <div>경험치 </div>
              <div>코인</div>
            </p>
          </div>

          <br />
          {/* 하단 흰색 네모 칸 4개 정렬 */}
          <div className="white-boxes">
            <div className="white-box"></div>
            <div className="white-box"></div>
            <div className="white-box"></div>
            <div className="white-box"></div>
          </div>

          <br />
          <br />
          <br />
          <br />
          {/* 마이페이지 파란색 네모 칸 */}
          <div className="blue-box">
            <p>마이페이지</p>
          </div>
        </div>

        {/* 오른쪽 부분 (right-side) */}
        <div className="right-side">
          {/* 오른쪽 상단 버튼들 */}
          <div className="right-top-buttons">
            <button className="intrologout-button">게임 소개</button>
            <button className="intrologout-button">로그아웃</button>
          </div>

          <br />
          <br />

          {/* 오른쪽 하단 버튼들 */}
          <div className="right-bottom-buttons">
            <button className="itemshop-button">아이템 상점</button>
            <button className="createroom-button">방 만들기</button>
          </div>

          {/* 방 목록 부분 */}
          <div className="room-page">
            <div className="game-room-list">
              <div className="room">Room 1</div>
              <div className="room">Room 2</div>
              <div className="room">Room 3</div>
              <div className="room">Room 4</div>
            </div>
          </div>

          {/* 채팅 부분 */}
          <div className="chat-page"></div>

          {/* IntroLogout 컴포넌트 */}
          <IntroLogout />
        </div>
      </div>
    );
  }
}

export default Main;
