import { createFileRoute } from "@tanstack/react-router";
import { CategoriesFeature } from "~/features/categories";
import { AppShell } from "~/components/app-shell";

export const Route = createFileRoute("/profile/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <AppShell>
      <CategoriesFeature />
    </AppShell>
  );
}
