// WebIDE.js

import React, { useState } from "react";
import AceEditor from "react-ace";
import "brace/mode/java";
import "brace/theme/github";
import styles from "./WebIDE.module.css";

const WebIDE = () => {
  const [code, setCode] = useState(`import java.util.Scanner;

  public class Solution {
      public static void main(String[] args) {
          
      }
  }`);
  const [fontSize, setFontSize] = useState(14);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handleRunCode = () => {
    console.log("Code Executed:", code);
    // 여기에 코드 실행 로직을 추가하세요.
  };

  const increaseFontSize = () => {
    setFontSize((prevSize) => prevSize + 2);
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => Math.max(2, prevSize - 2));
  };

  return (
    <div className={styles.webIDEContainer}>
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
