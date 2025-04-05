"use client";
import Title from "@/components/Title";
import TypingGame from "@/components/TypingContainer";
import { SessionStoreKeys } from "@/utils/constants";
import { useEffect, useRef, useState } from "react";
import { updateWords, updateOtherPlayers, updateCountdown } from "./actions";
import {
  GameInfo,
  GameBGMsg,
  Keystroke,
  Position,
  GameBGMsgEvent,
  GameStatistics,
  ApiResponse,
} from "@/types";

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
    charIndex: -1,
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
          setOtherPlayers((prev) => {
            if (typeof data.user_id === "undefined") {
              return prev;
            }

            const newMap = new Map(prev);
            let player = prev.get(data.user_id);
            if (!player) {
              return prev;
            }

            player.charIndex =
              typeof data.char_index !== "undefined"
                ? data.char_index
                : player.charIndex;
            player.wordIndex =
              typeof data.word_index !== "undefined"
                ? data.word_index
                : player.wordIndex;
            newMap.set(data.user_id, player);

            return newMap;
          });
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
    const finishTime = new Date();
    const totalMinutes =
      (finishTime.getTime() - startTime.current.getTime()) / 1000 / 60;
    const totalKeystrokes = keystrokes.current.length;
    const correctKeystrokes = keystrokes.current.filter(
      (keystroke) => keystroke.currect,
    ).length;

    // Get total correct characters (include space)
    const inputWords = currentInput.split(" ");
    const targetWords = words.split(" ");
    const totalChar = words.length;
    let totalCorrectChar = targetWords.length - 1;
    for (let i = 0; i < targetWords.length; i++) {
      if (inputWords[i] === targetWords[i]) {
        totalCorrectChar = totalCorrectChar + targetWords[i].length;
      }
    }

    // Reference: https://monkeytype.com/about
    const statistics: GameStatistics = {
      game_id: gameIDRef.current,
      wpm: totalCorrectChar / 5 / totalMinutes,
      wpm_raw: totalChar / 5 / totalMinutes,
      acc: (correctKeystrokes / totalKeystrokes) * 100,
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
    updateCountdown({
      gameID: gameIDRef.current,
      setCountdown: setCountdown,
    });
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
