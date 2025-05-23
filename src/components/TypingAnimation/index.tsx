"use client";
import React, { JSX, Fragment, useState, useEffect, useRef } from "react";
import styles from "./TypingAnimation.module.scss";

const RenderText = ({
  cursorPosition,
  target,
  cursorWidth,
}: {
  cursorPosition: number;
  target: string;
  cursorWidth: string;
}): Array<JSX.Element> => {
  const renderResult: Array<JSX.Element> = [];
  const targetWords = target.split(" ");
  let currentPosition = 0;

  // Each word
  targetWords.forEach((word, wordIndex) => {
    const targetChars = word.split("");
    const currWordRender: Array<JSX.Element> = [];

    // Each character
    targetChars.forEach((char, charIndex) => {
      const isCursorPosition = currentPosition === cursorPosition;
      const typed = currentPosition < cursorPosition;

      currWordRender.push(
        <Fragment key={`char-${wordIndex}-${charIndex}`}>
          {isCursorPosition ? (
            <span className={styles.cursor} style={{ width: cursorWidth }} />
          ) : (
            ""
          )}
          {char !== " " ? (
            <span
              className={`
              ${
                typed ? styles.correct : styles.target_text
              } ${isCursorPosition ? styles.behind_cursor : ""}`}
            >
              {char}
            </span>
          ) : (
            ""
          )}
        </Fragment>,
      );
      currentPosition++;
    });

    renderResult.push(
      <Fragment key={`word-${wordIndex}`}>
        <span key={`word'-${wordIndex}`}>{currWordRender}</span>
      </Fragment>,
    );
  });

  return renderResult;
};

const TypingAnimation = ({
  text,
  start = true,
  delay = 1000,
  fontSize = "1rem",
  cursorWidth = "0.5rem",
  fontWeight = 900,
  alignItems = "center",
  justifyContent = "center",
}: {
  text: string;
  start?: boolean;
  delay?: number;
  fontSize?: string;
  fontWeight?: number;
  cursorWidth: string;
  alignItems?: string;
  justifyContent?: string;
}) => {
  const lastPosition = text.length + 1;
  const [cursorPosition, setCursorPosition] = useState(-1);
  const increment = () => setCursorPosition((i) => i + 1);
  let intervalId = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (!start) {
      return;
    }
    const id = setInterval(increment, delay);
    intervalId.current = id;
    return () => clearInterval(id);
  }, [start]);

  useEffect(() => {
    if (cursorPosition > lastPosition && intervalId.current) {
      clearInterval(intervalId.current);
    }
  }, [cursorPosition]);

  return (
    <div className={styles.typing_container}>
      <div
        className={styles.text_area}
        style={{
          fontSize: fontSize,
          fontWeight: fontWeight,
          alignItems: alignItems,
          justifyContent: justifyContent,
        }}
      >
        <RenderText
          cursorPosition={cursorPosition}
          target={text}
          cursorWidth={cursorWidth}
        />
      </div>
    </div>
  );
};

export default TypingAnimation;
