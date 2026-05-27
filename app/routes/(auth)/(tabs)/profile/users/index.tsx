import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/(tabs)/profile/users/")({
  component: UsersPage,
});

function UsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <p className="text-muted-foreground">User management coming soon...</p>
    </div>
  );
}
