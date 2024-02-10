import React, { useState, useEffect } from "react";
import styles from "./Problem.module.css";
import PropTypes from "prop-types"; // prop-types 임포트

const Problem = ({ problemNo, problemTier }) => {
  const [problemData, setProblemData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const apiUrl = `${process.env.REACT_APP_BASE_URL}/problems/${problemNo}`;

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

const renderExamples = (examples) => {
  return (
    <div>
      {examples.map((example, index) => (
        <div key={index}>
          <h4>예제 {index + 1}</h4>
          <hr />
          <p>
            <strong>입력:</strong> {example.input}
          </p>

          <p>
            <strong>출력:</strong> {example.output}
          </p>
          <hr />
        </div>
      ))}
    </div>
  );
};

const renderProblem = (data) => {
  return (
    <div className={styles.problemBox}>
      <div className={styles.problem}>
        <h2>
          {data.no}. {data.title}
        </h2>
        <hr />

        <p>{data.description}</p>
        <hr />

        <h3>입력</h3>
        <p>{data.input}</p>
        <hr />

        <h3>출력</h3>
        <p>{data.output}</p>
        <hr />

        <h3>제한 시간</h3>
        <p>{data.time}</p>
        <hr />

        <h3>제한 메모리</h3>
        <p>{data.memory}</p>

        <hr />
        <h3>예제</h3>
        <hr />
        {renderExamples(data.examples)}
      </div>
    </div>
  );
};

Problem.propTypes = {
  problemNo: PropTypes.number.isRequired, // problemNo는 숫자이며 필수
  problemTier: PropTypes.string.isRequired, // problemTier는 문자열이지만 필수는 아님
};

export default Problem;
