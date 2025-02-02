"use client";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import styles from "./lobby.module.scss";
import RedButton from "@/components/Buttons/RedButton";

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

function PlayerList() {
  return (
    <table className={styles.table}>
      <tbody>
        <tr>
          <th className={styles.players_header}>Players</th>
        </tr>
        <PlayerListItem isUser={true} username={"AlexFangSW"} />
        <PlayerListItem isUser={false} username={"AlexFFFFFFFFangSW"} />
        <PlayerListItem isUser={false} username={"AlexFFFFFFFFangSW"} />
        <PlayerListItem isUser={false} username={"AlexFFFFFFFFangSW"} />
        <PlayerListItem isUser={false} username={"AlexFFFFFFFFangSW"} />
      </tbody>
    </table>
  );
}

function CountdownText() {
  return (
    <div className={styles.countdown}>
      [ The game will start in <span className={styles.highlight}>30</span>{" "}
      seconds ]
    </div>
  );
}

export default function Page() {
  return (
    <div className={styles.container}>
      {/* title */}
      <h1 className={styles.lobby_title}>Lobby</h1>
      {/* player list */}
      <PlayerList />
      {/* countdown */}
      <CountdownText />
      {/* buttons */}
      <div className={styles.button_container}>
        {/* <RedButton>LEAVE</RedButton> */}
        <PrimaryButton>New Game</PrimaryButton>
      </div>
    </div>
  );
}
