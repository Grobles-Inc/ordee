import { createFileRoute } from "@tanstack/react-router";
import { OrdersFeature } from "~/features/orders";

export const Route = createFileRoute("/(auth)/(tabs)/orders/")({
  component: OrdersPage,
});

function OrdersPage() {
  return <OrdersFeature />;
}
