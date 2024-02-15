import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import PropTypes from "prop-types";
import "brace/mode/java";
import "brace/theme/github";
import styles from "./WebIDE.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setCode, setLanguage } from "./slices/codeSlice"; // 경로는 프로젝트에 따라 달라질 수 있음
import { toggleResultExpanded } from "./slices/executionResultSlice"; // 경로는 프로젝트에 따라 달라질 수 있음

const WebIDE = ({ language }) => {
  const dispatch = useDispatch();
  const executionResult = useSelector((state) => state.executionResult.output);
  const [fontSize, setFontSize] = useState(16);
  const code = useSelector((state) => state.code.content); // Redux 상태에서 코드 값 선택

  const isLoading = useSelector((state) => state.loading.isLoading); // 로딩 상태 선택
  const isResultExpanded = useSelector(
    (state) => state.executionResult.isResultExpanded
  );
  const isFlipped = useSelector((state) => state.webIDE.isFlipped);

  const expandStyle = isResultExpanded
    ? styles.resultContainer
    : styles.resultContainerCompact;

  useEffect(() => {
    // 컴포넌트가 마운트될 때 Redux 상태에 초기 코드 값 저장
    if (language === "java") {
      dispatch(
        setCode(`import java.util.Scanner;
   
    public class Solution {
           
      public static void main(String[] args) {
           
        Scanner in = new Scanner(System.in);
            
        int A = in.nextInt();
        int B = in.nextInt();
              
        System.out.println(A+B);
      }
    }`)
      );
    } else if (language === "python") {
      dispatch(setCode(`A, B = input().split()\nprint(int(A)+int(B))	`));
    }
    // 언어 상태에 올리기
    dispatch(setLanguage(language));
  }, [dispatch]); // dispatch를 의존성 배열에 추가

  const handleCodeChange = (newCode) => {
    dispatch(setCode(newCode)); // 사용자 입력에 따라 Redux 상태 업데이트
  };

  const increaseFontSize = () => {
    setFontSize((prevSize) => prevSize + 2);
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => Math.max(2, prevSize - 2));
  };

  const toggleResultDisplay = () => {
    dispatch(toggleResultExpanded()); // 사용자가 버튼을 클릭하면 상태 토글
  };

  const renderExecutionResult = () => {
    if (isLoading) {
      return <div className={styles.loading}>Loading...</div>;
    }
    console.log(executionResult);
    if (!executionResult) {
      return;
    }

    if (!executionResult.result.tcResult) {
      return <div className={styles.loading}>컴파일 에러..!</div>;
    }

    // 성공한 테스트 케이스의 수를 계산합니다.
    const passedTests = executionResult.result.tcResult.filter(
      (testcase) => testcase.codeStatus === "맞았습니다."
    ).length;
    const allPassed = passedTests === executionResult.result.tcResult.length;

    return (
      <div className={expandStyle}>
        <button onClick={toggleResultDisplay} className={styles.toggleButton}>
          {isResultExpanded ? "👇" : "👆"}
        </button>
        <h4
          style={{
            color: allPassed ? "blue" : "red", // 모든 테스트 케이스를 맞췄으면 파란색, 아니면 빨간색
          }}
        >
          {isResultExpanded && executionResult.result.allResult}
        </h4>

        {isResultExpanded && (
          <div className={styles.console}>
            <ul>
              {executionResult.result.tcResult.map((testcase, index) => (
                <li key={index} className={styles.testcaseResult}>
                  <span className={styles.testcaseNo}>
                    테스트 {testcase.testcaseNo}:
                  </span>
                  <span className={styles.codeStatus}>
                    {testcase.codeStatus}
                  </span>
                  <span className={styles.executionTime}>{testcase.time}</span>
                  <span className={styles.executionMemory}>
                    {testcase.memory}
                  </span>
                </li>
              ))}
            </ul>
            {/* 성공한 테스트 케이스 수를 표시합니다. */}
            <h4
              style={{
                color: allPassed ? "blue" : "red", // 모든 테스트 케이스를 맞췄으면 파란색, 아니면 빨간색
              }}
            >
              테스트 결과 (~˘▾˘)~ &nbsp;
              {executionResult.result.tcResult.length}개 중 {passedTests}개
              성공!
            </h4>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`${styles.webIDEContainer} ${isFlipped ? styles.flipped : ""}`}
    >
      <AceEditor
        mode="java"
        //mode={language === "java" ? "java" : "py"} // python은 py
        theme="github"
        fontSize={fontSize}
        width="100%"
        height="100%"
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={code}
        onChange={handleCodeChange}
        wrapEnabled={true}
        cursorStart={1}
        setOptions={{
          showLineNumbers: true,
          tabSize: 4,
          wrap: true,
        }}
      />

      <div>{renderExecutionResult()}</div>
      <div className={styles.buttonContainer}>
        <button className={styles.floatButton} onClick={increaseFontSize}>
          +
        </button>
        <button className={styles.floatButton} onClick={decreaseFontSize}>
          -
        </button>
      </div>
    </div>
  );
};

WebIDE.propTypes = {
  language: PropTypes.string.isRequired,
};

export default WebIDE;
