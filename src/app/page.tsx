"use client";
import { useState } from "react";
import { Keystroke, Position, GameInfo } from "@/types";
import TypingGame from "@/components/TypingContainer";

export default function HomePage() {
  const [finish, setFinish] = useState<boolean>(false);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [currentPosition, setCurrentPosition] = useState<Position>({
    wordIndex: 0,
    charIndex: -1,
  });
  const otherPlayers = new Map<string, GameInfo>();

  return (
    <>
      <TypingGame
        target="The quick brown fox jumps over the lazy dog"
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
        start={true}
        finish={finish}
        setFinish={setFinish}
        otherPlayers={otherPlayers}
        keystrokes={[]}
        currentPosition={currentPosition}
        setCurrentPosition={setCurrentPosition}
        ignore_lose_focus={false}
      />
    </>
  );
}
