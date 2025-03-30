"use client";
import { useEffect, JSX, Fragment } from "react";
import styles from "./TypingContainer.module.scss";
import { Dispatch, SetStateAction } from "react";
import { GameInfo, Keystroke, Position } from "@/types";

const TypingGame = ({
  target = "The quick brown fox jumps over the lazy dog",
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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (finish) return;

    if (e.key === "Backspace" && e.ctrlKey) {
      e.preventDefault();
      setCurrentInput((prev) => {
        const lastNonSpaceIndex = prev.trimEnd().length - 1;
        const lastSpaceIndex =
          lastNonSpaceIndex !== -1
            ? prev.lastIndexOf(" ", lastNonSpaceIndex)
            : -1;

        return lastSpaceIndex === -1
          ? ""
          : prev.substring(0, lastSpaceIndex + 1);
      });
    } else if (e.key === "Backspace") {
      setCurrentInput((prev) => prev.slice(0, -1));
    } else if (e.key.length === 1) {
      keystrokes.push({
        ts: new Date().getTime(),
        char: e.key,
        currect:
          e.key ===
          targetWords[currentPosition.wordIndex][currentPosition.charIndex],
      });

      setCurrentInput((prev) => prev + e.key);
    }
  };

  useEffect(() => {
    const currWords = currentInput.split(" ");
    const currWordIndex = currWords.length - 1;
    const currCharIndex = currWords[currWordIndex]?.length - 1;
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
  }, [currentInput]);

  useEffect(() => {
    // Add event listener on start
    if (!start) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [start]);

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

        // TODO: Render cursors of other players
        //        - color needs to be different, less prminent
        currWordRender.push(
          <Fragment key={`char-${wordIndex}-${charIndex}`}>
            {Array.from(otherPlayers.entries()).map(([playerID, player]) => {
              // Visually behind cursor. ex: abcd[e]fg. e is behind cursor
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
              className={`${
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
          </Fragment>
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
