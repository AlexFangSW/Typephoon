"use client";
import Title from "@/components/Title";
import TypingGame from "@/components/TypingContainer";
import { SessionStoreKeys } from "@/utils/constants";
import { useEffect, Dispatch, SetStateAction, useRef, useState } from "react";

enum GameBGMsgEvent {
  KEY_STOKE = "KEY_STOKE",
  START = "START"
}

type GameBGMsg = {
  event: GameBGMsgEvent
  game_id: number
  user_id?: string
  word_index?: number
  char_index?: number
}

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

type GameWordsResponse = {
  words: string
}

async function updateWords({
  gameID,
  setWords,
}: {
  gameID: number;
  setWords: Dispatch<SetStateAction<string | undefined>>;
}) {
  const resp = await fetch(`/api/v1/game/words?game_id=${gameID}`, {
    cache: "no-store",
  });
  const data: GameWordsResponse = await resp.json();
  console.log("words: ", data.words);
  setWords(data.words);
}

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
}): Promise<number> {
  const resp = await fetch(`/api/v1/game/countdown?game_id=${gameID}`, {
    cache: "no-store",
  });
  const data: CountdownResponse = await resp.json();
  console.log("got countdown: ", data.seconds_left);
  const seconds_left = Number(data.seconds_left.toFixed(0))
  setCountdown(seconds_left);
  return seconds_left
}

/*
Page load:
- [OK] Get gameID from session storage

After gameID is set:
- [OK] Connect to WebSocket
- [OK] Get words
- [OK] Get countdown every second, stop when countdown is 0
- [OK] Get player list
- Game Start

In Game:
- [OK] Local keystroke detection
- WS:
  - Send keystroke
  - Receive keystroke from others

Finish:
- Send statistics to server
- Redirect to result page
*/

export default function Page() {
  const ws = useRef<WebSocket>(null);

  const [players, setPlayers] = useState<GamePlayersResponse>();
  const [countdown, setCountdown] = useState<number>();
  const [words, setWords] = useState<string>();
  const [start, setStart] = useState<boolean>(false);
  const [finish, setFinish] = useState<boolean>(false);
  const startTime = useRef<Date>(null);

  // TODO: set type
  const [otherPlayersPosition, setOtherPlayersPosition] = useState<Map<string, any>>();
  const keystrokes = useRef<Array<any>>([]);
  const currentPosition = useState<any>();

  const wsConnect = ({ gameID }: { gameID: number }): WebSocket => {
    const ws = new WebSocket(`/api/v1/game/ws?game_id=${gameID}`);

    // nothing to do here
    ws.onopen = () => {
      console.log("websocket opened");
    };

    // recive event
    ws.onmessage = async (ev) => {
      const raw_data = await ev.data;
      const data: GameBGMsg = JSON.parse(raw_data);
      console.log("websocket got message: ", data)
      // TODO: process events
      // - Start ( set start time, set start)
      // - Keystrokes  (update otherPlayerPositions)
    }

    ws.onclose = async () => {
      console.log("websocket closed");
      wsConnect({ gameID: Number(gameID) });
    };

    ws.onerror = () => {
      console.error("ws connection error, closing.");
      ws.close(1000, "unexpected error");
    };

    return ws;
  };

  // On keystroke
  useEffect(() => {
    if (typeof ws.current === null) {
      return
    }
    // TODO: 
    // - send keystroke

  }, [currentPosition])

  // Init player positions
  useEffect(() => {
    if (typeof players === undefined) {
      return
    }
    // TODO

  }, [players])

  // On finish
  useEffect(() => {
    if (!finish) {
      return
    }
    // TODO: 
    // - process keystokes, generate statistics
    // - generate finish time
    // - save to storage
    // - send to server
    // - redirect to result page

  }, [finish])

  // Init
  useEffect(() => {
    if (start) {
      return
    }

    const gameID = window.sessionStorage.getItem(SessionStoreKeys.GAME_ID);
    if (!gameID) {
      // redirect back to lobby if game id is not found
      console.log("got game id:", gameID)
      window.location.href = "/multi/lobby";
    }

    updatePlayerList({ gameID: Number(gameID), setPlayers: setPlayers })
    updateCountdown({ gameID: Number(gameID), setCountdown: setCountdown })
    updateWords({ gameID: Number(gameID), setWords: setWords })

    // update countdown every second
    const updateCountdownBG = async () => {
      setTimeout(() => {
        updateCountdown({ gameID: Number(gameID), setCountdown: setCountdown })
          .then((seconds_left) => {
            seconds_left > 0.0 ? updateCountdownBG() : null
          })
      }, 1000)
    }
    updateCountdownBG()

    ws.current = wsConnect({ gameID: Number(gameID) });

    return () => {
      ws.current ? ws.current.close(1000, "user left") : "";
    };
  }, [start])


  return (
    <>
      <Title
        title={countdown && countdown > 0 ? countdown.toString() : "Start"}
      />
      <TypingGame
        target={words}
        start={start}
        finish={finish}
        setFinish={setFinish}
        otherPlayersPosition={otherPlayersPosition}
        keystrokes={keystrokes.current}
      />
    </>
  );
}
