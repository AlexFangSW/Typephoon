"use client";
import styles from "./result.module.scss";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import RankingGraph from "@/components/Graphs/RankingGraph";
import { useEffect, useState, Dispatch, SetStateAction, useRef } from "react";
import { SessionStoreKeys } from "@/utils/constants";
import {
  GameStatistics,
  GameResultResponse,
  GameUserInfo,
  ProfileUserInfoResponse,
  ProfileUserInfo,
} from "@/types";

async function getGameResult({
  gameID,
  setGameResult,
}: {
  gameID: number;
  setGameResult: Dispatch<SetStateAction<GameUserInfo[]>>;
}) {
  const response = await fetch(`/api/v1/game/result?game_id=${gameID}`, {
    cache: "no-store",
  });
  const data: GameResultResponse = await response.json();
  if (data.ok) {
    console.log("got ranking", data.ranking);
    setGameResult(data.ranking);
  } else {
    console.error("Failed to get game result");
  }
}

async function getUserInfo(): Promise<ProfileUserInfo | undefined> {
  const response = await fetch(`/api/v1/profile/user-info`, {
    cache: "no-store",
  });
  const data: ProfileUserInfoResponse = await response.json();
  if (data.ok) {
    return { id: data.id, name: data.name };
  } else {
    console.error("Failed to get user info");
  }
}

function TitleSummary({ title, value }: { title: string; value: string }) {
  return (
    <div className={styles.summary_item}>
      <span className={styles.summary_item_title}>{title}</span>
      <span>{value}</span>
    </div>
  );
}

export default function Page() {
  const [gameResult, setGameResult] = useState<GameUserInfo[]>([]);
  const [wpm, setWpm] = useState("0");
  const [wpmRaw, setWpmRaw] = useState("0");
  const [acc, setAcc] = useState("0");
  const [userID, setUserID] = useState<string>();

  useEffect(() => {
    // Get statistics from session storage
    const game_statistics = window.sessionStorage.getItem(
      SessionStoreKeys.GAME_STATISTICS,
    );
    if (!game_statistics) {
      console.error("No statistics found");
      return;
    }

    const statistics: GameStatistics = JSON.parse(game_statistics);

    console.log("got statistics", statistics);

    setWpm(statistics.wpm.toFixed(1));
    setWpmRaw(statistics.wpm_raw.toFixed(1));
    setAcc(statistics.acc.toFixed(1));

    // Get game result from server
    getGameResult({
      gameID: statistics.game_id,
      setGameResult: setGameResult,
    });

    // Get user info
    getUserInfo().then((data) => setUserID(data?.id));
  }, []);

  return (
    <div className={styles.container}>
      {/* WPM, WPM(Raw), ACC */}
      <div className={styles.summary}>
        <TitleSummary title="WPM" value={wpm} />
        <TitleSummary title="WPM(Raw)" value={wpmRaw} />
        <TitleSummary title="ACC" value={acc} />
      </div>
      {/* ranking graph */}
      <RankingGraph gameResult={gameResult} userID={userID} />
      <span>[ Refresh page (Press F5) to update data ]</span>
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
