"use client";

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
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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


function ProgressOverTimeChart() {
  // TODO: remove dummy data
  const firstDate = new Date()
  const data: object[] = [];

  for (let i = 0; i < 10; i++) {
    data.push(
      {
        date: (firstDate.setMinutes(firstDate.getMinutes() + i * 2)).toString(),
        wpm: Math.floor(Math.random() * (300 - 10 + 1) + 10),
        acc: Math.floor(Math.random() * (99 - 10 + 1) + 10),
      }
    )
  }

  const tickFormatter = (value: string, index: number): string => {
    console.log(value, index)
    return `.`
  }

  const CustomToolTip = (
    { payload,
      label,
      active
    }: {
      payload?: any[],
      label?: number,
      active?: boolean
    }) => {
    if (!payload || !label || !active) {
      return null
    }
    console.log("xxxx", payload)
    const wpm = payload[0].value
    const raw_ts = payload[0].payload.date
    const acc = payload[1].value
    const ts = new Date(Math.floor(raw_ts)).toISOString()
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
  }

  const accColor = "#FFCF50"
  const wpmColor = "#0EB99B"
  const primaryWord = "#9BA4B5"

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
        className={styles.textColor}
      >
        <Line strokeWidth={2.5} yAxisId={"wpm"} type={"monotone"} dataKey={"wpm"} stroke={wpmColor} />
        <Line strokeWidth={2.5} yAxisId={"acc"} type={"monotone"} dataKey={"acc"} stroke={accColor} />
        <XAxis tick={{ fill: primaryWord }} tickFormatter={tickFormatter} />
        <YAxis tick={{ fill: wpmColor }} yAxisId={"wpm"} orientation="right" dataKey={"wpm"} />
        <YAxis tick={{ fill: accColor }} yAxisId={"acc"} orientation="left" dataKey={"acc"} />
        <Tooltip content={<CustomToolTip />} />
        <Legend verticalAlign="top" />
      </LineChart>
    </ResponsiveContainer>
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
        {/* TODO: Highlight selected button */}
        <PurpleButton action={() => setGraphSize(10)}>Last 10</PurpleButton>
        <PurpleButton action={() => setGraphSize(50)}>Last 50</PurpleButton>
        <PurpleButton action={() => setGraphSize(100)}>Last 100</PurpleButton>
        <PurpleButton action={() => setGraphSize(500)}>Last 500</PurpleButton>
        <PurpleButton action={() => setGraphSize(1000)}>Last 1000</PurpleButton>
      </div>
      {/* TODO: input graph Items */}
      <div className={styles.graph_placeholder}>
        <ProgressOverTimeChart />
      </div>
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

function HistoryPlaceholder() {
  return <div className={styles.history}>
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
    </table>
  </div>
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
    return <HistoryPlaceholder />;
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
