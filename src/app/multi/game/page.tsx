"use client";
import Title from "@/components/Title";
import Words from "@/components/Words";
import { SessionStoreKeys } from "@/utils/constants";
import { useEffect, Dispatch, SetStateAction, useRef, useState } from "react";

type CountdownResponse = {
  seconds_left: number;
};

type GameUserInfo = {
  id: string;
  name: string;

  finished?: string;
  rank: number;
  wpm?: number;
  wpm_raw?: number;
  acc?: number;
};

type GamePlayersResponse = {
  me: GameUserInfo;
  others: Map<string, GameUserInfo>;
};

async function updatePlayerList({
  gameID,
  setPlayers,
}: {
  gameID: number;
  setPlayers: Dispatch<SetStateAction<GamePlayersResponse | undefined>>;
}) {
  const resp = await fetch(`/api/v1/game/players?game_id=${gameID}`, {
    cache: "no-store",
  });
  const data: GamePlayersResponse = await resp.json();
  console.log("players: ", data);
  setPlayers(data);
}

async function updateCountdown({
  gameID,
  setCountdown,
}: {
  gameID: number;
  setCountdown: Dispatch<SetStateAction<number | undefined>>;
}) {
  const resp = await fetch(`/api/v1/game/countdown?game_id=${gameID}`, {
    cache: "no-store",
  });
  const data: CountdownResponse = await resp.json();
  console.log("got countdown: ", data.seconds_left);
  setCountdown(Number(data.seconds_left.toFixed(0)));
}

/*
Page load:
- [OK] Get gameID from session storage

After gameID is set:
- Connect to WebSocket
- Get words
- [OK] Get countdown every second, stop when countdown is 0
- [OK] Get player list

In Game:
- Local keystroke detection
- WS:
  - Send keystroke
  - Receive keystroke from others

Finish:
- Send statistics to server
- Redirect to result page
*/
export default function Page() {
  // const ws = useRef<WebSocket>(null);
  const [players, setPlayers] = useState<GamePlayersResponse>();
  const [countdown, setCountdown] = useState<number>();
  const [countdownBGID, setCountdownBGID] = useState<NodeJS.Timeout>();

  // TODO: handle error when gameID is not set
  const gameID = window.sessionStorage.getItem(SessionStoreKeys.GAME_ID);

  useEffect(() => {
    if (!gameID) return;
    updatePlayerList({ gameID: Number(gameID), setPlayers: setPlayers });

    const startCountdownInterval = () => {
      updateCountdown({ gameID: Number(gameID), setCountdown: setCountdown });
      return setInterval(updateCountdown, 1000, {
        gameID: Number(gameID),
        setCountdown: setCountdown,
      });
    };
    let countdownIntervalID = startCountdownInterval();
    setCountdownBGID(countdownIntervalID);
  }, [gameID]);

  useEffect(() => {
    if (!countdown || countdown > 0) {
      return;
    }

    if (countdown === 0) {
      clearInterval(countdownBGID);
    }
  }, [countdown]);

  return (
    <>
      {/* spacing */}
      <Title
        title={countdown && countdown > 0 ? countdown.toString() : "Start"}
      />
      {/* words xxx */}
      <Words num={40} />
    </>
  );
}
