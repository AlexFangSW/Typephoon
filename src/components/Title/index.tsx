import styles from "./Title.module.scss"

export default function Title({ title }: { title?: string }) {
  return <div className={styles.container}>
    {title}
  </div>
}
