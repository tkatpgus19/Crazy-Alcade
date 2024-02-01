// 로그인 컴포넌트 업데이트

import React, { Component } from "react";
import imgfile from "../../assets/images/loginlogo.png";
import background from "../../assets/images/loginback.PNG";
import NicknameModal from "./NicknameModal";
import "./Login.module.css";
import styles from "./Login.module.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isKakaoModalOpen: false,
      isGoogleModalOpen: false,
    };
  }

  openKakaoModal = () => {
    this.setState({ isKakaoModalOpen: true });
  };

  openGoogleModal = () => {
    this.setState({ isGoogleModalOpen: true });
  };

  closeModals = () => {
    this.setState({
      isKakaoModalOpen: false,
      isGoogleModalOpen: false,
    });
  };

  render() {
    const backgroundStyle = {
      backgroundImage: `url(${background})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      height: "740px",
      display: "flex",
      flexDirection: "column", // 수정: 세로 방향으로 정렬
      alignItems: "center", // 수정: 수직 가운데 정렬
    };

    // logoStyle 변수를 여기에 정의합니다.
    const logoStyle = {
      // 로고에 대한 추가적인 스타일을 필요에 따라 정의합니다.
    };

    return (
      <div className={styles.loginmainContainer} style={backgroundStyle}>
        {/* 로그인 내용은 여기에 넣으세요 */}
        <div className={styles.loginlogo} style={logoStyle}>
          <img className={styles.loginlogoImg} src={imgfile} alt="로고" />
        </div>

        {/* 카카오 로그인 버튼 */}
        <button onClick={this.openKakaoModal} className={styles.kakaoButton}>
          카카오로 로그인하기
        </button>

        {/* 구글 로그인 버튼 */}
        <button onClick={this.openGoogleModal} className={styles.googleButton}>
          구글로 로그인하기
        </button>

        {/* 모달 */}
        {this.state.isKakaoModalOpen && (
          <NicknameModal onClose={this.closeModals} />
        )}
        {this.state.isGoogleModalOpen && (
          <NicknameModal onClose={this.closeModals} />
        )}
      </div>
    );
  }
}

export default Login;
