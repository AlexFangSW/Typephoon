"use client";
import Title from "@/components/Title";
import TypingGame from "@/components/TypingContainer";
import { useRef, useState } from "react";
import { GameInfo, Keystroke, Position } from "@/types";

export default function Page() {
  const [finish, setFinish] = useState<boolean>(false);
  const [currentInput, setCurrentInput] = useState<string>("");

  const keystrokes = useRef<Array<Keystroke>>([]);
  const [currentPosition, setCurrentPosition] = useState<Position>({
    wordIndex: 0,
    charIndex: 0,
  });

  return (
    <>
      <Title title={"Test"} />

      {finish ? (
        "Finish"
      ) : (
        <TypingGame
          target="The quick brown fox jumps over the lazy dog"
          currentInput={currentInput}
          setCurrentInput={setCurrentInput}
          start={true}
          finish={finish}
          setFinish={setFinish}
          otherPlayers={new Map<string, GameInfo>()}
          keystrokes={keystrokes.current}
          currentPosition={currentPosition}
          setCurrentPosition={setCurrentPosition}
        />
      )}
    </>
  );
}
