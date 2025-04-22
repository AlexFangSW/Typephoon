import styles from "./Words.module.scss";

// This is just uses as a dummy placeholder
export default function Words({ num }: { num: number }) {
  const words: string[] = [];
  for (let index = 0; index < num; index++) {
    words.push("Something");
  }

  return (
    <div className={styles.word_box}>
      <div className={`${styles.container}`}>
        {words.map((word, index) => {
          if (index < 2) {
            return <div key={index.toString()}>{word}</div>;
          }
          return (
            <div className={styles.words} key={index.toString()}>
              {word}
            </div>
          );
        })}
      </div>
    </div>
  );
}
