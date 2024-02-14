import React, { useState, useEffect } from "react";
import styles from "./Problem.module.css";
import PropTypes from "prop-types"; // prop-types 임포트
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faMicrochip } from "@fortawesome/free-solid-svg-icons";

const Problem = ({ problemId, problemTier }) => {
  const [problemData, setProblemData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      if (!problemData) {
        const apiUrl = `${process.env.REACT_APP_BASE_URL}/problems/${problemId}`;

        try {
          const response = await fetch(apiUrl);

          if (!response || !response.ok) {
            throw new Error("서버 응답이 올바르지 않습니다.");
          }

          const data = await response.json();
          setProblemData(data.result);
          setLoading(false);
        } catch (error) {
          console.error("데이터를 불러오는 중에 문제가 발생했습니다.", error);
          setProblemData(null);
          setLoading(false);
        }
      }

      getData();
    };
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!problemData) {
    return (
      <div className={styles.errorContainer}>
        <p>데이터를 불러오는 중에 문제가 발생했습니다.</p>
      </div>
    );
  }

  return renderProblem(problemData);
};

Problem.propTypes = {
  problemId: PropTypes.number.isRequired, // problemNo는 숫자이며 필수
  problemTier: PropTypes.string.isRequired, // problemTier는 문자열이지만 필수는 아님
};

export default Problem;
