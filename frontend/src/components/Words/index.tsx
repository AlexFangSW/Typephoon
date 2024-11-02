import styles from './Words.module.scss'

// This is just uses as a dummy placeholder
export default function Words({ num }: { num: number }) {
  const words: string[] = []
  for (let index = 0; index < num; index++) {
    words.push("Something");
  }

  return <div className={styles.container}>
    {words.map((word, index) => {
      if (index < 2) {
        return <div className={index.toString()}>{word}</div>
      }
      return <div className={index.toString() + " " + styles.words}>{word}</div>
    })}
  </div>
}
