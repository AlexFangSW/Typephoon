import styles from "./replay.module.scss"

import Words from "@/components/Words";
import RedButton from "@/components/Buttons/RedButton";
import Title from "@/components/Title";

export default function Page() {
  return (
    <div className={styles.container}>
      {/* spacing */}
      <Title title="REPLAY" />
      {/* words xxx */}
      <Words num={40} />
      {/* playback button */}
      <div className={styles.playback_buttin_container} >
        <RedButton text="EXIT" />
      </div>
    </div>
  );
}
