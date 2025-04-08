"use client";
import TypingAnimation from "@/components/TypingAnimation";

export default function HomePage() {
  return (
    <div>
      <TypingAnimation text={"Typephoon"} start={true} delay={100} />
      <TypingAnimation
        text={"Multi player typing game"}
        start={true}
        delay={100}
      />
    </div>
  );
}
