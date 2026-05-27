import { useQuery } from "@tanstack/react-query";
import { getDailyStats, getHourlyData } from "./db";

export const dailyReportKeys = {
  all: ["daily-report"] as const,
  stats: (tenantId: string) => [...dailyReportKeys.all, "stats", tenantId] as const,
  hourly: (tenantId: string) => [...dailyReportKeys.all, "hourly", tenantId] as const,
};

export function useDailyStats(tenantId: string) {
  return useQuery({
    queryKey: dailyReportKeys.stats(tenantId),
    queryFn: () => getDailyStats(tenantId),
    enabled: !!tenantId,
  });
}

export function useHourlyData(tenantId: string) {
  return useQuery({
    queryKey: dailyReportKeys.hourly(tenantId),
    queryFn: () => getHourlyData(tenantId),
    enabled: !!tenantId,
  });
}
