"use client";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import styles from "./lobby.module.scss";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import RedButton from "@/components/Buttons/RedButton";
import { SessionStoreKeys } from "@/utils/constants";
import { debounce } from "@/utils/common";
import { useSearchParams } from "next/navigation";

enum LobbyBGMsgEvent {
  INIT = "INIT",
  USER_JOINED = "USER_JOINED",
  USER_LEFT = "USER_LEFT",
  GET_TOKEN = "GET_TOKEN",
  GAME_START = "GAME_START",
}

enum QueueInType {
  RECONNECT = "reconnect",
  NEW = "new",
}

type LobbyBGMsg = {
  event: LobbyBGMsgEvent;
  game_id: number;
  guest_token_key?: string;
  user_id?: string;
};

type LobbyUserInfo = {
  id: string;
  name: string;
};

type LobbyPlayersResponse = {
  me: LobbyUserInfo;
  others: LobbyUserInfo[];
};

type LobbyCountdownResponse = {
  seconds_left: number;
};

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

function PlayerList({ players }: { players?: LobbyPlayersResponse }) {
  let me: LobbyUserInfo | null = null;
  let others: LobbyUserInfo[] = [];

  if (players) {
    me = players.me;
    others = players.others;
  }

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
        [ The game will start in{" "}
        <span className={styles.highlight}>{countdown}</span> seconds ]
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
  setPlayers: Dispatch<SetStateAction<LobbyPlayersResponse | undefined>>;
}) {
  const resp = await fetch(`/api/v1/lobby/players?game_id=${gameID}`, {
    cache: "no-store",
  });
  const data: LobbyPlayersResponse = await resp.json();
  // console.log("players: ", data)
  setPlayers(data);
}

async function updateCountdown({
  gameID,
  setCountdown,
}: {
  gameID: number;
  setCountdown: Dispatch<SetStateAction<number | undefined>>;
}) {
  const resp = await fetch(`/api/v1/lobby/countdown?game_id=${gameID}`, {
    cache: "no-store",
  });
  const data: LobbyCountdownResponse = await resp.json();
  // console.log("got countdown: ", data.seconds_left)
  setCountdown(Number(data.seconds_left.toFixed(0)));
}

export default function Page() {
  const searchParams = useSearchParams();
  const autoQueueIn = Boolean(searchParams.get("auto_queue_in"));

  const ws = useRef<WebSocket>(null);
  const redirect_triggered = useRef<boolean>(false);
  const [countdownBGID, setCountdownBGID] = useState<NodeJS.Timeout>();
  const [players, setPlayers] = useState<LobbyPlayersResponse>();
  const [isQueuedIn, setIsQueuedIn] = useState<boolean>(autoQueueIn);
  const [countdown, setCountdown] = useState<number>();
  const [gameID, setGameID] = useState<number>();
  const [tokenKey, setTokenKey] = useState<string>();

  const debouncedUpdatePlayerList = debounce(updatePlayerList, 100);
  const debouncedUpdateCountdown = debounce(updateCountdown, 100);

  const wsConnect = (): WebSocket => {
    if (gameID) {
      ws.current = new WebSocket(
        `/api/v1/lobby/queue-in/ws?prev_game_id=${gameID}&queue_in_type=${QueueInType.RECONNECT}`
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
            data.game_id.toString()
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
      if (isQueuedIn) {
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
        `ignore get token, gameID: ${gameID}, tokenKey: ${tokenKey}`
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
      if (typeof gameID === "number") {
        window.location.reload();
      }

      return;
    }
    console.log("Is queued in", isQueuedIn);
    ws.current = wsConnect();

    return () => {
      ws.current ? ws.current.close(1000, "user left") : "";
    };
  }, [isQueuedIn]);

  return (
    <div className={styles.container}>
      {/* title */}
      <h1 className={styles.lobby_title}>Lobby</h1>

      {/* player list */}
      <PlayerList players={players} />

      {/* countdown */}
      <CountdownText countdown={countdown} isQueuedIn={isQueuedIn} />

      {/* buttons */}
      <div className={styles.button_container}>
        {isQueuedIn ? (
          <RedButton action={() => setIsQueuedIn(false)}>LEAVE</RedButton>
        ) : (
          <PrimaryButton
            action={() => {
              setIsQueuedIn(true);
            }}
          >
            Queue In
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}
