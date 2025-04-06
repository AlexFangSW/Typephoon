import {
  GameWordsResponse,
  GameInfo,
  GamePlayersResponse,
  CountdownResponse,
  ErrorCode,
} from "@/types";
import { authFetch } from "@/utils/common";

export async function updateWords({
  gameID,
  setWords,
}: {
  gameID: number;
  setWords: (arg: string) => void;
}) {
  const resp = await fetch(`/api/v1/game/words?game_id=${gameID}`, {
    cache: "no-store",
  });
  const data: GameWordsResponse = await resp.json();
  if (!data.ok) {
    console.error("error: ", data.error);
    if (data.error.code === ErrorCode.GAME_NOT_FOUND) {
      window.location.href = "/lobby";
    }
    return;
  }
  console.log("words: ", data.words);
  setWords(data.words);
}

export async function updateOtherPlayers({
  gameID,
  setOtherPlayers,
}: {
  gameID: number;
  setOtherPlayers: (arg: Map<string, GameInfo>) => void;
}) {
  const data = await authFetch<GamePlayersResponse>(
    `/api/v1/game/players?game_id=${gameID}`,
    {
      cache: "no-store",
    },
  );
  if (!data.ok) {
    console.error("error: ", data.error);
    if (data.error.code === ErrorCode.GAME_NOT_FOUND) {
      window.location.href = "/lobby";
    }
    return;
  }

  console.log("players: ", data);

  let otherPlayers: Map<string, GameInfo> = new Map();
  for (const key in data.others) {
    otherPlayers.set(key, {
      ...data.others[key],
      wordIndex: 0,
      charIndex: -1,
    });
  }

  console.log("set other players", otherPlayers);
  setOtherPlayers(otherPlayers);
}

export async function updateCountdown({
  gameID,
  setCountdown,
}: {
  gameID: number;
  setCountdown: (arg: number | undefined) => void;
}): Promise<number> {
  const resp = await fetch(`/api/v1/game/countdown?game_id=${gameID}`, {
    cache: "no-store",
  });
  const data: CountdownResponse = await resp.json();
  if (!data.ok) {
    console.error("error: ", data.error);
    if (data.error.code === ErrorCode.GAME_NOT_FOUND) {
      window.location.href = "/lobby";
    }
    return 0;
  }
  console.log("got countdown: ", data.seconds_left);
  const seconds_left = Number(data.seconds_left.toFixed(0));
  setCountdown(seconds_left);
  return seconds_left;
}
