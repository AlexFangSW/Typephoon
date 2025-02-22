"use client";
import { useState, useEffect, JSX, Fragment } from "react";
import styles from "./test.module.scss";

const TypingGame = ({
  target = "The quick brown fox jumps over the lazy dog",
}: {
  target: string;
}) => {
  const [currentInput, setCurrentInput] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isComplete) return;

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
    // TODO: render cursor on space !!! and first word

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
        const isCurrent =
          wordIndex === currentWordIndex && charIndex === currentCharIndex;
        const isCurrect = char === currChars[charIndex];

        currWordRender.push(
          <Fragment key={`char-${wordIndex}-${charIndex}`}>
            <span
              className={
                currChars[charIndex]
                  ? isCurrect
                    ? styles.correct
                    : styles.incorrect
                  : ""
              }
            >
              {char}
            </span>
            {isCurrent ? <span className={styles.cursor} /> : ""}
          </Fragment>
        );
      });

      // Over type
      if (currChars.length > targetChars.length) {
        currChars
          .slice(targetChars.length, currChars.length - 1)
          .forEach((char, charIndex) => {
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
