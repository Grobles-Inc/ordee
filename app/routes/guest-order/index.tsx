import { createFileRoute } from "@tanstack/react-router";
import { GuestOrdersFeature } from "~/features/guest-orders";
import { AppShell } from "~/components/app-shell";

export const Route = createFileRoute("/guest-order/")({
  component: GuestOrderPage,
});

function GuestOrderPage() {
  return (
    <AppShell>
      <GuestOrdersFeature />
    </AppShell>
  );
}
