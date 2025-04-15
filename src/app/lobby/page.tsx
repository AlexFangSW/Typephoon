"use client";
import styles from "./lobby.module.scss";
import { useEffect, useRef, useState } from "react";
import { SessionStoreKeys } from "@/utils/constants";
import { authFetch, debounce, refreshAccessToken } from "@/utils/common";
import { useSearchParams } from "next/navigation";
import {
  LobbyUserInfo,
  LobbyPlayersResponse,
  LobbyCountdownResponse,
  LobbyBGMsgEvent,
  LobbyBGMsg,
  QueueInType,
} from "@/types";
import DarkButton from "@/components/Buttons/DarkButton";
function PlayerListItem({
  isUser,
  username,
}: {
  isUser: boolean;
  username: string;
}) {
  return (
    <tr>
      <td className={isUser ? styles.me : ""}>{username}</td>
    </tr>
  );
}

function PlayerList({
  me,
  others,
}: {
  me?: LobbyUserInfo;
  others: LobbyUserInfo[];
}) {
  const placeholderCount = 4 - others?.length;
  for (let i = 0; i < placeholderCount; i++) {
    others.push({ id: "", name: "" });
  }

  return (
    <table className={styles.table}>
      <tbody>
        <tr>
          <th className={styles.players_header}>Players</th>
        </tr>
        <PlayerListItem
          key={"user"}
          isUser={true}
          username={me ? me.name : ""}
        />
        {others.map((item, index) => (
          <PlayerListItem key={index} isUser={false} username={item.name} />
        ))}
      </tbody>
    </table>
  );
}

function CountdownText({
  isQueuedIn,
  countdown,
}: {
  isQueuedIn: boolean;
  countdown?: number;
}) {
  if (isQueuedIn && typeof countdown === "number") {
    return (
      <div className={styles.countdown}>
        [ The game will start in
        <span className={styles.highlight}> {countdown}</span> seconds ]
      </div>
    );
  } else {
    return <div className={styles.countdown_hidden}>""</div>;
  }
}

async function updatePlayerList({
  gameID,
  setPlayers,
}: {
  gameID: number;
  setPlayers: (arg: LobbyPlayersResponse) => void;
}) {
  const data = await authFetch<LobbyPlayersResponse>(
    `/api/v1/lobby/players?game_id=${gameID}`,
    {
      cache: "no-store",
    },
  );
  // console.log("players: ", data)
  setPlayers(data);
}

async function updateCountdown({
  gameID,
  setCountdown,
}: {
  gameID: number;
  setCountdown: (arg: number) => void;
}) {
  const resp = await fetch(`/api/v1/lobby/countdown?game_id=${gameID}`, {
    cache: "no-store",
  });
  const data: LobbyCountdownResponse = await resp.json();
  if (!data.ok) {
    console.log("get countdown error", data.error);
    return;
  }
  // console.log("got countdown: ", data.seconds_left)
  setCountdown(Number(data.seconds_left.toFixed(0)));
}

