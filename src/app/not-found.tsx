"use client";

import DarkButton from "@/components/Buttons/DarkButton";
import styles from "./app.module.scss";
import TypingAnimation from "@/components/TypingAnimation";

export default function NotFound() {
  return (
    <div className={styles.home_page_container}>
      <div>
        <div className={styles.home_page_title}>404</div>
        <div>
          <TypingAnimation
            text={"PAGE NOT FOUND, HOW DID YOU GET HERE !?"}
            start={true}
            delay={50}
            fontSize="1.5rem"
            cursorWidth="0.8rem"
          />
        </div>
      </div>
      <DarkButton
        action={() => {
          window.location.href = "/";
        }}
        className={styles.start_game_button}
      >
        RETURN HOME
      </DarkButton>
    </div>
  );
}
