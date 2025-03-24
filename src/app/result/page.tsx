"use client";
import Title from "@/components/Title";
import styles from "./result.module.scss";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import RankingGraph from "@/components/Graphs/RankingGraph";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { SessionStoreKeys } from "@/utils/constants";
import { GameStatistics, GameResultResponse, GameUserInfo } from "@/types";

async function getGameResult({
  gameID,
  setGameResult,
}: {
  gameID: number;
  setGameResult: Dispatch<SetStateAction<GameUserInfo[]>>;
}) {
  const response = await fetch(`/api/game/result?game_id=${gameID}`);
  const data: GameResultResponse = await response.json();
  if (data.ok) {
    setGameResult(data.result);
  } else {
    console.error("Failed to get game result");
  }
}

export default function Page() {
  const [gameResult, setGameResult] = useState<GameUserInfo[]>([]);
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

    // Get game result from server
    getGameResult({
      gameID: statistics.game_id,
      setGameResult: setGameResult,
    });
  }, []);

  return (
    <div className={styles.container}>
      {/* WPM, WPM(Raw), ACC */}
      <Title title={`WPM: ${wpm} WPM(Raw): ${wpmRaw} ACC: ${acc}`} />
      {/* ranking graph */}
      <RankingGraph gameResult={gameResult} />
      {/* buttons */}
      <div className={styles.button_container}>
        <PrimaryButton
          action={() => {
            window.location.href = "/lobby";
          }}
        >
          NEXT GAME
        </PrimaryButton>
      </div>
    </div>
  );
}
