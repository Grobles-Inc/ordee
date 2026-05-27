import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/(tabs)/profile/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <p className="text-muted-foreground">Categories management coming soon...</p>
    </div>
  );
}
