import styles from "./RankingGraph.module.scss";
import { GameUserInfo } from "@/types";

function RankingRow({
  rank,
  username,
  wpm,
  acc,
  status,
}: {
  rank?: number;
  username: string;
  wpm?: number;
  acc?: number;
  status: string;
}) {
  return (
    <>
      <tr>
        <td>{rank ? rank : ""}</td>
        <td>{username}</td>
        <td>{wpm ? wpm : ""}</td>
        <td>{acc ? acc : ""}</td>
        <td>{status}</td>
      </tr>
    </>
  );
}

function RankingGraphPlaceholder() {
  return (
    <div className={styles.graph_container}>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>WPM</th>
            <th>ACC</th>
            <th>Status</th>
          </tr>
        </tbody>
      </table>
      <span className={styles.placeholder_text}>NO DATA</span>
    </div>
  )
}

export default function RankingGraph({
  gameResult,
}: {
  gameResult: GameUserInfo[];
}) {
  if (gameResult.length === 0) {
    return <RankingGraphPlaceholder />
  }

  return (
    <div className={styles.graph_container}>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>WPM</th>
            <th>ACC</th>
            <th>Status</th>
          </tr>
          {gameResult.map((user, index) => (
            <RankingRow
              key={index}
              rank={user.rank}
              username={user.name}
              wpm={user.wpm}
              acc={user.acc}
              status={user.finished ? "FINISHED" : "IN PROGRESS"}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
