import { StatsCards } from "./components/stats-cards";
import { HourlyTable } from "./components/hourly-table";
import { useDailyStats, useHourlyData } from "./api/queries";
import { useAuth } from "~/hooks/use-auth";

export function DailyReportFeature() {
  const { profile } = useAuth();
  const tenantId = profile?.idTenant;

  const { data: stats, isLoading: statsLoading } = useDailyStats(
    tenantId ?? ""
  );
  const { data: hourlyData = [], isLoading: hourlyLoading } = useHourlyData(
    tenantId ?? ""
  );

  if (statsLoading || hourlyLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading report...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Daily Report</h1>
        <p className="text-muted-foreground">
          View today's order and revenue statistics
        </p>
      </div>

      {stats && <StatsCards stats={stats} />}

      <HourlyTable data={hourlyData} />
    </div>
  );
}

export { StatsCards } from "./components/stats-cards";
export { HourlyTable } from "./components/hourly-table";
export * from "./api/queries";
export * from "./api/types";
