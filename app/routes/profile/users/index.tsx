import { createFileRoute } from "@tanstack/react-router";
import { AccountsFeature } from "~/features/accounts";
import { AppShell } from "~/components/app-shell";

export const Route = createFileRoute("/profile/users/")({
  component: UsersPage,
});

function UsersPage() {
  return (
    <AppShell>
      <AccountsFeature />
    </AppShell>
  );
}
