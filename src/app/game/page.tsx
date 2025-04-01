"use client";
import Title from "@/components/Title";
import TypingGame from "@/components/TypingContainer";
import { SessionStoreKeys } from "@/utils/constants";
import { useEffect, Dispatch, SetStateAction, useRef, useState } from "react";
import {
  GameWordsResponse,
  GameInfo,
  GameBGMsg,
  GamePlayersResponse,
  CountdownResponse,
  Keystroke,
  Position,
  GameBGMsgEvent,
  ErrorCode,
  GameStatistics,
  ApiResponse,
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
      window.location.href = "/lobby";
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
      window.location.href = "/lobby";
    }
    return 0;
  }
  console.log("got countdown: ", data.seconds_left);
  const seconds_left = Number(data.seconds_left.toFixed(0));
  setCountdown(seconds_left);
  return seconds_left;
}

export default function Page() {
  const ws = useRef<WebSocket>(null);
  const [countdown, setCountdown] = useState<number>();
  const [words, setWords] = useState<string>();
  const [otherPlayers, setOtherPlayers] = useState<Map<string, GameInfo>>(
    new Map<string, GameInfo>(),
  );
  let gameIDRef = useRef<number>(null);
  const [start, setStart] = useState<boolean>(false);
  let startTime = useRef<Date>(null);
  const [finish, setFinish] = useState<boolean>(false);
  const [currentInput, setCurrentInput] = useState<string>("");

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
      const data: GameBGMsg = JSON.parse(raw_data);
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
      wsConnect({ gameID: gameID });
    };

    ws.current.onerror = () => {
      console.error("ws connection error, closing.");
      ws?.current?.close(1000, "unexpected error");
    };
  };

  // On keystroke
  useEffect(() => {
    if (
      typeof ws.current === null ||
      ws.current?.readyState != WebSocket.OPEN ||
      !gameIDRef.current
    ) {
      return;
    }
    const msg: GameBGMsg = {
      game_id: gameIDRef.current,
      event: GameBGMsgEvent.KEY_STOKE,
      word_index: currentPosition.wordIndex,
      char_index: currentPosition.charIndex,
    };
    ws.current?.send(JSON.stringify(msg));
  }, [currentPosition]);

  // On finish
  useEffect(() => {
    if (!finish || !gameIDRef.current || !startTime.current || !words) {
      console.log(
        "missing data to calculate statistics, finish:",
        finish,
        "gameID:",
        gameIDRef.current,
        "startTime:",
        startTime.current,
        "words:",
        words,
      );
      return;
    }
    // Process keystokes, generate statistics
    const finish_time = new Date();
    const total_minutes =
      (finish_time.getTime() - startTime.current.getTime()) / 1000 / 60;
    const total_keystrokes = keystrokes.current.length;
    const correct_keystrokes = keystrokes.current.filter(
      (keystroke) => keystroke.currect,
    ).length;

    // Get uncorrected mistakes
    let uncorrected_mistakes = 0;
    const input_words = currentInput.split(" ");
    const target_words = words.split(" ");

    for (let i = 0; i < target_words.length; i++) {
      // skip if the word is correct
      if (input_words[i] === target_words[i]) {
        continue;
      }

      // count uncorrected mistakes, including extra characters
      for (let j = 0; j < input_words[i].length; j++) {
        if (input_words[i][j] === target_words[i][j]) {
          continue;
        }
        uncorrected_mistakes += 1;
      }
    }

    // Equation From: https://www.speedtypingonline.com/typing-equations
    const statistics: GameStatistics = {
      game_id: gameIDRef.current,
      wpm: (total_keystrokes / 5 - uncorrected_mistakes) / total_minutes,
      wpm_raw: total_keystrokes / 5 / total_minutes,
      acc: (correct_keystrokes / total_keystrokes) * 100,
    };

    // Save to storage
    window.sessionStorage.setItem(
      SessionStoreKeys.GAME_STATISTICS,
      JSON.stringify(statistics),
    );

    // Send to server
    const sendStatistics = async () => {
      await fetch(`/api/v1/game/statistics`, {
        method: "POST",
        body: JSON.stringify(statistics),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((data: ApiResponse<{}>) => {
          if (!data.ok) {
            console.error("error: ", data.error);
          } else {
            console.log("statistics sent, redirecting to result page");
            window.location.href = "/result";
          }
        })
        .catch((err) => {
          console.error("error: ", err);
        });
    };
    sendStatistics();
  }, [finish]);

  // Init
  useEffect(() => {
    if (start) {
      return;
    }

    const tmpGameID = window.sessionStorage.getItem(SessionStoreKeys.GAME_ID);
    console.log("got game id:", tmpGameID);

    // redirect back to lobby if game id is not found
    if (!tmpGameID) {
      window.location.href = "/lobby";
    }
    // clear game id after first use
    // NOTE: not sure if this will cause any issues
    gameIDRef.current = Number(tmpGameID);
    window.sessionStorage.removeItem(SessionStoreKeys.GAME_ID);

    updateOtherPlayers({
      gameID: gameIDRef.current,
      setOtherPlayers: setOtherPlayers,
    });
    updateCountdown({ gameID: gameIDRef.current, setCountdown: setCountdown });
    updateWords({ gameID: gameIDRef.current, setWords: setWords });

    // update countdown every second
    const updateCountdownBG = async (gameID: number) => {
      setTimeout(() => {
        updateCountdown({
          gameID: gameID,
          setCountdown: setCountdown,
        }).then((seconds_left) => {
          seconds_left > 0.0 ? updateCountdownBG(gameID) : null;
        });
      }, 1000);
    };
    updateCountdownBG(gameIDRef.current);
    wsConnect({ gameID: gameIDRef.current });

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
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
        start={start}
        finish={finish}
        setFinish={setFinish}
        otherPlayers={otherPlayers}
        keystrokes={keystrokes.current}
        currentPosition={currentPosition}
        setCurrentPosition={setCurrentPosition}
      />
    </>
  );
}
