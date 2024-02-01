// NicknameModal.js

import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./NicknameModal.module.css";

class NicknameModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: "",
    };
  }

  handleNicknameChange = (e) => {
    this.setState({ nickname: e.target.value });
  };

  handleSubmit = () => {
    alert(`닉네임 제출됨: ${this.state.nickname}`);
    this.props.onClose();
  };

  handleCancel = () => {
    // 추가: 취소 버튼 클릭 시 모달 닫기
    this.props.onClose();
  };

  render() {
    return (
      <div className={styles.modalContainer}>
        <div className={styles.modalContent}>
          <h2>닉네임을 입력하세요</h2>
          <input
            type="text"
            placeholder="닉네임"
            value={this.state.nickname}
            onChange={this.handleNicknameChange}
          />
          <div className={styles.buttonContainer}>
            <button onClick={this.handleSubmit}>제출</button>
            {/* 추가: 취소 버튼 */}
            <button onClick={this.handleCancel}>취소</button>
          </div>
        </div>
      </div>
    );
  }
}

NicknameModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default NicknameModal;
