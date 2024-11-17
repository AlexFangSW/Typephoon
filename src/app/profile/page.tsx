import GraphDummy from "@/components/Graphs/GraphDummy";
import styles from "./profile.module.scss";
import PurpleButton from "@/components/Buttons/PurpleButton";
import PrimaryButton from "@/components/Buttons/PrimaryButton";

function Summary({
  bestWpm,
  bestAccuracy,
  last10Wpm,
  last10Accuracy,
  averageWpm,
  averageAccuracy,
}: {
  bestWpm: number;
  bestAccuracy: number;
  last10Wpm: number;
  last10Accuracy: number;
  averageWpm: number;
  averageAccuracy: number;
}) {
  return (
    <div className={styles.summary}>
      {/* Best  */}
      <div className={styles.summary_item}>
        <div>BEST</div>
        <div>
          <div>WPM: {bestWpm}</div>
          <div>ACC: {bestAccuracy}</div>
        </div>
      </div>
      {/* Last 10 */}
      <div className={styles.summary_item}>
        <div>LAST 10</div>
        <div>
          <div>WPM: {last10Wpm}</div>
          <div>ACC: {last10Accuracy}</div>
        </div>
      </div>
      {/* Average */}
      <div className={styles.summary_item}>
        <div>AVERAGE</div>
        <div>
          <div>WPM: {averageWpm}</div>
          <div>ACC: {averageAccuracy}</div>
        </div>
      </div>
    </div>
  );
}

async function ProgressOverTime() {
  return (
    <div className={styles.progress_over_time}>
      <div>PROGRESS OVER TIME</div>
      <div className={styles.progress_over_time_item}>
        <PurpleButton>DAY</PurpleButton>
        <PurpleButton>WEEK</PurpleButton>
        <PurpleButton>MONTH</PurpleButton>
        <PurpleButton>YEAR</PurpleButton>
        <PurpleButton>ALL TIME</PurpleButton>
      </div>
      <GraphDummy />
    </div>
  );
}

function HistoryItem({
  date,
  wpm,
  acc,
  type,
  id,
  replay,
}: {
  date: string;
  wpm: number;
  acc: number;
  type: string;
  id: string;
  replay: boolean;
}) {
  return (
    <tr>
      <td>{date}</td>
      <td>{wpm}</td>
      <td>{acc}</td>
      <td>{type}</td>
      <td>{replay && <PurpleButton>REPLAY</PurpleButton>}</td>
    </tr>
  );
}

type HistoryItemType = {
  date: string;
  wpm: number;
  acc: number;
  type: string;
  id: string;
  replay: boolean;
};

function History() {
  const history: HistoryItemType[] = [
    {
      date: "2024-01-01",
      wpm: 111,
      acc: 111,
      type: "SOLO",
      id: "1",
      replay: true,
    },
    {
      date: "2024-01-02",
      wpm: 111,
      acc: 111,
      type: "TEAM",
      id: "2",
      replay: true,
    },
    {
      date: "2024-01-02",
      wpm: 111,
      acc: 111,
      type: "SOLO",
      id: "3",
      replay: true,
    },
    {
      date: "2024-01-02",
      wpm: 111,
      acc: 111,
      type: "RANDOM",
      id: "4",
      replay: false,
    },
    {
      date: "2024-01-02",
      wpm: 111,
      acc: 111,
      type: "RANDOM",
      id: "5",
      replay: false,
    },
  ];
  return (
    <div className={styles.history}>
      {/* title */}
      <div>HISTORY</div>
      {/* records */}
      <table>
        <thead>
          <tr>
            <th>DATE</th>
            <th>WPM</th>
            <th>ACC</th>
            <th>TYPE</th>
            <th>REPLAY</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <HistoryItem key={item.id} {...item} />
          ))}
        </tbody>
      </table>
      {/* pagination */}
      <div className={styles.history_pagination}>
        <PrimaryButton>{"<"}</PrimaryButton>
        <div>1</div>
        <PrimaryButton>{">"}</PrimaryButton>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className={styles.container}>
      {/* summary */}
      <Summary
        bestWpm={111}
        bestAccuracy={111}
        last10Wpm={111}
        last10Accuracy={111}
        averageWpm={111}
        averageAccuracy={111}
      />

      {/* progress over time */}
      <ProgressOverTime />

      {/* history */}
      <History />
    </div>
  );
}
