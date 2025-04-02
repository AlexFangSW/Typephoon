"use client";
import React, { useEffect, JSX, Fragment } from "react";
import styles from "./TypingContainer.module.scss";
import { Dispatch, SetStateAction } from "react";
import { GameInfo, Keystroke, Position } from "@/types";

const TypingGame = ({
  target = "",
  currentInput,
  setCurrentInput,
  start,
  finish,
  setFinish,
  otherPlayers,
  keystrokes,
  currentPosition,
  setCurrentPosition,
}: {
  target?: string;
  currentInput: string;
  setCurrentInput: Dispatch<SetStateAction<string>>;
  start: boolean;
  finish: boolean;
  setFinish: Dispatch<SetStateAction<boolean>>;
  otherPlayers: Map<string, GameInfo>;
  keystrokes: Array<Keystroke>;
  currentPosition: Position;
  setCurrentPosition: Dispatch<SetStateAction<Position>>;
}) => {
  const targetWords = target.split(" ");

  const handleKeyDown: React.KeyboardEventHandler = (
    e: React.KeyboardEvent,
  ): void => {
    if (finish) return;

    if (e.key === "Backspace" && e.ctrlKey) {
      e.preventDefault();
      setCurrentInput((prev) => {
        const lastNonSpaceIndex = prev.trimEnd().length - 1;
        const lastSpaceIndex =
          lastNonSpaceIndex !== -1
            ? prev.lastIndexOf(" ", lastNonSpaceIndex)
            : -1;

        const newInput =
          lastSpaceIndex === -1 ? "" : prev.substring(0, lastSpaceIndex + 1);
        updateCurrentPosition(newInput);
        return newInput;
      });
    } else if (e.key === "Backspace") {
      setCurrentInput((prev) => {
        const newInput = prev.slice(0, -1);
        updateCurrentPosition(newInput);
        return newInput;
      });
    } else if (e.key.length === 1) {
      setCurrentInput((prev) => {
        const currWords = prev.split(" ").length;
        const totalWords = targetWords.length;
        let newInput = "";
        let correct = false;

        if (currWords === totalWords && e.key === " ") {
          // Ignore extra words
          newInput = prev;
        } else {
          newInput = prev + e.key;
          const { wordIndex, charIndex } = updateCurrentPosition(newInput);
          if (e.key === " " || e.key === targetWords[wordIndex][charIndex]) {
            correct = true;
          }
        }

        const keystroke = {
          ts: new Date().getTime(),
          char: e.key,
          currect: correct,
        };
        // console.log(keystroke);
        keystrokes.push(keystroke);
        return newInput;
      });
    }
  };

  const updateCurrentPosition = (
    currInpt: string,
  ): { wordIndex: number; charIndex: number } => {
    const currWords = currInpt.split(" ");
    const currWordIndex = currWords.length - 1;
    const currCharIndex = currWords[currWordIndex].length - 1;
    const targetWordIndex = targetWords.length - 1;

    setCurrentPosition({
      wordIndex: currWordIndex,
      charIndex: currCharIndex,
    });

    // Finish when the last word is correct
    if (
      currWords[currWordIndex] === targetWords[targetWordIndex] &&
      currWordIndex === targetWordIndex
    ) {
      setFinish(true);
    }

    return {
      wordIndex: currWordIndex,
      charIndex: currCharIndex,
    };
  };

  // Init position
  useEffect(() => {
    updateCurrentPosition(currentInput);
  }, []);

  const renderText = (): Array<JSX.Element> => {
    const renderResult: Array<JSX.Element> = [];
    const currWords = currentInput.split(" ");

    // Each word
    targetWords.forEach((word, wordIndex) => {
      const currChars = currWords[wordIndex]?.split("")
        ? currWords[wordIndex]?.split("")
        : [];
      const targetChars = word.split("");
      const currWordRender: Array<JSX.Element> = [];

      // Each character
      targetChars.forEach((char, charIndex) => {
        const isFirstChar = currentPosition.charIndex === -1;

        const isCurrentChar =
          wordIndex === currentPosition.wordIndex &&
          (charIndex === currentPosition.charIndex ||
            (charIndex === 0 && isFirstChar));

        // Visually behind cursor. ex: abcd[e]fg. e is behind cursor
        let isBehindCursor =
          wordIndex === currentPosition.wordIndex &&
          (charIndex === currentPosition.charIndex + 1 ||
            (charIndex === 0 && isFirstChar));

        const isCurrect = char === currChars[charIndex];

        currWordRender.push(
          <Fragment key={`char-${wordIndex}-${charIndex}`}>
            {Array.from(otherPlayers.entries()).map(([playerID, player]) => {
              const isCurrentPosition =
                wordIndex === player.wordIndex &&
                (charIndex === player.charIndex + 1 ||
                  (charIndex === word.length - 1 &&
                    player.charIndex + 1 >= word.length));

              if (isCurrentPosition) {
                isBehindCursor = true;
                return (
                  <Fragment key={`apponent-${playerID}`}>
                    <span className={styles.cursor_others} />
                  </Fragment>
                );
              } else {
                return;
              }
            })}
            {isCurrentChar && isFirstChar ? (
              <span className={styles.cursor} />
            ) : (
              ""
            )}

            <span
              className={`
              ${
                currChars[charIndex]
                  ? isCurrect
                    ? styles.correct
                    : styles.incorrect
                  : styles.target_text
              } ${isBehindCursor ? styles.behind_cursor : ""}`}
            >
              {char}
            </span>
            {isCurrentChar && !isFirstChar ? (
              <span className={styles.cursor} />
            ) : (
              ""
            )}
          </Fragment>,
        );
      });

      // Over type
      if (currChars.length > targetChars.length) {
        currChars.slice(targetChars.length).forEach((char, charIndex) => {
          const realCharIndex = charIndex + targetChars.length;
          const isCurrent =
            wordIndex === currentPosition.wordIndex &&
            realCharIndex === currentPosition.charIndex;

          currWordRender.push(
            <Fragment key={`char-${wordIndex}-${realCharIndex}`}>
              <span className={styles.incorrect}>{char}</span>
              {isCurrent ? <span className={styles.cursor} /> : ""}
            </Fragment>,
          );
        });
      }

      renderResult.push(
        <Fragment key={`word-${wordIndex}`}>
          <span key={`word'-${wordIndex}`}>{currWordRender}</span>
        </Fragment>,
      );
    });

    return renderResult;
  };

  return (
    <div
      autoFocus={true}
      tabIndex={0}
      key={"typeing-container"}
      onKeyDown={start ? handleKeyDown : undefined}
      className={styles.typing_container}
    >
      {renderText()}
    </div>
  );
};

export default TypingGame;
