import { createFileRoute } from "@tanstack/react-router";
import { MealsFeature } from "~/features/meals";

export const Route = createFileRoute("/(auth)/(tabs)/menu/")({
  component: MenuPage,
});

function MenuPage() {
  return <MealsFeature />;
}
