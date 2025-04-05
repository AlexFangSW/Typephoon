"use client";
import React, { JSX, Fragment } from "react";
import styles from "./TypingContainer.module.scss";
import { Dispatch, SetStateAction } from "react";
import { GameInfo, Keystroke, Position } from "@/types";

const RenderText = ({
  currentInput,
  targetWords,
  otherPlayers,
  currentPosition,
}: {
  currentInput: string;
  targetWords: string[];
  otherPlayers: Map<string, GameInfo>;
  currentPosition: Position;
}): Array<JSX.Element> => {
  const renderResult: Array<JSX.Element> = [];
  const currWords = currentInput.split(" ");

  // Each word
  targetWords.forEach((word, wordIndex) => {
    const currChars = currWords[wordIndex]?.split("")
      ? currWords[wordIndex]?.split("")
      : [];
    const targetChars = [...word.split(""), " "];
    const currWordRender: Array<JSX.Element> = [];

    // Each character
    targetChars.forEach((char, charIndex) => {
      const isCurrentChar =
        wordIndex === currentPosition.wordIndex &&
        charIndex === currentPosition.charIndex + 1;
      const isCurrect = char === currChars[charIndex];
      let isBehindCursor = false;

      currWordRender.push(
        <Fragment key={`char-${wordIndex}-${charIndex}`}>
          {Array.from(otherPlayers.entries()).map(([playerID, player]) => {
            const overTyped =
              charIndex === word.length && player.charIndex + 1 > word.length;
            const isCurrentPosition =
              wordIndex === player.wordIndex &&
              (charIndex === player.charIndex + 1 || overTyped);

            if (isCurrentPosition) {
              isBehindCursor = true;
              return (
                <span
                  key={`apponent-${playerID}`}
                  className={styles.cursor_others}
                />
              );
            } else {
              return;
            }
          })}
          {isCurrentChar ? <span className={styles.cursor} /> : ""}
          {char !== " " ? (
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
          ) : (
            ""
          )}
        </Fragment>,
      );
    });

    // Over type
    targetChars.pop();
    if (currChars.length > targetChars.length) {
      currChars.slice(targetChars.length).forEach((char, charIndex) => {
        const realCharIndex = charIndex + targetChars.length;
        const isCurrent =
          wordIndex === currentPosition.wordIndex &&
          realCharIndex === currentPosition.charIndex;

        currWordRender.push(
          <Fragment key={`char-${wordIndex}-${realCharIndex + 1}`}>
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

const TypingGame = ({
  target = "Loading...",
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

  return (
    <div
      autoFocus={true}
      tabIndex={0}
      key={"typeing-container"}
      onKeyDown={start ? handleKeyDown : undefined}
      className={styles.typing_container}
    >
      <RenderText
        currentInput={currentInput}
        targetWords={targetWords}
        otherPlayers={otherPlayers}
        currentPosition={currentPosition}
      />
    </div>
  );
};

export default TypingGame;
