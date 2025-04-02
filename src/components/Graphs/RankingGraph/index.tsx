import { UNDEFINED_RANKING } from "@/utils/constants";
import styles from "./RankingGraph.module.scss";
import { GameUserInfo } from "@/types";

function RankingRow({
  isUser,
  rank,
  username,
  wpm,
  acc,
  status,
}: {
  isUser: boolean;
  rank?: number;
  username: string;
  wpm?: number;
  acc?: number;
  status: string;
}) {
  return (
    <>
      <tr>
        <td>{rank !== UNDEFINED_RANKING ? rank : ""}</td>
        <td className={`${isUser ? styles.is_current_user : ""}`}>
          {username}
        </td>
        <td>{typeof wpm !== undefined ? wpm?.toFixed(1) : ""}</td>
        <td>{typeof acc !== undefined ? acc?.toFixed(1) : ""}</td>
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
  );
}

export default function RankingGraph({
  userID,
  gameResult,
}: {
  userID?: string;
  gameResult: GameUserInfo[];
}) {
  if (gameResult.length === 0 || !userID) {
    return <RankingGraphPlaceholder />;
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
          {gameResult.map((user, index) => {
            return (
              <RankingRow
                key={index}
                isUser={user.id === userID}
                rank={user.rank}
                username={user.name}
                wpm={user.wpm}
                acc={user.acc}
                status={user.finished ? "FINISHED" : "IN PROGRESS"}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
