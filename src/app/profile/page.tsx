"use client";

import GraphDummy from "@/components/Graphs/GraphDummy";
import styles from "./profile.module.scss";
import PurpleButton from "@/components/Buttons/PurpleButton";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import {
  ProfileGraphItems,
  ProfileHistory,
  ProfileStatistics,
} from "@/types";
import { useEffect, useState } from "react";
import {
  getProfileGraph,
  getProfileHistory,
  getProfileStatistics,
} from "./actions";

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

function ProgressOverTime({
  graphItems,
  setGraphSize,
}: {
  graphItems: ProfileGraphItems | null;
  setGraphSize: (size: number) => void;
}) {
  return (
    <div className={styles.progress_over_time}>
      <div>PROGRESS OVER TIME</div>
      <div className={styles.progress_over_time_item}>
        <PurpleButton action={() => setGraphSize(10)}>Last 10</PurpleButton>
        <PurpleButton action={() => setGraphSize(50)}>Last 50</PurpleButton>
        <PurpleButton action={() => setGraphSize(100)}>Last 100</PurpleButton>
        <PurpleButton action={() => setGraphSize(500)}>Last 500</PurpleButton>
        <PurpleButton action={() => setGraphSize(1000)}>Last 1000</PurpleButton>
      </div>
      {/* TODO: Find a graph component */}
      <GraphDummy />
    </div>
  );
}

function HistoryItem({
  date,
  wpm,
  acc,
  rank,
}: {
  date: string;
  wpm: number;
  acc: number;
  rank: number;
}) {
  return (
    <tr>
      <td>{date}</td>
      <td>{wpm}</td>
      <td>{acc}</td>
      <td>{rank}</td>
    </tr>
  );
}

function History({
  history,
  pageNum,
  setPageNum,
}: {
  history: ProfileHistory | null,
  pageNum: number
  setPageNum: (num: number) => void
}) {
  if (!history) {
    return null;
  }

  const increasePageNum = () => {
    setPageNum(pageNum + 1)
  }

  const decreasePageNum = () => {
    if (pageNum == 1) {
      return
    }
    setPageNum(pageNum - 1)
  }

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
          </tr>
        </thead>
        <tbody>
          {history.data.map((item) => (
            <HistoryItem key={item.game_id}
              date={item.finished_at}
              wpm={item.wpm}
              acc={item.accuracy}
              rank={item.rank}
            />
          ))}
        </tbody>
      </table>
      {/* pagination */}
      <div className={styles.history_pagination}>
        {history.has_prev_page ? <PrimaryButton action={decreasePageNum}>{"<"}</PrimaryButton> : ""}
        <div>{pageNum}</div>
        {history.has_next_page ? <PrimaryButton action={increasePageNum}>{">"}</PrimaryButton> : ""}
      </div>
    </div>
  );
}

export default function Page() {
  const [statistics, setStatistics] = useState<ProfileStatistics | null>(null);
  const [history, setHistory] = useState<ProfileHistory | null>(null);
  const [graph, setGraph] = useState<ProfileGraphItems | null>(null);
  const [historyPage, setHistoryPage] = useState<number>(1);
  const [historySize, setHistorySize] = useState<number>(20);
  const [graphSize, setGraphSize] = useState<number>(10);

  useEffect(() => {
    getProfileStatistics().then((data) => {
      if (data) {
        setStatistics(data);
      }
    });
  }, []);

  useEffect(() => {
    getProfileHistory({ page: historyPage, size: historySize }).then((data) => {
      if (data) {
        setHistory(data);
      }
    });
  }, [historyPage, historySize]);

  useEffect(() => {
    getProfileGraph(graphSize).then((data) => {
      if (data) {
        setGraph(data);
      }
    });
  }, [graphSize]);

  return (
    <div className={styles.container}>
      <Summary
        bestWpm={statistics?.wpm_best ?? 0}
        bestAccuracy={statistics?.acc_best ?? 0}
        last10Wpm={statistics?.wpm_avg_10 ?? 0}
        last10Accuracy={statistics?.acc_avg_10 ?? 0}
        averageWpm={statistics?.wpm_avg_all ?? 0}
        averageAccuracy={statistics?.acc_avg_all ?? 0}
      />

      <ProgressOverTime
        graphItems={graph}
        setGraphSize={setGraphSize}
      />

      <History
        history={history}
        pageNum={historyPage}
        setPageNum={setHistoryPage}
      />
    </div>
  );
}
