import { createFileRoute } from "@tanstack/react-router";
import { TablesFeature } from "~/features/tables";
import { AppShell } from "~/components/app-shell";

export const Route = createFileRoute("/profile/tables")({
  component: TablesPage,
});

function TablesPage() {
  return (
    <AppShell>
      <TablesFeature />
    </AppShell>
  );
}
