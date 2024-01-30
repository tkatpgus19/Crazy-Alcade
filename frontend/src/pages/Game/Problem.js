// ProblemArea.js

import React, { useState, useEffect } from "react";
import styles from "./Problem.module.css";

const Problem = () => {
  const [problemData, setProblemData] = useState(null);
  const getData = async () => {
    const response = await fetch("http://192.168.100.60:8080/problems/1")
      .then((response) => response.json())
      .then((data) => setProblemData(data.result))
      .catch((error) => console.error("Error fetching problem:", error));
    console.log(data);
  };

  useEffect(() => {
    getData();
  }, []);

  // 더미 데이터
  const dummyData = {
    problemId: 1,
    tier: "BRONZE",
    platform: "BOJ",
    no: 1000,
    title: "더미 맨",
    description: "더미 맨은 무적이다",
    input: "SAY HO~",
    output: "HO~",
    time: "1초",
    memory: "1MB",
    examples: [
      {
        input: "4 2",
        output: "6",
      },
      {
        input: "7 2",
        output: "9",
      },
    ],
  };

  if (!problemData) {
    // Loading 중일 때 더미 데이터 사용
    return renderProblem(dummyData);
  }

  const {
    problemId,
    tier,
    no,
    title,
    description,
    input,
    output,
    time,
    memory,
    examples,
  } = problemData;

  return renderProblem({
    problemId,
    tier,
    title,
    no,
    description,
    input,
    output,
    time,
    memory,
    examples,
  });
};

const renderTierIcon = (tier) => {
  switch (tier) {
    case "BRONZE":
      return <BronzeIcon />;
    case "SILVER":
      return <SilverIcon />;
    case "GOLD":
      return <GoldIcon />;
    default:
      return null;
  }
};

const BronzeIcon = () => (
  <span role="img" aria-label="Bronze Icon">
    🥉
  </span>
);

const SilverIcon = () => (
  <span role="img" aria-label="Silver Icon">
    🥈
  </span>
);

const GoldIcon = () => (
  <span role="img" aria-label="Gold Icon">
    🥇
  </span>
);

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
  console.log(data);
  return (
    <div className={styles.problemBox}>
      <div className={styles.problem}>
        <h2>
          {renderTierIcon(data.tier)} {data.no}. {data.title}
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

export default Problem;
