import {
  ProfileGraphItems,
  ProfileGraphResponse,
  ProfileHistory,
  ProfileHistoryResponse,
  ProfileStatistics,
  ProfileStatisticsResponse,
} from "@/types";

export async function getProfileStatistics(): Promise<ProfileStatistics | null> {
  const response = await fetch("/api/profile/statistics");
  const data: ProfileStatisticsResponse = await response.json();
  if (!data.ok) {
    console.error(data.error);
    return null;
  }
  return {
    total_games: data.total_games,
    wpm_best: data.wpm_best,
    acc_best: data.acc_best,
    wpm_avg_10: data.wpm_avg_10,
    acc_avg_10: data.acc_avg_10,
    wpm_avg_all: data.wpm_avg_all,
    acc_avg_all: data.acc_avg_all,
  };
}

export async function getProfileGraph(size: number): Promise<ProfileGraphItems | null> {
  const response = await fetch(`/api/profile/graphs?size=${size}`);
  const data: ProfileGraphResponse = await response.json();
  if (!data.ok) {
    console.error(data.error);
    return null;
  }
  return {
    data: data.data,
  };
}

export async function getProfileHistory(
  {
    page,
    size,
  }: {
    page: number
    size: number
  }): Promise<ProfileHistory | null> {
  const response = await fetch(`/api/profile/history?page=${page}&size=${size}`);
  const data: ProfileHistoryResponse = await response.json();
  if (!data.ok) {
    console.error(data.error);
    return null;
  }
  return {
    total: data.total,
    has_prev_page: data.has_prev_page,
    has_next_page: data.has_next_page,
    data: data.data,
  };
}

