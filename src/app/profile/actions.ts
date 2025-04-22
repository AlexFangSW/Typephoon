import {
  ProfileGraphItems,
  ProfileGraphResponse,
  ProfileHistory,
  ProfileHistoryResponse,
  ProfileStatistics,
  ProfileStatisticsResponse,
} from "@/types";
import { authFetch } from "@/utils/common";

export async function getProfileStatistics(): Promise<ProfileStatistics | null> {
  const data = await authFetch<ProfileStatisticsResponse>(
    "/api/v1/profile/statistics",
    {
      cache: "no-store",
    },
  );
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

export async function getProfileGraph(
  size: number,
): Promise<ProfileGraphItems | null> {
  const data = await authFetch<ProfileGraphResponse>(
    `/api/v1/profile/graph?size=${size}`,
    {
      cache: "no-store",
    },
  );
  if (!data.ok) {
    console.error(data.error);
    return null;
  }
  return {
    data: data.data,
  };
}

export async function getProfileHistory({
  page,
  size,
}: {
  page: number;
  size: number;
}): Promise<ProfileHistory | null> {
  const data = await authFetch<ProfileHistoryResponse>(
    `/api/v1/profile/history?page=${page}&size=${size}`,
    {
      cache: "no-store",
    },
  );
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
