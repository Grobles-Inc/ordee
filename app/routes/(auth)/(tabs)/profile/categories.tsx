import { createFileRoute } from "@tanstack/react-router";
import { CategoriesFeature } from "~/features/categories";

export const Route = createFileRoute("/(auth)/(tabs)/profile/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  return <CategoriesFeature />;
}
