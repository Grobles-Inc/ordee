import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/(tabs)/profile/daily-report")({
  component: DailyReportPage,
});

function DailyReportPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Daily Report</h1>
      <p className="text-muted-foreground">Daily report coming soon...</p>
    </div>
  );
}
