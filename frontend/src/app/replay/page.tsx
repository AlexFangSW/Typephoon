import styles from "./replay.module.scss"

import Words from "@/components/Words";
import RedButton from "@/components/Buttons/RedButton";

export default function Page() {
  return (
    <div className={styles.container}>
      {/* title */}
      <h1 className={styles.title}>REPLAY</h1>

      {/* words xxx */}
      <div className={styles.word_box}>
        <Words num={45} />
      </div>

      {/* playback button */}
      <div className={styles.playback_buttin_container} >
        <RedButton text="EXIT" />
      </div>
    </div>
  );
}
