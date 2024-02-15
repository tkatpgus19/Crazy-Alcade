import React, { Component } from "react";
import styles from "./Error.module.css";
import background from "../assets/images/mainback.png";

class ErrorPage extends Component {
  render() {
    return (
      <div className={styles.errorContainer}>
        <h1>ERROR</h1>
        <h3>페이지를 찾을 수 없습니다.</h3>
        <a href="./" className={styles.homeButton}>
          로그인 화면으로
        </a>
      </div>
    );
  }
}

export default ErrorPage;
