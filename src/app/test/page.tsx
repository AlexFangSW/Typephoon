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
    charIndex: -1,
  });
  const otherPlayers = new Map<string, GameInfo>();
  otherPlayers.set("aaabbb", {
    id: "aaabbb",
    name: "aaabbb",
    rank: 99999,
    wordIndex: 2,
    charIndex: -1,
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
          otherPlayers={otherPlayers}
          keystrokes={keystrokes.current}
          currentPosition={currentPosition}
          setCurrentPosition={setCurrentPosition}
        />
      )}
    </>
  );
}
