import React, { useState, useEffect } from "react";
import styles from "./Problem.module.css";

const Problem = () => {
  const [problemData, setProblemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = async () => {
    try {
      const response = await fetch("http://i10d104.p.ssafy.io:8080/problems/1");

      // 네트워크 에러 확인
      if (!response.ok) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      }

      const data = await response.json();
      setProblemData(data.result);
      setError(null);
      setLoading(false); // 로딩 완료 시 로딩 상태 변경
    } catch (error) {
      console.error("데이터를 불러오는 중에 문제가 발생했습니다.", error);
      setProblemData(null);
      setError("데이터를 불러오는 중에 문제가 발생했습니다.");
      setLoading(false); // 에러 발생 시 로딩 상태 변경
    }
  };

  useEffect(() => {
    getData();

    // 1초 후에 로딩이 완료되지 않은 경우 새로고침 아이콘 표시
    const timeoutId = setTimeout(() => {
      if (loading) {
        setError("데이터를 불러오는 중에 문제가 발생했습니다.");
      }
    }, 1000);

    // 컴포넌트가 언마운트되면 타이머 해제
    return () => clearTimeout(timeoutId);
  }, [loading]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
  };

  if (loading) {
    // 로딩 중일 때 애니메이션 표시
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    // 에러가 발생한 경우
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={handleRetry}>재시도</button>
      </div>
    );
  }
  // ... 이전 코드 계속

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
