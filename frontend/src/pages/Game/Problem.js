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
    };

    getData();
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

const renderProblem = (data) => {
  console.log(data.description);

  return (
    <div className={styles.problemBox}>
      <div className={styles.problem}>
        <div className={styles.stickyHeader}>
          <h2>
            {data.no}. {data.title}
          </h2>
          <div className={styles.limitsContainer}>
            <div className={styles.limit}>
              <FontAwesomeIcon icon={faClock} /> <span>{data.time}</span>
            </div>
            <div className={styles.limit}>
              <FontAwesomeIcon icon={faMicrochip} /> <span>{data.memory}</span>
            </div>
          </div>
        </div>
        <hr />
        <h3>문제</h3>
        <p style={{ whiteSpace: "pre-wrap" }}>{data.description}</p>
        <hr />
        <h3>입력</h3>
        <p>{data.input}</p>
        <hr />
        <h3>출력</h3>
        <p>{data.output}</p>

        <hr />
        <h3>예제</h3>
        <div className={styles.examplesContainer}>
          {data.examples &&
            data.examples.map((example, index) => (
              <div key={index} className={styles.exampleRow}>
                <div className={styles.exampleBlock}>
                  <h4>예제 입력 {index + 1}</h4>
                  <pre className={styles.exampleContent}>{example.input}</pre>
                </div>
                <div className={styles.exampleBlock}>
                  <h4>예제 출력 {index + 1}</h4>
                  <pre className={styles.exampleContent}>{example.output}</pre>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

Problem.propTypes = {
  problemId: PropTypes.number.isRequired, // problemNo는 숫자이며 필수
  problemTier: PropTypes.string.isRequired, // problemTier는 문자열이지만 필수는 아님
};

export default Problem;
