"use client";
import TypingAnimation from "@/components/TypingAnimation";
import styles from "./app.module.scss";
import DarkButton from "@/components/Buttons/DarkButton";

export default function HomePage() {
  return (
    <div className={styles.home_page_container}>
      <div>
        <div className={styles.home_page_title}>TYPEPHOON</div>
        <div>
          <TypingAnimation
            text={"REAL TIME MULTI PLAYER TYPING GAME"}
            start={true}
            delay={50}
            fontSize="1.5rem"
            cursorWidth="0.8rem"
          />
        </div>
      </div>
      <DarkButton
        action={() => {
          window.location.href = "/lobby?auto_queue_in=true";
        }}
        className={styles.start_game_button}
      >
        START GAME
      </DarkButton>
    </div>
  );
}
