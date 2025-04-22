"use client";
import styles from "./source.module.scss";
import Title from "@/components/Title";
import DarkButton from "@/components/Buttons/DarkButton";

export default function Page() {
  return (
    <div className={styles.container}>
      <Title title="SOURCE" />
      <div className={styles.content}>
        <DarkButton
          className={styles.button}
          action={() => {
            window.open("https://github.com/AlexFangSW/Typephoon", "_blank");
          }}
        >
          FRONTEND
        </DarkButton>
        <DarkButton
          className={styles.button}
          action={() => {
            window.open(
              "https://github.com/AlexFangSW/Typephoon_api",
              "_blank"
            );
          }}
        >
          BACKEND
        </DarkButton>
      </div>
    </div>
  );
}
