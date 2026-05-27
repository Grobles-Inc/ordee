import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/(tabs)/menu/add-meal")({
  component: AddMealPage,
});

function AddMealPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add Meal</h1>
      <p className="text-muted-foreground">Add meal form coming soon...</p>
    </div>
  );
}
