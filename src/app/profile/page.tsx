"use client";

import styles from "./profile.module.scss";
import {
  ProfileGraphItems,
  ProfileHistory,
  ProfileStatistics,
  GameResultWithGameType,
  GameType,
  ProfileUserInfo,
} from "@/types";
import { useEffect, useState } from "react";
import {
  getProfileGraph,
  getProfileHistory,
  getProfileStatistics,
} from "./actions";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DarkButton from "@/components/Buttons/DarkButton";
import { getUserInfo } from "@/utils/common";

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
        <div className={styles.summary_item_title}>BEST</div>
        <div>
          <div>WPM: {bestWpm.toFixed(1)}</div>
          <div>ACC: {bestAccuracy.toFixed(1)}</div>
        </div>
      </div>
      {/* Last 10 */}
      <div className={styles.summary_item}>
        <div className={styles.summary_item_title}>LAST 10</div>
        <div>
          <div>WPM: {last10Wpm.toFixed(1)}</div>
          <div>ACC: {last10Accuracy.toFixed(1)}</div>
        </div>
      </div>
      {/* Average */}
      <div className={styles.summary_item}>
        <div className={styles.summary_item_title}>AVERAGE</div>
        <div>
          <div>WPM: {averageWpm.toFixed(1)}</div>
          <div>ACC: {averageAccuracy.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
}

