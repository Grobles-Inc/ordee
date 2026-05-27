import { createFileRoute } from "@tanstack/react-router";
import { PaymentsFeature } from "~/features/payments";
import { AppShell } from "~/components/app-shell";

export const Route = createFileRoute("/payments/")({
  component: PaymentsPage,
});

function PaymentsPage() {
  return (
    <AppShell>
      <PaymentsFeature />
    </AppShell>
  );
}
