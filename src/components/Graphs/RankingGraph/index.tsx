import styles from "./RankingGraph.module.scss";
import YellowButton from "@/components/Buttons/YellowButton";
import RefreshIcon from "@/components/Icons/RefreshIcon";

function RefreshRanking() {
  return (
    <YellowButton className={styles.refresh_button}>
      <RefreshIcon />
    </YellowButton>
  );
}

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

// TODO: Get Data from Server
export default function RankingGraph() {
  return (
    <div className={styles.graph_container}>
      {/* table */}
      <RefreshRanking />
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>WPM</th>
            <th>ACC</th>
            <th>Status</th>
          </tr>
          <RankingRow
            rank={1}
            username={"AlexFangSW"}
            wpm={90}
            acc={95}
            status={"FINISHED"}
          />
          <RankingRow
            rank={2}
            username={"AlexFangSW"}
            wpm={90}
            acc={95}
            status={"FINISHED"}
          />
          <RankingRow
            rank={3}
            username={"AlexFangSW"}
            wpm={90}
            acc={95}
            status={"FINISHED"}
          />
          <RankingRow username={"AlexFangSW"} status={"DISCONNECTED"} />
          <RankingRow username={"AlexFangSW"} status={"DISCONNECTED"} />
        </tbody>
      </table>
      {/* data */}
    </div>
  );
}
