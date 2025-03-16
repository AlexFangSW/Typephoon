"use client";
import Title from "@/components/Title";
import styles from "./result.module.scss";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import RankingGraph from "@/components/Graphs/RankingGraph";
import { useEffect, useState } from "react";
import { SessionStoreKeys } from "@/utils/constants";
import { GameStatistics } from "@/types";

export default function Page() {
  const [wpm, setWpm] = useState(0);
  const [wpmRaw, setWpmRaw] = useState(0);
  const [acc, setAcc] = useState(0);

  useEffect(() => {
    // Get statistics from session storage
    const statistics: GameStatistics = JSON.parse(
      localStorage.getItem(SessionStoreKeys.GAME_STATISTICS) || "{}"
    );
    if (!statistics) {
      console.error("No statistics found");
      return;
    }

    setWpm(statistics.wpm);
    setWpmRaw(statistics.wpm_raw);
    setAcc(statistics.acc);

    // TODO: Get data from server (ranking)
  }, []);

  return (
    <div className={styles.container}>
      {/* WPM, WPM(Raw), ACC */}
      <Title title={`WPM: ${wpm} WPM(Raw): ${wpmRaw} ACC: ${acc}`} />
      {/* ranking graph */}
      <RankingGraph />
      {/* buttons */}
      <div className={styles.button_container}>
        <PrimaryButton
          action={() => {
            window.location.href = "/multi/lobby";
          }}
        >
          NEXT GAME
        </PrimaryButton>
      </div>
    </div>
  );
}
