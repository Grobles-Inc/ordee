import { createFileRoute } from "@tanstack/react-router";
import { TablesFeature } from "~/features/tables";

export const Route = createFileRoute("/(auth)/(tabs)/profile/tables")({
  component: TablesPage,
});

function TablesPage() {
  return <TablesFeature />;
}
