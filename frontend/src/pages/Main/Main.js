import React, { Component } from "react";
import imgfile from "../../assets/images/logo.png";
import background from "../../assets/images/mainback.png";
import "./Main.module.css";
import styles from "./Main.module.css";

class Main extends Component {
  render() {
    // 배경 이미지 스타일 정의
    const backgroundStyle = {
      backgroundImage: `url(${background})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      height: "740px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "space-between",
    };

    // 로고 이미지 스타일 정의
    const logoStyle = {
      // 로고에 대한 추가 스타일을 여기에 추가
    };

    return (
      <div className={styles.mainContainer} style={backgroundStyle}>
        {/* 왼쪽 부분 (my-page) */}
        <div className={styles.logo} style={logoStyle}>
          <img className={styles.logoImg} src={imgfile} alt="로고" />
        </div>

        <div className={styles.myPage}>
          {/* 이름 입력 칸 */}
          <div className={styles.nameInput}>
            <label htmlFor="name"></label>
            <input type="text" id="name" />
          </div>
          <br />

          {/* 사진 넣는 칸 */}
          <div className={styles.profilePicture}>
            <label htmlFor="profile-pic">프로필 사진</label>
            <input type="file" id={styles.profilePic} accept="image/*" />
          </div>

          {/* 소개 칸 */}
          <div className={styles.introduction}>
            <p>
              <div>Lv. </div>
              <div>경험치 </div>
              <div>코인</div>
            </p>
          </div>

          {/* 하단 흰색 네모 칸 4개 정렬 */}
          <div className={styles.whiteBoxes}>
            <div className={styles.whiteBox}></div>
            <div className={styles.whiteBox}></div>
            <div className={styles.whiteBox}></div>
            <div className={styles.whiteBox}></div>
          </div>

          <br />
          <br />

          {/* 마이페이지 파란색 네모 칸 */}
          <div className={styles.myPageBlueBox}>
            <p>마이페이지</p>
          </div>
        </div>

        {/* 오른쪽 부분 (right-side) */}
        <div className={styles.rightSide}>
          {/* 오른쪽 상단 버튼들 */}

          <button className={styles.introButton}>게임 소개</button>
          <button className={styles.logoutButton}>로그아웃</button>

          <br />
          <br />

          {/* ItemShop, CreateRoom 버튼 그룹 */}

          <button className={styles.itemShopButton}>아이템상점</button>
          <button className={styles.createRoomButton}>방만들기</button>

          {/* 방 목록 부분 */}
          <div className={styles.roomPage}>
            {/* 게임 대기 화면 방 */}
            <div className={styles.gameRoomList}>
              {/* 방 하나하나 */}
              <div className={styles.room}>
                {/* 방 안의 제목 */}
                <div className={styles.roomBlueBox}>
                  <p>너만 오면 고</p>
                </div>
                <div className={styles.playingText}> playing </div>
              </div>
              <div className={styles.room}>
                <div className={styles.roomBlueBox}>
                  <p>안들어오면 지상렬</p>
                </div>
                <div className={styles.playingText}> playing </div>
              </div>
              <div className={styles.room}>
                <div className={styles.roomBlueBox}>
                  <p>현직개발자</p>
                </div>
                <div className={styles.waitingText}> waiting </div>
              </div>
              <div className={styles.room}>
                <div className={styles.roomBlueBox}>
                  <p>방 이름을 꼭 지어야해?</p>
                </div>
                <div className={styles.playingText}> playing </div>
              </div>
            </div>
            <div className={styles.pageMove}></div>
          </div>

          {/* 채팅 부분 */}
          <div className={styles.chatPage}>
            <button className={styles.chatPageButton}>전체</button>
            <div className={styles.chatContent}>
              {/* 채팅 내용이 들어갈 부분 */}
            </div>
            {/* 새로운 부분 */}
            <div className={styles.scrollBar}></div>
            <div className={styles.chatInputContainer}>
              <input
                className={styles.chatInput}
                type="text"
                placeholder="채팅을 입력하세요"
              />
              <button className={styles.sendButton}>전송</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
