"use client";
import { useState, useEffect, useRef } from "react";
// import Chart from "chart.js/auto";
import styles from "./test.module.scss";

type Keystroke = {
  char: string;
  isCorrect: boolean;
  timestamp: Date;
  timeSinceStart: number;
};

const TypingGame = ({
  words = ["The quick brown fox jumps over the lazy dog"],
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [keystrokes, setKeystrokes] = useState<Keystroke[]>([]);
  const [speedDataPoints, setSpeedDataPoints] = useState<
    {
      time: number;
      rawWpm: number;
      correctedWpm: number;
    }[]
  >([]);
  const [results, setResults] = useState<{
    rawWpm: number;
    correctedWpm: number;
    accuracy: number;
    mistakes: number;
    timeElapsed: number;
  } | null>(null);

  const chartRef = useRef(null);
  const lastSpeedCalculationRef = useRef<Date | null>(null);

  const recordKeystroke = (char: string, isCorrect: boolean) => {
    const now = new Date();
    setKeystrokes((prev: any) => [
      ...prev,
      {
        char,
        isCorrect,
        timestamp: now,
        timeSinceStart: startTime
          ? (now.getTime() - startTime.getTime()) / 1000
          : 0,
      },
    ]);

    // Calculate current speed if enough time has passed
    if (
      !lastSpeedCalculationRef.current ||
      now.getTime() - lastSpeedCalculationRef.current.getTime() >= 1000
    ) {
      calculateCurrentSpeed();
      lastSpeedCalculationRef.current = now;
    }
  };

  const calculateCurrentSpeed = () => {
    const now = new Date();
    const timeWindow = 5; // Calculate WPM based on last 5 seconds
    const relevantStrokes = keystrokes.filter(
      (k) => now.getTime() - k.timestamp.getTime() <= timeWindow * 1000
    );

    if (relevantStrokes.length > 0) {
      const totalChars = relevantStrokes.length;
      const rawWpm = Math.round(totalChars / 5 / (timeWindow / 60));
      const correctChars = relevantStrokes.filter((k) => k.isCorrect).length;
      const correctedWpm = Math.round(correctChars / 5 / (timeWindow / 60));

      if (startTime) {
        setSpeedDataPoints((prev) => [
          ...prev,
          {
            time: (now.getTime() - startTime.getTime()) / 1000,
            rawWpm,
            correctedWpm,
          },
        ]);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isComplete) return;

    if (!startTime) {
      const now = new Date();
      setStartTime(now);
      lastSpeedCalculationRef.current = now;
    }

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

      const targetWord = words[currentWordIndex];
      const isCorrect =
        newInput[newInput.length - 1] === targetWord[newInput.length - 1];

      recordKeystroke(e.key, isCorrect);

      if (!isCorrect) {
        setMistakes((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    // Check completion whenever currentInput changes
    const currentWord = words[currentWordIndex];
    if (currentInput === currentWord) {
      if (currentWordIndex === words.length - 1) {
        setIsComplete(true);
      } else {
        setCurrentWordIndex((prev) => prev + 1);
        setCurrentInput("");
      }
    }
  }, [currentInput, currentWordIndex, words]);

  useEffect(() => {
    // Show results when game is complete
    if (isComplete) {
      const endTime = new Date();
      if (startTime) {
        const timeElapsed = (endTime.getTime() - startTime.getTime()) / 1000;
        const totalCharacters = words.join("").length;
        const correctCharacters = keystrokes.filter((k) => k.isCorrect).length;

        const rawWpm = Math.round(keystrokes.length / 5 / (timeElapsed / 60));
        const correctedWpm = Math.round(
          correctCharacters / 5 / (timeElapsed / 60)
        );
        const accuracy = Math.round(
          (correctCharacters / keystrokes.length) * 100
        );

        setResults({
          rawWpm,
          correctedWpm,
          accuracy,
          mistakes,
          timeElapsed,
        });
      }
    }
  }, [isComplete]);

  useEffect(() => {
    // Add event listener
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentInput, currentWordIndex, isComplete]);


  if (results) {
    return (
      <div className="results">
        <h2>Results:</h2>
        <p>Raw Speed: {results.rawWpm} WPM</p>
        <p>Corrected Speed: {results.correctedWpm} WPM</p>
        <p>Accuracy: {results.accuracy}%</p>
        <p>Mistakes: {results.mistakes}</p>
        <p>Time: {results.timeElapsed.toFixed(1)} seconds</p>
        <canvas ref={chartRef} id="speedChart" />
      </div>
    );
  }

  // TODO: overlay target text and current word
  return (
    <div className={styles.typing_container}>
      <span className={styles.target_text}>
        {words[currentWordIndex]}
      </span>
      <span className={styles.user_input}>
        {currentInput.split("").map((char, i) => {
          const isCorrect = char === words[currentWordIndex][i];
          return (
            <span
              key={i}
              className={isCorrect ? styles.correct : styles.incorrect}
            >
              {char}
            </span>
          );
        })}
        <span className={`${styles.cursor_blink} ${styles.cursor}`} />
      </span>
    </div>
  );
};

export default TypingGame;