export default function Page() {
  const ws = useRef<WebSocket>(null);
  const redirect_triggered = useRef<boolean>(false);
  const [countdownBGID, setCountdownBGID] = useState<NodeJS.Timeout>();
  const [players, setPlayers] = useState<LobbyPlayersResponse>();
  const [isQueuedIn, setIsQueuedIn] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>();
  const [gameID, setGameID] = useState<number>();
  const [tokenKey, setTokenKey] = useState<string>();

  const debouncedUpdatePlayerList = debounce(updatePlayerList, 100);
  const debouncedUpdateCountdown = debounce(updateCountdown, 100);

  const wsConnect = (): WebSocket => {
    if (gameID) {
      ws.current = new WebSocket(
        `/api/v1/lobby/queue-in/ws?prev_game_id=${gameID}&queue_in_type=${QueueInType.RECONNECT}`,
      );
    } else {
      ws.current = new WebSocket(`/api/v1/lobby/queue-in/ws`);
    }

    // nothing to do here
    ws.current.onopen = () => {
      console.log("websocket opened");
    };

    // receive update event and fetch new player list
    ws.current.onmessage = async (ev) => {
      if (!isQueuedIn || redirect_triggered.current) {
        return;
      }

      // got message
      const raw_data = await ev.data;
      const data: LobbyBGMsg = JSON.parse(raw_data);
      console.log("got message:", data);

      switch (data.event) {
        case LobbyBGMsgEvent.INIT:
          window.sessionStorage.setItem(
            SessionStoreKeys.GAME_ID,
            data.game_id.toString(),
          );
          setGameID(data.game_id);
          break;

        case LobbyBGMsgEvent.USER_JOINED:
          await debouncedUpdatePlayerList({
            gameID: data.game_id,
            setPlayers: setPlayers,
          });
          break;

        case LobbyBGMsgEvent.USER_LEFT:
          await updatePlayerList({
            gameID: data.game_id,
            setPlayers: setPlayers,
          });
          break;

        case LobbyBGMsgEvent.GET_TOKEN:
          if (!!data.guest_token_key) {
            setTokenKey(data.guest_token_key);
          } else {
            console.error("get token without giving token key !!");
          }
          break;

        case LobbyBGMsgEvent.GAME_START:
          // redirect and start the game
          window.location.href = "/game";
          redirect_triggered.current = true;

        default:
          console.log("unknown ws event", data.event);
          break;
      }
    };

    ws.current.onclose = async () => {
      console.log("websocket closed");
      if (ws.current) {
        // reconnect
        console.log("try ws reconnect");
        ws.current = wsConnect();
      }
    };

    ws.current.onerror = () => {
      console.error("ws connection error, closing.");
      ws?.current?.close(1000, "unexpected error");
    };

    return ws.current;
  };

  // check search params
  useEffect(() => {
    const searchParams = useSearchParams();
    const autoQueueIn = Boolean(searchParams.get("auto_queue_in"));
    if (autoQueueIn) {
      setIsQueuedIn(true);
    }
  }, []);

  // countdown background task
  useEffect(() => {
    if (!isQueuedIn || gameID === undefined) {
      return;
    }

    const startCountdownInterval = () => {
      debouncedUpdateCountdown({ gameID: gameID, setCountdown: setCountdown });
      return setInterval(updateCountdown, 1000, {
        gameID: gameID,
        setCountdown: setCountdown,
      });
    };
    let countdownIntervalID = startCountdownInterval();

    setCountdownBGID(countdownIntervalID);
  }, [isQueuedIn, gameID]);

  // get guest access token
  useEffect(() => {
    if (gameID === undefined || tokenKey === undefined) {
      console.warn(
        `ignore get token, gameID: ${gameID}, tokenKey: ${tokenKey}`,
      );
      return;
    }
    // access token will be set as cookie
    fetch(`/api/v1/auth/guest-token?key=${tokenKey}`, { cache: "no-store" });
  }, [tokenKey, gameID]);

  // queue in event
  useEffect(() => {
    if (!isQueuedIn) {
      clearInterval(countdownBGID);
      setPlayers(undefined);
      setTokenKey(undefined);
      setGameID(undefined);
      ws.current = null;
      if (typeof gameID === "number") {
        window.location.href = "/lobby";
      }

      return;
    }
    console.log("Is queued in", isQueuedIn);
    refreshAccessToken().then(() => {
      ws.current = wsConnect();
    });

    return () => {
      ws.current ? ws.current.close(1000, "user left") : "";
    };
  }, [isQueuedIn]);

  return (
    <div className={styles.container}>
      {/* title */}
      <h1 className={styles.lobby_title}>Lobby</h1>

      {/* player list */}
      <PlayerList
        me={players?.ok ? players?.me : undefined}
        others={players?.ok ? players.others : []}
      />

      {/* countdown */}
      <CountdownText countdown={countdown} isQueuedIn={isQueuedIn} />

      {/* buttons */}
      <div className={styles.button_container}>
        {isQueuedIn ? (
          <DarkButton
            action={() => setIsQueuedIn(false)}
            className={styles.leave_button}
          >
            LEAVE
          </DarkButton>
        ) : (
          <DarkButton
            action={() => {
              setIsQueuedIn(true);
            }}
            className={styles.queue_in_button}
          >
            Queue In
          </DarkButton>
        )}
      </div>
    </div>
  );
}
