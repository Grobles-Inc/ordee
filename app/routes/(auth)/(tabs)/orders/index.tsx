import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/(tabs)/orders/")({
  component: OrdersPage,
});

function OrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <p className="text-muted-foreground">Orders feature coming soon...</p>
    </div>
  );
}
