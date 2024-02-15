import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import imgfile from "../../assets/images/logo.png";
import background from "../../assets/images/mainback.png";
import googleProviderImg from "../../assets/images/googleProviderImg.png";
import kakaoProviderImg from "../../assets/images/kakaoProviderImg.png";
import styles from "./MyPage.module.css";

import profile1 from "../../assets/images/profile1.png";
import profile2 from "../../assets/images/profile2.png";
import profile3 from "../../assets/images/profile3.png";
import profile4 from "../../assets/images/profile4.png";
import profile5 from "../../assets/images/profile5.png";
import profile6 from "../../assets/images/profile6.png";
import profile7 from "../../assets/images/profile7.png";
import profile8 from "../../assets/images/profile8.png";
import profile9 from "../../assets/images/profile9.png";
import profile10 from "../../assets/images/profile10.png";

const MyPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState([]);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [provider, setProvider] = useState("");
  const [selectedLang, setSelectedLang] = useState("");

  const updatePreferLang = async (newLang) => {
    setSelectedLang(newLang);
    const accessToken = localStorage.getItem("accessToken"); // 액세스 토큰 가져오기
    if (!accessToken) {
      console.error("Access token not found.");
      return;
    }

    const newValue = newLang.toUpperCase();

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/members/lang`,
        {
          method: "PUT", // HTTP 메소드 설정
          headers: {
            Authorization: `Bearer ${accessToken}`, // Bearer 토큰을 헤더에 포함
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lang: newValue }), // 요청 본문에 닉네임 포함
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update Prefer Language.");
      }

      const data = await response.json();

      console.log("Prefer Language updated successfully: ", data);
    } catch (error) {
      console.error("Error updating Prefer Language: ", error);
    }
  };

  const getButtonClass = (language) => {
    return selectedLang === language
      ? `${styles.selectedButton}`
      : `${styles.langInput}`;
  };

  const profileImages = {
    "profile1.png": profile1,
    "profile2.png": profile2,
    "profile3.png": profile3,
    "profile4.png": profile4,
    "profile5.png": profile5,
    "profile6.png": profile6,
    "profile7.png": profile7,
    "profile8.png": profile8,
    "profile9.png": profile9,
    "profile10.png": profile10,
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/members/details`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        const {
          nickname,
          profile,
          email,
          provider,
          lang,
          successProblems,
          failProblems,
        } = response.data.result;

        // 프로필 사진들 중 DB에 담긴 사진으로 프로필 설정
        const profileImg = profileImages[profile];

        // if (provider === "GOOGLE") {
        //   provider = googleProviderImg;
        // } else {
        //   provider = kakaoProviderImg;
        // }

        setProfile(profileImg);
        setNickname(nickname);
        setEmail(email);
        setProvider(provider);
        setSelectedLang(lang);
      })
      .catch((error) => {
        console.log("오류!", error);
      });
  }, []);

  return (
    <div
      className={styles.mainContainer}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className={styles.header}>
        <div className={styles.logo}>
          <img src={imgfile} alt="로고" />
        </div>

        <button className={styles.exitButton} onClick={() => navigate("/main")}>
          뒤로 가기
        </button>
      </div>
      <br />{" "}
      <div className={styles.exContent}>
        <div className={styles.mypageContainer}>
          <div className={styles.mypageInfoButton}>마이페이지</div>
        </div>

        <div className={styles.inContent}>
          <div className={styles.leftInContent}>
            {/* 프로필 사진 입력 칸 */}
            <div className={styles.myPage}>
              <div className={styles.profilePicture}>
                {/* profile 상태가 이미지 URL을 담고 있다고 가정하고 img 태그로 이미지를 표시합니다. */}
                {profile && (
                  <img
                    src={profile}
                    alt="프로필"
                    className={styles.profileImage}
                  />
                )}
              </div>
              <div className={styles.nameInput}>{nickname}</div>
              <div className={styles.emailInput}>
                {/* <div className={styles.emailProvider}>
                  {provider && (
                    <img
                      src={provider}
                      alt="social"
                      className={styles.providerImage}
                    />
                  )}
                </div> */}
                <div>{email}</div>
              </div>
              <div className={styles.preferLangText}>
                <div>선호언어</div>
                <div className={styles.langButton}>
                  <button
                    className={getButtonClass("JAVA")}
                    onClick={() => updatePreferLang("JAVA")}
                  >
                    Java
                  </button>{" "}
                  <button
                    className={getButtonClass("PYTHON")}
                    onClick={() => updatePreferLang("PYTHON")}
                  >
                    Python
                  </button>{" "}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.rightInContent}>
            <div className={styles.solvedProblems}>푼 문제</div>
            <div className={styles.unsolvedProblems}>미해결 문제</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyPage;