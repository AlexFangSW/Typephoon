import styles from "./app.module.scss"

import Words from "@/components/Words";

export default function HomePage() {
  return (
    <div className={styles.word_box_container}>
      {/* spacing */}
      <div></div>
      {/* words xxx */}
      <div className={styles.word_box}>
        <Words num={45} />
      </div>
    </div>
  );
}
