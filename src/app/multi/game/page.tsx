"use client";
import Title from "@/components/Title";
import TypingGame from "@/components/TypingContainer";
import { SessionStoreKeys } from "@/utils/constants";
import { useEffect, Dispatch, SetStateAction, useRef, useState } from "react";
import {
  GameWordsResponse,
  GameInfo,
  IncommingGameBGMsg,
  OutgoingGameBGMsg,
  GamePlayersResponse,
  CountdownResponse,
  Keystroke,
  Position,
  GameBGMsgEvent,
  ErrorCode,
} from "@/types";

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
  if (!data.ok) {
    console.error("error: ", data.error);
    if (data.error.code === ErrorCode.GAME_NOT_FOUND) {
      window.location.href = "/multi/lobby";
    }
    return;
  }
  console.log("words: ", data.words);
  setWords(data.words);
}

async function updateOtherPlayers({
  gameID,
  setOtherPlayers,
}: {
  gameID: number;
  setOtherPlayers: Dispatch<SetStateAction<Map<string, GameInfo>>>;
}) {
  const resp = await fetch(`/api/v1/game/players?game_id=${gameID}`, {
    cache: "no-store",
  });
  const data: GamePlayersResponse = await resp.json();
  if (!data.ok) {
    console.error("error: ", data.error);
    if (data.error.code === ErrorCode.GAME_NOT_FOUND) {
      window.location.href = "/multi/lobby";
    }
    return;
  }

  console.log("players: ", data);

  let otherPlayers: Map<string, GameInfo> = new Map();
  for (const [key, value] of data.others) {
    otherPlayers.set(key, {
      ...value,
      wordIndex: 0,
      charIndex: 0,
    });
  }

  console.log("set other players", otherPlayers);
  setOtherPlayers(otherPlayers);
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
  if (!data.ok) {
    console.error("error: ", data.error);
    if (data.error.code === ErrorCode.GAME_NOT_FOUND) {
      window.location.href = "/multi/lobby";
    }
    return 0;
  }
  console.log("got countdown: ", data.seconds_left);
  const seconds_left = Number(data.seconds_left.toFixed(0));
  setCountdown(seconds_left);
  return seconds_left;
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
  const [countdown, setCountdown] = useState<number>();
  const [words, setWords] = useState<string>();
  const [otherPlayers, setOtherPlayers] = useState<Map<string, GameInfo>>(
    new Map<string, GameInfo>()
  );

  const [start, setStart] = useState<boolean>(false);
  let startTime = useRef<Date>(null);
  const [finish, setFinish] = useState<boolean>(false);

  const keystrokes = useRef<Array<Keystroke>>([]);
  const [currentPosition, setCurrentPosition] = useState<Position>({
    wordIndex: 0,
    charIndex: 0,
  });

  const wsConnect = ({ gameID }: { gameID: number }) => {
    ws.current = new WebSocket(`/api/v1/game/ws?game_id=${gameID}`);

    // nothing to do here
    ws.current.onopen = () => {
      console.log("websocket opened");
    };

    // recive event
    ws.current.onmessage = async (ev) => {
      const raw_data = await ev.data;
      const data: IncommingGameBGMsg = JSON.parse(raw_data);
      console.log("websocket got message: ", data);
      switch (data.event) {
        case GameBGMsgEvent.START:
          setStart(true);
          startTime.current = new Date();
          break;
        case GameBGMsgEvent.KEY_STOKE:
          if (data.user_id) {
            let player = otherPlayers.get(data.user_id);
            if (!player) {
              return;
            }
            player.charIndex = data.char_index
              ? data.char_index
              : player.charIndex;
            player.wordIndex = data.word_index
              ? data.word_index
              : player.wordIndex;

            otherPlayers.set(data.user_id, player);
            setOtherPlayers(otherPlayers);
          }
          break;
        default:
          console.log("unknown event", data.event);
          break;
      }
    };

    ws.current.onclose = async () => {
      console.log("websocket closed");
      wsConnect({ gameID: Number(gameID) });
    };

    ws.current.onerror = () => {
      console.error("ws connection error, closing.");
      ws?.current?.close(1000, "unexpected error");
    };
  };

  // On keystroke
  useEffect(() => {
    if (typeof ws.current === null) {
      return;
    }
    const msg: OutgoingGameBGMsg = {
      event: GameBGMsgEvent.KEY_STOKE,
      word_index: currentPosition.wordIndex,
      char_index: currentPosition.charIndex,
    };
    ws.current?.send(JSON.stringify(msg));
  }, [currentPosition]);

  // On finish
  useEffect(() => {
    if (!finish) {
      return;
    }
    // TODO:
    // - process keystokes, generate statistics
    // - generate finish time
    // - save to storage
    // - send to server
    // - redirect to result page
  }, [finish]);

  // Init
  useEffect(() => {
    if (start) {
      return;
    }

    const gameID = window.sessionStorage.getItem(SessionStoreKeys.GAME_ID);
    if (!gameID) {
      // redirect back to lobby if game id is not found
      console.log("got game id:", gameID);
      window.location.href = "/multi/lobby";
    }
    // clear game id after first use
    window.sessionStorage.removeItem(SessionStoreKeys.GAME_ID)

    updateOtherPlayers({
      gameID: Number(gameID),
      setOtherPlayers: setOtherPlayers,
    });
    updateCountdown({ gameID: Number(gameID), setCountdown: setCountdown });
    updateWords({ gameID: Number(gameID), setWords: setWords });

    // update countdown every second
    const updateCountdownBG = async () => {
      setTimeout(() => {
        updateCountdown({
          gameID: Number(gameID),
          setCountdown: setCountdown,
        }).then((seconds_left) => {
          seconds_left > 0.0 ? updateCountdownBG() : null;
        });
      }, 1000);
    };
    updateCountdownBG();
    wsConnect({ gameID: Number(gameID) });

    return () => {
      ws.current ? ws.current.close(1000, "user left") : "";
    };
  }, [start]);

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
        otherPlayers={otherPlayers}
        keystrokes={keystrokes.current}
        setCurrentPosition={setCurrentPosition}
      />
    </>
  );
}
