import { createFileRoute } from "@tanstack/react-router";
import { OrdersFeature } from "~/features/orders";
import { AppShell } from "~/components/app-shell";

export const Route = createFileRoute("/orders/")({
  component: OrdersPage,
});

function OrdersPage() {
  return (
    <AppShell>
      <OrdersFeature />
    </AppShell>
  );
}
