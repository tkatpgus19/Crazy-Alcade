import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import "brace/mode/java";
import "brace/theme/github";
import styles from "./WebIDE.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setCode } from "./slices/codeSlice"; // 경로는 프로젝트에 따라 달라질 수 있음
import { toggleResultExpanded } from "./slices/executionResultSlice"; // 경로는 프로젝트에 따라 달라질 수 있음

const WebIDE = () => {
  const dispatch = useDispatch();
  const executionResult = useSelector((state) => state.executionResult.output);
  const [fontSize, setFontSize] = useState(14);
  const code = useSelector((state) => state.code.content); // Redux 상태에서 코드 값 선택
  const isLoading = useSelector((state) => state.loading.isLoading); // 로딩 상태 선택
  const isResultExpanded = useSelector(
    (state) => state.executionResult.isResultExpanded
  );

  useEffect(() => {
    // 컴포넌트가 마운트될 때 Redux 상태에 초기 코드 값 저장
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
    if (!executionResult || !executionResult.result) {
      return (
        <div className={styles.resultContainer}>
          No execution results available.
        </div>
      );
    }

    return (
      <div
        className={styles.resultContainer}
        style={{
          maxHeight: isResultExpanded ? "none" : "20px",
          overflow: "hidden",
        }}
      >
        <button onClick={toggleResultDisplay} className={styles.toggleButton}>
          {isResultExpanded ? "접기" : "펼치기"}
        </button>
        <h3>{executionResult.message}</h3>
        {isResultExpanded && (
          <ul>
            {executionResult.result.map((testcase, index) => (
              <li key={index}>
                테스트 {testcase.testcaseNo}: {testcase.codeStatus}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className={styles.webIDEContainer}>
      <div>{renderExecutionResult()}</div>

      <AceEditor
        mode="java"
        theme="github"
        fontSize={fontSize}
        width="100%"
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={code}
        onChange={handleCodeChange}
        wrapEnabled={true}
        setOptions={{
          showLineNumbers: true,
          tabSize: 2,
          wrap: true,
        }}
      />
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

export default WebIDE;
