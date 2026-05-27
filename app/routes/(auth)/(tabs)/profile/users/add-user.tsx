import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/(tabs)/profile/users/add-user")({
  component: AddUserPage,
});

function AddUserPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add User</h1>
      <p className="text-muted-foreground">Add user form coming soon...</p>
    </div>
  );
}
