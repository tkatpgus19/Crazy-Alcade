import React, { Component } from "react";
import { FaAngleDown } from "react-icons/fa"; // FontAwesome에서 FaAngleDown 가져오기
import imgfile from "../../assets/images/logo.png";
import background from "../../assets/images/mainback.png";
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

    // 로고 이미지 스타일 정의
    const logoStyle = {
      // 로고에 대한 추가 스타일을 여기에 추가
    };

    return (
      <div className="main-container" style={backgroundStyle}>
        {/* 왼쪽 부분 (my-page) */}
        <div className="logo" style={logoStyle}>
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
            <label htmlFor="profile-pic">프로필 사진</label>
            <input type="file" id="profile-pic" accept="image/*" />
          </div>

          {/* 소개 칸 */}
          <div className="introduction">
            <p>
              <div>Lv. </div>
              <div>경험치 </div>
              <div>코인</div>
            </p>
          </div>

          {/* 하단 흰색 네모 칸 4개 정렬 */}
          <div className="white-boxes">
            <div className="white-box"></div>
            <div className="white-box"></div>
            <div className="white-box"></div>
            <div className="white-box"></div>
          </div>

          <br />
          <br />

          {/* 마이페이지 파란색 네모 칸 */}
          <div className="mypage-blue-box">
            <p>마이페이지</p>
          </div>
        </div>

        {/* 오른쪽 부분 (right-side) */}
        <div className="right-side">
          {/* 오른쪽 상단 버튼들 */}

          <button className="intro-button">게임 소개</button>
          <button className="logout-button">로그아웃</button>

          <br />
          <br />

          {/* ItemShop, CreateRoom 버튼 그룹 */}

          <button className="itemshop-button">아이템 상점</button>
          <button className="createroom-button">방 만들기</button>

          {/* 방 목록 부분 */}
          <div className="room-page">
            {/* 게임 대기 화면 방 */}
            <div className="game-room-list">
              <div className="room">
                <div className="room-blue-box">
                  <p>너만 오면 고</p>
                </div>
              </div>
              <div className="room">Room 2</div>
              <div className="room">Room 3</div>
              <div className="room">Room 4</div>
            </div>
          </div>

          {/* 채팅 부분 */}
          <div className="chat-page"></div>
        </div>
      </div>
    );
  }
}

export default Main;
