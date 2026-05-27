import { createFileRoute } from "@tanstack/react-router";
import { MealsFeature } from "~/features/meals";
import { AppShell } from "~/components/app-shell";

export const Route = createFileRoute("/menu/")({
  component: MenuPage,
});

function MenuPage() {
  return (
    <AppShell>
      <MealsFeature />
    </AppShell>
  );
}
