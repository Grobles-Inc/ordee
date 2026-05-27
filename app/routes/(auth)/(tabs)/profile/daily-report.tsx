import { createFileRoute } from "@tanstack/react-router";
import { DailyReportFeature } from "~/features/daily-report";

export const Route = createFileRoute("/(auth)/(tabs)/profile/daily-report")({
  component: DailyReportPage,
});

function DailyReportPage() {
  return <DailyReportFeature />;
}
