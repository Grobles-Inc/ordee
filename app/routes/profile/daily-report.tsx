import { createFileRoute } from "@tanstack/react-router";
import { DailyReportFeature } from "~/features/daily-report";
import { AppShell } from "~/components/app-shell";

export const Route = createFileRoute("/profile/daily-report")({
  component: DailyReportPage,
});

function DailyReportPage() {
  return (
    <AppShell>
      <DailyReportFeature />
    </AppShell>
  );
}
