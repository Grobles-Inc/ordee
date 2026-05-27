import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "~/components/app-shell";

export const Route = createFileRoute("/profile/")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <AppShell>
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account and settings</p>
      </div>
    </AppShell>
  );
}