function ProgressOverTimeChart({ data }: { data?: GameResultWithGameType[] }) {
  if (!data) {
    data = [
      {
        game_type: GameType.MULTI,
        game_id: 0,
        wpm: 0,
        wpm_raw: 0,
        accuracy: 0,
        finished_at: "",
        rank: 0,
      },
    ];
  }

  const tickFormatter = (value: string, index: number): string => {
    return ``;
  };

  const CustomToolTip = ({
    payload,
    active,
  }: {
    payload?: any[];
    active?: boolean;
  }) => {
    if (!payload || !active) {
      return null;
    }
    const wpm = payload[0]?.value.toFixed(1);
    const raw_ts = payload[0]?.payload.finished_at;
    const acc = payload[1]?.value.toFixed(1);
    const ts = raw_ts;
    if (active) {
      return (
        <div className={`custom-tooltip ${styles.tooltip}`}>
          <p className="label">{ts}</p>
          <hr className={`${styles.tooltip_hr}`} />
          <p className="intro">
            <li>wpm: {wpm}</li>
            <li>acc: {acc}</li>
          </p>
        </div>
      );
    }

    return null;
  };

  const accColor = "#FFCF50";
  const wpmColor = "#0EB99B";
  const axisColor = "#9ba4b5";

  return (
    <ResponsiveContainer>
      <LineChart
        width={800}
        height={500}
        data={data}
        margin={{
          top: 10,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <Line
          strokeWidth={2.5}
          yAxisId={"wpm"}
          type={"monotone"}
          dataKey={"wpm"}
          stroke={wpmColor}
        />
        <Line
          strokeWidth={2.5}
          yAxisId={"acc"}
          type={"monotone"}
          dataKey={"accuracy"}
          stroke={accColor}
        />
        <XAxis
          tick={{ fill: axisColor }}
          tickFormatter={tickFormatter}
          stroke={axisColor}
        />
        <YAxis
          tick={{ fill: wpmColor }}
          yAxisId={"wpm"}
          orientation="right"
          dataKey={"wpm"}
          stroke={axisColor}
        />
        <YAxis
          tick={{ fill: accColor }}
          yAxisId={"acc"}
          orientation="left"
          dataKey={"accuracy"}
          stroke={axisColor}
        />
        <Tooltip content={<CustomToolTip />} />
        <Legend verticalAlign="top" />
      </LineChart>
    </ResponsiveContainer>
  );
}

function ProgressOverTime({
  graphItems,
  graphSize,
  setGraphSize,
}: {
  graphItems?: ProfileGraphItems;
  graphSize: number;
  setGraphSize: (size: number) => void;
}) {
  return (
    <div className={styles.progress_over_time}>
      <div>PROGRESS OVER TIME</div>
      <div className={styles.progress_over_time_item}>
        {graphSize === 10 ? (
          <DarkButton
            action={() => setGraphSize(10)}
            className={styles.active_history_button}
          >
            Last 10
          </DarkButton>
        ) : (
          <DarkButton action={() => setGraphSize(10)}>Last 10</DarkButton>
        )}

        {graphSize === 50 ? (
          <DarkButton
            action={() => setGraphSize(50)}
            className={styles.active_history_button}
          >
            Last 50
          </DarkButton>
        ) : (
          <DarkButton action={() => setGraphSize(50)}>Last 50</DarkButton>
        )}

        {graphSize === 100 ? (
          <DarkButton
            action={() => setGraphSize(100)}
            className={styles.active_history_button}
          >
            Last 100
          </DarkButton>
        ) : (
          <DarkButton action={() => setGraphSize(100)}>Last 100</DarkButton>
        )}

        {graphSize === 1000 ? (
          <DarkButton
            action={() => setGraphSize(1000)}
            className={styles.active_history_button}
          >
            Last 1000
          </DarkButton>
        ) : (
          <DarkButton action={() => setGraphSize(1000)}>Last 1000</DarkButton>
        )}
      </div>
      <div className={styles.graph_placeholder}>
        <ProgressOverTimeChart data={graphItems?.data} />
      </div>
    </div>
  );
}

function HistoryItem({
  date,
  wpm,
  acc,
  rank,
  index,
}: {
  date: string;
  wpm: number;
  acc: number;
  rank: number;
  index: number;
}) {
  return (
    <tr>
      <td>{date}</td>
      <td>{wpm.toFixed(1)}</td>
      <td>{acc.toFixed(1)}</td>
      <td>{rank}</td>
    </tr>
  );
}

function HistoryPlaceholder() {
  return (
    <div className={styles.history}>
      {/* title */}
      <div>HISTORY</div>
      {/* records */}
      <div className={styles.history_table_container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>DATE</th>
              <th>WPM</th>
              <th>ACC</th>
              <th>RANK</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
}

function History({
  history,
  pageNum,
  setPageNum,
}: {
  history?: ProfileHistory;
  pageNum: number;
  setPageNum: (num: number) => void;
}) {
  if (!history) {
    return <HistoryPlaceholder />;
  }

  const increasePageNum = () => {
    setPageNum(pageNum + 1);
  };

  const decreasePageNum = () => {
    if (pageNum == 1) {
      return;
    }
    setPageNum(pageNum - 1);
  };

  return (
    <div className={styles.history}>
      {/* title */}
      <div>HISTORY</div>
      {/* records */}
      <div className={styles.history_table_container}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>DATE</th>
              <th>WPM</th>
              <th>ACC</th>
              <th>RANK</th>
            </tr>
          </thead>
          <tbody>
            {history.data.map((item, index) => (
              <HistoryItem
                key={item.game_id}
                date={item.finished_at}
                wpm={item.wpm}
                acc={item.accuracy}
                rank={item.rank}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>
      {/* pagination */}
      <div className={styles.history_pagination}>
        {history.has_prev_page ? (
          <DarkButton
            action={decreasePageNum}
            className={styles.history_pagination_button}
          >
            {"<"}
          </DarkButton>
        ) : (
          ""
        )}
        <div>{pageNum}</div>
        {history.has_next_page ? (
          <DarkButton
            action={increasePageNum}
            className={styles.history_pagination_button}
          >
            {">"}
          </DarkButton>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default function Page() {
  const [statistics, setStatistics] = useState<ProfileStatistics>();
  const [history, setHistory] = useState<ProfileHistory>();
  const [graph, setGraph] = useState<ProfileGraphItems>();
  const [userInfo, setUserInfo] = useState<ProfileUserInfo>();
  const [historyPage, setHistoryPage] = useState<number>(1);
  const [historySize, _] = useState<number>(20);
  const [graphSize, setGraphSize] = useState<number>(10);

  useEffect(() => {
    getUserInfo().then((data) => {
      if (data) {
        setUserInfo(data);
      } else {
        window.location.href = "/login";
      }
    });

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
      <span className={styles.username}>{userInfo?.name}</span>
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
        graphSize={graphSize}
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
