import { createFileRoute } from "@tanstack/react-router";
import { MembershipFeature } from "~/features/membership";
import { AppShell } from "~/components/app-shell";

export const Route = createFileRoute("/profile/membership/")({
  component: MembershipPage,
});

function MembershipPage() {
  return (
    <AppShell>
      <MembershipFeature />
    </AppShell>
  );
}
