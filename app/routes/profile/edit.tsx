import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/edit")({
  component: EditProfilePage,
});

function EditProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <p className="text-muted-foreground">Edit profile form coming soon...</p>
    </div>
  );
}
