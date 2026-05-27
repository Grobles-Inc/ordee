import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/(tabs)/menu/")({
  component: MenuPage,
});

function MenuPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Menu</h1>
      <p className="text-muted-foreground">Menu feature coming soon...</p>
    </div>
  );
}
