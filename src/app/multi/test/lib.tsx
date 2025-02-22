"use client";
import { useState, useEffect, JSX, Fragment } from "react";
import styles from "./test.module.scss";

const TypingGame = ({
  target = "The quick brown fox jumps over the lazy dog",
}: {
  target: string;
}) => {
  // TODO:
  // - Only set event listener when start event is triggered (from server)
  // - Save all key strokes for statistics
  // - Process all other player positions (extra args ?)
  //
  // PS: things done outside of this component
  // - Countdown
  // - Get player list
  // - WS connection
  // - Get target from server

  const [currentInput, setCurrentInput] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isComplete) return;

    // BUG: can't delete the first word if we haven't typed anything in the first word
    if (e.key === "Backspace" && e.ctrlKey) {
      e.preventDefault();
      const lastNonSpaceIndex = currentInput.trimEnd().length - 1;
      const lastSpaceIndex = currentInput.lastIndexOf(
        " ",
        lastNonSpaceIndex - 1
      );
      setCurrentInput(
        lastSpaceIndex === -1
          ? ""
          : currentInput.substring(0, lastSpaceIndex + 1)
      );
    } else if (e.key === "Backspace") {
      setCurrentInput((prev) => prev.slice(0, -1));
    } else if (e.key.length === 1) {
      const newInput = currentInput + e.key;
      setCurrentInput(newInput);
    }
  };

  useEffect(() => {
    // Check completion and set current index
    if (currentInput === target) {
      setIsComplete(true);
    }

    const currWords = currentInput.split(" ");
    const currWordIndex = currWords.length - 1;
    const currCharIndex = currWords[currWordIndex]?.length - 1;

    setCurrentWordIndex(currWordIndex);
    setCurrentCharIndex(currCharIndex);
  }, [currentInput]);

  useEffect(() => {
    // Add event listener
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentInput, isComplete]);

  if (isComplete) {
    return (
      <div>
        <h1>Finish !!!</h1>
      </div>
    );
  }

  const renderText = (): Array<JSX.Element> => {
    const renderResult: Array<JSX.Element> = [];

    const currWords = currentInput.split(" ");
    const targetWords = target.split(" ");

    targetWords.forEach((word, wordIndex) => {
      const currChars = currWords[wordIndex]?.split("")
        ? currWords[wordIndex]?.split("")
        : [];
      const targetChars = word.split("");
      const currWordRender: Array<JSX.Element> = [];

      targetChars.forEach((char, charIndex) => {
        const isFirstChar = currentCharIndex === -1;
        const isCurrent =
          wordIndex === currentWordIndex &&
          (charIndex === currentCharIndex || (charIndex === 0 && isFirstChar));
        const isBehindCursor =
          wordIndex === currentWordIndex &&
          (charIndex === currentCharIndex + 1 ||
            (charIndex === 0 && isFirstChar));
        const isCurrect = char === currChars[charIndex];

        currWordRender.push(
          <Fragment key={`char-${wordIndex}-${charIndex}`}>
            {isCurrent && isFirstChar ? <span className={styles.cursor} /> : ""}
            <span
              className={`${
                currChars[charIndex]
                  ? isCurrect
                    ? styles.correct
                    : styles.incorrect
                  : ""
              } ${styles.target_text} ${
                isBehindCursor ? styles.behind_cursor : ""
              }`}
            >
              {char}
            </span>
            {isCurrent && !isFirstChar ? (
              <span className={styles.cursor} />
            ) : (
              ""
            )}
          </Fragment>
        );
      });

      // Over type
      if (currChars.length > targetChars.length) {
        currChars.slice(targetChars.length).forEach((char, charIndex) => {
          const realCharIndex = charIndex + targetChars.length;
          const isCurrent =
            wordIndex === currentWordIndex &&
            realCharIndex === currentCharIndex;

          currWordRender.push(
            <Fragment key={`char-${wordIndex}-${realCharIndex}`}>
              <span className={styles.incorrect}>{char}</span>
              {isCurrent ? <span className={styles.cursor} /> : ""}
            </Fragment>
          );
        });
      }

      renderResult.push(
        <Fragment key={`word-${wordIndex}`}>
          <span key={`word'-${wordIndex}`}>{currWordRender}</span>
        </Fragment>
      );
    });

    return renderResult;
  };

  return (
    <div key={"typeing-container"} className={styles.typing_container}>
      {renderText()}
    </div>
  );
};

export default TypingGame;
