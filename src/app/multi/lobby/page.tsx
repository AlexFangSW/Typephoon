"use client";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import styles from "./lobby.module.scss";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import RedButton from "@/components/Buttons/RedButton";

type LobbyUserInfo = {
  id: string
  name: string
}

type LobbyPlayersResponse = {
  me: LobbyUserInfo
  others: LobbyUserInfo[]
}

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

function PlayerList({ players }: { players: LobbyPlayersResponse | undefined }) {
  let me: LobbyUserInfo | undefined = undefined
  let others: LobbyUserInfo[] = []

  if (players) {
    me = players.me
    others = players.others
  }

  const placeholderCount = (4 - others.length)
  for (let i = 0; i < placeholderCount; i++) {
    others.push({ id: "", name: "" })
  }

  return (
    <table className={styles.table}>
      <tbody>
        <tr>
          <th className={styles.players_header}>Players</th>
        </tr>
        <PlayerListItem key={"user"} isUser={true} username={me ? me.name : ""} />
        {others.map((item, index) => <PlayerListItem key={index} isUser={false} username={item.name} />)}
      </tbody>
    </table>
  );
}

function CountdownText({ countdown }: { countdown: number }) {
  return (
    <div className={styles.countdown}>
      [ The game will start in <span className={styles.highlight}>{countdown}</span>{" "}
      seconds ]
    </div>
  );
}


export default function Page() {
  // Click new game, start WS connection, fetch lobby info on each WS trigger
  // Leave game when LEAVE button is clicked or when user closes tab, send disconnect message, close WS connection
  // Pool countdown every second, consider network latency
  // When countdown reaches 0, WS will send start game message, frontend will redirect to game page
  // If WS send reconect message, reconnect WS.

  const ws = useRef<WebSocket | null>(null)
  const [players, setPlayers] = useState<LobbyPlayersResponse | undefined>()
  const [isQueuedIn, setIsQueuedIn] = useState(false)
  const [countdown, setCountdown] = useState(-1)
  const [gameID, setGameID] = useState("")

  useEffect(() => {
    if (!isQueuedIn) {
      return
    }
    console.log("Is queued in", isQueuedIn)
    ws.current = new WebSocket(`/api/v1/lobby/queue-in/ws`)

    // nothing to do here
    ws.current.onopen = () => { console.log("websocket opened") }

    // receive update event and fetch new player list
    ws.current.onmessage = async (ev) => {
      // got message
      const raw_data = await ev.data
      const data = JSON.parse(raw_data)
      console.log("websocket got message: ", data)
      if (data?.event === "INIT") {
        console.log("set game id", data.game_id)
        setGameID(data.game_id)
      }

      // send message
      const textMsg = JSON.stringify({ event: 'PONG' })
      console.log("Sending ", textMsg)
      ws.current?.send(textMsg)

      await fetch(`/api/v1/lobby/players?game_id=${data.game_id}`)
        .then((data) => data.json())
        .then((data) => console.log("players: ", data))
        .catch((error) => { console.log("fetch error~~", error) })
    }

    // Implement reconnect (with prev-game-id)
    ws.current.onclose = () => { console.log("websocket closed") }

    return () => {
      ws.current ? ws.current.close(1000, "user left") : ""
    }
  }, [isQueuedIn])

  return (
    <div className={styles.container}>
      {/* title */}
      <h1 className={styles.lobby_title}>Lobby</h1>

      {/* player list */}
      <PlayerList players={players} />

      {/* countdown */}
      {isQueuedIn ? <CountdownText countdown={countdown} /> : ""}

      {/* buttons */}
      <div className={styles.button_container}>
        {isQueuedIn ? <RedButton action={() => setIsQueuedIn(false)}>LEAVE</RedButton> : <PrimaryButton action={() => { setIsQueuedIn(true) }}>New Game</PrimaryButton>}
      </div>
    </div>
  );
}
