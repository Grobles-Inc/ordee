import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/(tabs)/profile/")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p className="text-muted-foreground">Profile feature coming soon...</p>
    </div>
  );
}
